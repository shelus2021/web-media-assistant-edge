"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const listeners = { message: [], downloads: [], alarms: [] };
let offscreenExists = false;
let createCount = 0;
let closeCount = 0;
let alarmName = "";
const event = key => ({ addListener(listener) { listeners[key].push(listener); } });

const chrome = {
  alarms: {
    create(name) { alarmName = name; },
    clear(_name, callback) { if (callback) callback(true); return Promise.resolve(true); },
    onAlarm: event("alarms")
  },
  declarativeNetRequest: {
    getSessionRules: async () => [],
    updateSessionRules: async () => {}
  },
  downloads: {
    download(_options, callback) { callback(7); },
    onChanged: event("downloads")
  },
  offscreen: {
    async hasDocument() { return offscreenExists; },
    async createDocument() { offscreenExists = true; createCount++; },
    async closeDocument() { offscreenExists = false; closeCount++; }
  },
  runtime: {
    lastError: null,
    getURL(file) { return "chrome-extension://test/" + file; },
    onMessage: event("message"),
    sendMessage(message, callback) {
      const response = message.__wmaInternal === "getRuntimeState"
        ? { ok: true, jobs: 0, pendingDownloads: 0, activeOperations: 0 }
        : { ok: true, jobId: "hls-1" };
      if (callback) callback(response);
      return Promise.resolve(response);
    }
  }
};

const context = vm.createContext({
  chrome,
  clients: { matchAll: async () => [] },
  console,
  extensionMessage() { return "error"; },
  importScripts() {},
  URL
});
vm.runInContext(fs.readFileSync(path.join(root, "service-worker.js"), "utf8"), context, { filename: "service-worker.js" });

function tick() { return new Promise(resolve => setTimeout(resolve, 0)); }

(async () => {
  listeners.downloads[0]({ id: 99, state: { current: "complete" } });
  await tick();
  assert.strictEqual(createCount, 0, "unrelated downloads must not create an offscreen document");

  const response = await new Promise(resolve => {
    const accepted = listeners.message[0]({ Message: "startHlsDownload" }, {}, resolve);
    assert.strictEqual(accepted, true);
  });
  assert.strictEqual(response.ok, true);
  assert.strictEqual(createCount, 1);

  listeners.message[0]({ Message: "hlsDownloadProgress", state: "complete" }, {}, () => {});
  assert.strictEqual(alarmName, "wma-close-hls-offscreen");
  listeners.alarms.at(-1)({ name: alarmName });
  await tick();
  assert.strictEqual(closeCount, 1);

  console.log(JSON.stringify({ unrelatedDownloadIgnored: true, hlsCreatedOffscreen: true, idleOffscreenClosed: true }));
})().catch(error => { console.error(error); process.exitCode = 1; });
