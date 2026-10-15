"use strict";

importScripts(
  "js/defaults.js",
  "js/i18n.js",
  "js/init.js",
  "js/background.js",
  "imagus/js/background-mv3.js"
);

const HLS_COMMANDS = new Set([
  "probeHls",
  "startHlsDownload",
  "getHlsDownloadJobs",
  "setHlsPopupPanel",
  "cancelHlsDownload"
]);
const OFFSCREEN_CLOSE_ALARM = "wma-close-hls-offscreen";
const OFFSCREEN_IDLE_MINUTES = 1;

let creatingOffscreenDocument;

async function hasOffscreenDocument() {
  if (chrome.offscreen.hasDocument) return chrome.offscreen.hasDocument();
  const documentUrl = chrome.runtime.getURL("offscreen.html");
  if (chrome.runtime.getContexts) {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [documentUrl]
    });
    return contexts.length > 0;
  }
  const matchedClients = await clients.matchAll();
  return matchedClients.some(client => client.url === documentUrl);
}

async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) return;
  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["BLOBS", "WORKERS"],
      justification: "Download, merge, and save user-selected HLS media without keeping the popup open."
    }).finally(() => { creatingOffscreenDocument = null; });
  }
  await creatingOffscreenDocument;
}

function cancelOffscreenClose() {
  chrome.alarms.clear(OFFSCREEN_CLOSE_ALARM, () => void chrome.runtime.lastError);
}

function scheduleOffscreenClose() {
  chrome.alarms.create(OFFSCREEN_CLOSE_ALARM, { delayInMinutes: OFFSCREEN_IDLE_MINUTES });
}

async function closeOffscreenIfIdle() {
  if (!await hasOffscreenDocument()) return;
  let state;
  try {
    state = await sendToOffscreen({ __wmaInternal: "getRuntimeState" });
  } catch (_) {
    return;
  }
  if (!state || state.jobs || state.pendingDownloads || state.activeOperations) return;
  await chrome.offscreen.closeDocument();
}

function sendToOffscreen(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ ...message, __wmaTarget: "hls-offscreen" }, response => {
      const error = chrome.runtime.lastError;
      if (error) reject(new Error(error.message));
      else resolve(response);
    });
  });
}

function escapeRegex(value) {
  return String(value).replace(/[\\^$.*+?()[\]{}|/]/g, "\\$&");
}

async function addRefererRule(url, referer) {
  const rules = await chrome.declarativeNetRequest.getSessionRules();
  const used = new Set(rules.map(rule => rule.id));
  let ruleId = 100000;
  while (used.has(ruleId)) ruleId++;
  const requestHeaders = [{ header: "referer", operation: "set", value: referer }];
  try {
    requestHeaders.push({ header: "origin", operation: "set", value: new URL(referer).origin });
  } catch (_) {}
  await chrome.declarativeNetRequest.updateSessionRules({
    addRules: [{
      id: ruleId,
      priority: 1,
      action: { type: "modifyHeaders", requestHeaders },
      condition: {
        regexFilter: "^" + escapeRegex(new URL(url).href.split("#")[0]) + "(?:#.*)?$",
        resourceTypes: ["xmlhttprequest"]
      }
    }]
  });
  return ruleId;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.__wmaTarget) return false;

  if (message.Message === "hlsDownloadProgress") {
    if (["complete", "error", "cancelled"].includes(message.state)) scheduleOffscreenClose();
    return false;
  }

  if (HLS_COMMANDS.has(message.Message)) {
    cancelOffscreenClose();
    ensureOffscreenDocument()
      .then(() => sendToOffscreen(message))
      .then(response => {
        sendResponse(response);
        if (message.Message !== "startHlsDownload" || !response || response.ok !== true) scheduleOffscreenClose();
      })
      .catch(error => {
        scheduleOffscreenClose();
        sendResponse({ ok: false, error: error.message });
      });
    return true;
  }

  if (message.__wmaInternal === "addRefererRule") {
    addRefererRule(message.url, message.referer)
      .then(ruleId => sendResponse({ ok: true, ruleId }))
      .catch(error => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message.__wmaInternal === "removeRefererRule") {
    chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [message.ruleId] })
      .then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message.__wmaInternal === "startDownload") {
    chrome.downloads.download({ url: message.url, filename: message.filename, saveAs: false }, downloadId => {
      const error = chrome.runtime.lastError;
      sendResponse(error || !Number.isInteger(downloadId)
        ? { ok: false, error: error ? error.message : extensionMessage("browserDownloadFailed") }
        : { ok: true, downloadId });
    });
    return true;
  }

  return false;
});

chrome.downloads.onChanged.addListener(delta => {
  if (!delta.state && !delta.error) return;
  // Do not create an offscreen page for unrelated browser downloads.
  hasOffscreenDocument()
    .then(exists => exists ? chrome.runtime.sendMessage({
      __wmaTarget: "hls-offscreen",
      __wmaInternal: "downloadChanged",
      delta
    }) : null)
    .then(response => {
      if (response && response.handled) scheduleOffscreenClose();
    })
    .catch(() => {});
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === OFFSCREEN_CLOSE_ALARM) closeOffscreenIfIdle().catch(() => {});
});
