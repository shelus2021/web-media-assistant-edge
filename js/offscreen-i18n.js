"use strict";

// Offscreen documents expose only chrome.runtime, so load the bundled locale
// with a local synchronous request before the media processor starts.
(() => {
  const locale = /^zh\b/i.test(navigator.language || "") ? "zh_CN" : "en";
  try {
    const request = new XMLHttpRequest();
    request.open("GET", chrome.runtime.getURL("_locales/" + locale + "/messages.json"), false);
    request.send(null);
    if (request.status === 0 || request.status === 200) {
      globalThis.WMA_OFFSCREEN_MESSAGES = JSON.parse(request.responseText);
    }
  } catch (error) {
    console.warn("Web Media Assistant: offscreen locale loading failed", error);
  }
})();
