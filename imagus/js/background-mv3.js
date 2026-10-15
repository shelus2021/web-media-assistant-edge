"use strict";

let imagusPrefs;
let imagusResolvers = [];
let imagusInitialization;
let imagusBundledFunctionSources = {};

function imagusWithBaseUrl(base, link, addProtocol) {
  if (link[1] === "/" && link[0] === "/") {
    return addProtocol ? base.slice(0, base.indexOf(":") + 1) + link : link;
  }
  if (/^[\w-]{2,20}:/i.test(link)) return link;
  return base.replace(link[0] === "/" ? /(\/\/[^/]+)\/.*/ : /(\/)[^/]*(?:[?#].*)?$/, "$1") + link;
}

function imagusEscapeRegex(value) {
  return String(value).replace(/[/\\^$-.+*?|(){}[\]]/g, "\\$&");
}

function imagusStorageGet(keys) {
  return new Promise(resolve => {
    chrome.storage.local.get(keys, items => {
      for (const key in items) {
        try {
          if (!items[key]) throw new Error("empty");
          items[key] = JSON.parse(items[key]);
        } catch (_) {
          delete items[key];
        }
      }
      resolve(items);
    });
  });
}

function imagusStorageSet(items) {
  const encoded = {};
  for (const key in items) encoded[key] = JSON.stringify(items[key]);
  return chrome.storage.local.set(encoded);
}

async function imagusReadJson(path) {
  const response = await fetch(chrome.runtime.getURL(path));
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}

function imagusCacheSieve(source) {
  const rules = typeof source === "string" ? JSON.parse(source) : structuredClone(source);
  const cached = [];
  imagusResolvers = [];
  for (const [ruleName, rule] of Object.entries(rules)) {
    if ((!rule.link && !rule.img) || (rule.img && !rule.to && !rule.res)) continue;
    try {
      if (rule.off) continue;
      rule._wmaRuleName = ruleName;
      for (const field of ["to", "url", "res"]) {
        if (typeof rule[field] !== "string" || !rule[field].startsWith(":\n")) continue;
        if (!imagusBundledFunctionSources[ruleName] || imagusBundledFunctionSources[ruleName][field] !== rule[field]) {
          throw new Error("custom executable rule code is disabled in the MV3 build");
        }
      }
      if (rule.res) {
        if (/^:\n/.test(rule.res)) {
          imagusResolvers[cached.length] = { type: "function", name: ruleName };
          rule.res = 1;
        } else {
          const lines = rule.res.split(/\n+/);
          const first = new RegExp(lines[0]);
          imagusResolvers[cached.length] = lines[1] ? [first, new RegExp(lines[1])] : first;
          rule.res = true;
        }
      }
    } catch (error) {
      console.warn("Web Media Assistant: disabled invalid image-preview rule", ruleName, error);
      continue;
    }
    if (rule.to && rule.to.indexOf("\n") > 0 && rule.to.indexOf(":\n") !== 0) {
      rule.to = rule.to.split("\n");
    }
    delete rule.note;
    cached.push(rule);
  }
  imagusPrefs.sieve = cached;
}

async function imagusUpdatePrefs(sentPrefs = {}) {
  const defaults = await imagusReadJson("imagus/defaults.jsn");
  const stored = await imagusStorageGet(Object.keys(defaults));
  const next = {};
  const toStore = {};

  for (const key of Object.keys(defaults)) {
    let value = sentPrefs[key] ?? stored[key] ?? defaults[key];
    if (typeof defaults[key] === "object" && defaults[key] !== null && !Array.isArray(defaults[key])) {
      if (!value || typeof value !== "object" || Array.isArray(value)) value = structuredClone(defaults[key]);
      const normalized = {};
      for (const pref of Object.keys(defaults[key])) {
        normalized[pref] = value[pref] === undefined || typeof value[pref] !== typeof defaults[key][pref]
          ? defaults[key][pref]
          : value[pref];
      }
      value = normalized;
      if (key === "hz") {
        const idle = value.hideIdleCursor;
        if (idle !== null && (!Number.isInteger(idle) || idle < 0)) value.hideIdleCursor = defaults[key].hideIdleCursor;
      }
    } else if (typeof value !== typeof defaults[key]) {
      value = defaults[key];
    }
    next[key] = value;
    toStore[key] = value;
  }

  imagusPrefs = next;
  if (sentPrefs.sieve) {
    toStore.sieve = typeof sentPrefs.sieve === "string" ? JSON.parse(sentPrefs.sieve) : sentPrefs.sieve;
    imagusCacheSieve(toStore.sieve);
  } else if (stored.sieve) {
    imagusCacheSieve(stored.sieve);
  } else {
    const sieve = await imagusReadJson("imagus/sieve.jsn");
    toStore.sieve = sieve;
    imagusCacheSieve(sieve);
  }
  await imagusStorageSet(toStore);
}

async function imagusInitialize() {
  if (!imagusInitialization) {
    imagusInitialization = (async () => {
      const manifest = chrome.runtime.getManifest();
      const stored = await imagusStorageGet("version");
      const bundledSieve = await imagusReadJson("imagus/sieve.jsn");
      imagusBundledFunctionSources = {};
      for (const [name, rule] of Object.entries(bundledSieve)) {
        for (const field of ["to", "url", "res"]) {
          if (typeof rule[field] !== "string" || !rule[field].startsWith(":\n")) continue;
          if (!imagusBundledFunctionSources[name]) imagusBundledFunctionSources[name] = {};
          imagusBundledFunctionSources[name][field] = rule[field];
        }
      }
      await imagusUpdatePrefs();
      if (!stored.version || stored.version.current !== manifest.version) {
        await imagusStorageSet({ version: { current: manifest.version } });
      }
    })().catch(error => {
      imagusInitialization = null;
      throw error;
    });
  }
  return imagusInitialization;
}

function imagusPostResult(response, sendResponse) {
  sendResponse(response);
}

function imagusSubstituteResolver(resolver, params) {
  const source = resolver.source || resolver;
  if (source.indexOf("$") === -1) return resolver;
  const group = Array.from({ length: params.length }, (_, index) => index).join("|");
  const pattern = new RegExp("([^\\\\]?)\\$(" + group + ")", "g");
  if (!pattern.test(source)) return resolver;
  const value = source.replace(pattern, (match, prefix, id) => (
    Number(id) < params.length && prefix !== "\\"
      ? prefix + (params[id] ? imagusEscapeRegex(params[id]) : "")
      : match
  ));
  return typeof resolver === "string" ? value : new RegExp(value);
}

async function imagusResolve(message) {
  const data = { cmd: "resolved", id: message.id, m: null, params: message.params };
  const rule = imagusPrefs.sieve[data.params.rule.id];
  if (!rule) return data;
  if (data.params.rule.skip_resolve) {
    data.params.url = [""];
    return data;
  }

  const postMatch = /([^\s]+)(?: +:(.+)?)?/.exec(message.url);
  const requestUrl = postMatch[1];
  const body = postMatch[2] || null;
  if (rule.res === 1) {
    data.m = true;
    data.params._ = "";
    data.params.url = [requestUrl, body];
  }

  const response = await fetch(requestUrl, {
    method: body ? "POST" : "GET",
    body: body || undefined,
    credentials: "include",
    headers: body ? { "Content-Type": "application/x-www-form-urlencoded" } : undefined
  });
  const contentType = response.headers.get("Content-Type") || "";
  if (/^image\//i.test(contentType)) {
    data.m = requestUrl;
    data.noloop = true;
    return data;
  }
  if (/^(video|audio)\//i.test(contentType)) {
    data.m = null;
    data.noloop = true;
    return data;
  }

  const text = await response.text();
  const baseTag = /<base\s+href\s*=\s*("[^"]+"|'[^']+')/i.exec(text.slice(0, 4096));
  const baseUrl = baseTag
    ? imagusWithBaseUrl(requestUrl, baseTag[1].slice(1, -1).replace(/&amp;/g, "&"), true)
    : requestUrl;

  if (rule.res === 1) {
    data.params._ = text;
    data.params.base = baseUrl.replace(/(\/)[^/]*(?:[?#].*)*$/, "$1");
    return data;
  }

  const storedResolver = imagusResolvers[data.params.rule.id];
  if (!storedResolver) return data;
  const resolvers = (Array.isArray(storedResolver) ? storedResolver : [storedResolver])
    .map(item => imagusSubstituteResolver(item, data.params));
  let match = resolvers[0].exec(text);
  if (!match) return data;
  const matchParam = data.params.rule.loop_param;
  if (rule.dc && (matchParam === "link" && rule.dc !== 2 || matchParam === "img" && rule.dc > 1)) {
    match[1] = decodeURIComponent(decodeURIComponent(match[1]));
  }
  data.m = imagusWithBaseUrl(baseUrl, match[1].replace(/&amp;/g, "&"));
  if (match[2]) {
    match = match.slice(1);
  } else if (resolvers[1]) {
    match = resolvers[1].exec(text);
  }
  if (match) data.m = [data.m, match.filter((item, index) => index && item).join(" - ")];
  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.cmd) return false;
  if (!new Set(["hello", "savePrefs", "download", "open", "resolve"]).has(message.cmd)) return false;

  (async () => {
    await imagusInitialize();
    switch (message.cmd) {
      case "hello": {
        const gate = await chrome.storage.sync.get({ imagePreviewEnabled: true });
        if (gate.imagePreviewEnabled === false) return { cmd: "hello", prefs: null };
        return { cmd: "hello", prefs: { hz: imagusPrefs.hz, sieve: imagusPrefs.sieve, keys: imagusPrefs.keys } };
      }
      case "savePrefs":
        await imagusUpdatePrefs(message.prefs || {});
        return { ok: true };
      case "download":
        if (message.url) await chrome.downloads.download({ url: message.url });
        return { ok: true };
      case "open": {
        const urls = Array.isArray(message.url) ? message.url : [message.url];
        for (const url of urls) {
          if (!url || typeof url !== "string") continue;
          const params = { url, active: !message.nf };
          if (sender.tab && Number.isInteger(sender.tab.id)) params.openerTabId = sender.tab.id;
          try { await chrome.tabs.create(params); }
          catch (_) { delete params.openerTabId; await chrome.tabs.create(params); }
        }
        return { ok: true };
      }
      case "resolve":
        return imagusResolve(message);
      default:
        return undefined;
    }
  })().then(response => imagusPostResult(response, sendResponse))
    .catch(error => {
      console.error("Web Media Assistant image preview background error", error);
      sendResponse({ ok: false, error: error.message });
    });
  return true;
});

imagusInitialize().catch(error => console.error("Web Media Assistant image preview initialization failed", error));
