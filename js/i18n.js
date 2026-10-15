"use strict";

function extensionMessage(key, substitutions, fallback) {
  const localMessage = globalThis.WMA_OFFSCREEN_MESSAGES && globalThis.WMA_OFFSCREEN_MESSAGES[key];
  if (localMessage && localMessage.message) {
    let value = localMessage.message;
    const replacements = Array.isArray(substitutions) ? substitutions : [substitutions];
    replacements.forEach((item, index) => {
      if (item !== undefined && item !== null) value = value.replaceAll("$" + (index + 1), String(item));
    });
    return value;
  }
  try {
    const values = Array.isArray(substitutions)
      ? substitutions.map(String)
      : (substitutions === undefined || substitutions === null ? undefined : String(substitutions));
    const value = chrome.i18n.getMessage(key, values);
    if (value) return value;
  } catch (_) {}
  return fallback || key;
}

function localizeDocument(root) {
  const scope = root || document;
  scope.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = extensionMessage(node.dataset.i18n, null, node.textContent);
  });
  [["data-i18n-title", "title"], ["data-i18n-placeholder", "placeholder"], ["data-i18n-aria-label", "aria-label"], ["data-i18n-alt", "alt"]].forEach(([dataName, attribute]) => {
    scope.querySelectorAll("[" + dataName + "]").forEach((node) => {
      const key = node.getAttribute(dataName);
      node.setAttribute(attribute, extensionMessage(key, null, node.getAttribute(attribute)));
    });
  });
  const title = scope.querySelector && scope.querySelector("title[data-i18n]");
  if (title) document.title = title.textContent;
  document.documentElement.lang = /^zh\b/i.test(chrome.i18n.getUILanguage()) ? "zh-CN" : "en";
}
