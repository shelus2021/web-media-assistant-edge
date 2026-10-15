"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const listeners = {};
const local = { MediaData: { 1: [{ url: "https://example.com/persisted.mp4" }] } };
const sync = {};
const event = name => ({ addListener(listener) { (listeners[name] ||= []).push(listener); } });

function storageArea(data, callbackDelay = 0) {
  return {
    get(keys, callback) {
      let result = {};
      if (typeof keys === "string") result[keys] = data[keys];
      else if (Array.isArray(keys)) keys.forEach(key => { if (data[key] !== undefined) result[key] = data[key]; });
      else if (keys && typeof keys === "object") {
        result = { ...keys };
        Object.keys(keys).forEach(key => { if (data[key] !== undefined) result[key] = data[key]; });
      } else result = { ...data };
      if (callback) {
        if (callbackDelay) setTimeout(() => callback(result), callbackDelay);
        else callback(result);
      }
      return Promise.resolve(result);
    },
    set(items, callback) { Object.assign(data, items); if (callback) callback(); return Promise.resolve(); },
    remove(keys, callback) { for (const key of [].concat(keys)) delete data[key]; if (callback) callback(); return Promise.resolve(); }
  };
}

const chrome = {
  action: { setTitle(_details, callback) { if (callback) callback(); } },
  alarms: { create() {}, onAlarm: event("alarm") },
  downloads: { download() { return Promise.resolve(1); }, onChanged: event("downloadsChanged") },
  i18n: { getMessage(key) { return key; }, getUILanguage() { return "en"; } },
  runtime: {
    lastError: null,
    getManifest() { return { name: "Web Media Assistant", version: "0.1.39" }; },
    getURL(file) { return "chrome-extension://test/" + file; },
    onInstalled: event("installed"),
    onMessage: event("message"),
    sendMessage(_message, callback) { if (callback) callback(); }
  },
  storage: {
    local: storageArea(local, 25),
    sync: storageArea(sync),
    onChanged: event("storageChanged")
  },
  tabs: {
    query(_query, callback) { const tabs = [{ id: 1, url: "https://example.com/", title: "Example" }]; if (callback) callback(tabs); return Promise.resolve(tabs); },
    get(_id, callback) { callback({ id: 1, url: "https://example.com/", title: "Example" }); },
    create() { return Promise.resolve({ id: 2 }); },
    onActivated: event("tabActivated"),
    onUpdated: event("tabUpdated"),
    onRemoved: event("tabRemoved")
  },
  webRequest: {
    OnBeforeSendHeadersOptions: { EXTRA_HEADERS: "extraHeaders" },
    onSendHeaders: event("sendHeaders"),
    onResponseStarted: event("responseStarted"),
    onErrorOccurred: event("requestError")
  }
};

const context = vm.createContext({
  chrome,
  console,
  URL,
  structuredClone,
  setTimeout,
  clearTimeout,
  fetch: async url => {
    const relative = String(url).replace("chrome-extension://test/", "");
    const file = path.join(root, ...relative.split("/"));
    return new Response(fs.readFileSync(file), { status: 200, headers: { "Content-Type": "application/json" } });
  },
  Response
});

for (const relative of ["js/defaults.js", "js/i18n.js", "js/init.js", "js/background.js", "imagus/js/background-mv3.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), "utf8"), context, { filename: relative });
}

async function dispatch(message) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("message response timeout")), 3000);
    for (const listener of listeners.message || []) {
      const keepAlive = listener(message, { tab: { id: 1, url: "https://example.com/" } }, response => {
        clearTimeout(timer);
        resolve(response);
      });
      if (keepAlive === true) return;
    }
    clearTimeout(timer);
    reject(new Error("no message listener accepted the test message"));
  });
}

(async () => {
  const media = await dispatch({ Message: "getMediaData", tabId: 1 });
  assert.strictEqual(media.ok, true);
  assert.strictEqual(media.items[0].url, "https://example.com/persisted.mp4");

  const hello = await dispatch({ cmd: "hello" });
  assert.strictEqual(hello.cmd, "hello");
  assert.ok(hello.prefs && Array.isArray(hello.prefs.sieve));
  assert.ok(hello.prefs.sieve.length > 250);
  assert.ok(hello.prefs.sieve.some(rule => rule._wmaRuleName === "GoogleImages"));
  assert.ok(!JSON.stringify(hello.prefs).includes("new Function"));

  const customSource = ":\nvar value=JSON.parse($._); return value.url";
  const saved = await dispatch({
    cmd: "savePrefs",
    prefs: { sieve: { CustomRule: { link: "^example\\.com/", res: customSource } } }
  });
  assert.strictEqual(saved.ok, true);
  const customHello = await dispatch({ cmd: "hello" });
  assert.strictEqual(customHello.prefs.sieve.length, 1);
  assert.strictEqual(customHello.prefs.sieve[0]._wmaCustomRes, customSource);
  assert.strictEqual(customHello.prefs.sieve[0].res, 1);
  console.log(JSON.stringify({
    messageListeners: listeners.message.length,
    activeSieveRules: hello.prefs.sieve.length,
    restoredMediaWaited: true,
    customResolverAccepted: true
  }));
})().catch(error => { console.error(error); process.exitCode = 1; });
