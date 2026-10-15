"use strict";

// Execute user-authored Imagus ES5 rule snippets without eval/new Function.
// eval5 interprets the source and enforces a short per-call timeout.
(function installRuleRuntime() {
  const EXECUTION_TIMEOUT_MS = 250;

  function createContext(receiver) {
    const safeWindow = Object.freeze({
      atob: window.atob.bind(window),
      btoa: window.btoa.bind(window),
      DOMParser: window.DOMParser,
      location: window.location
    });
    return {
      atob: safeWindow.atob,
      btoa: safeWindow.btoa,
      console,
      document,
      location: window.location,
      URL,
      window: safeWindow,
      self: safeWindow,
      globalThis: safeWindow,
      receiver
    };
  }

  function execute(source, body, receiver, values) {
    if (!globalThis.eval5 || typeof globalThis.eval5.evaluate !== "function") {
      throw new Error("Imagus rule interpreter is unavailable");
    }
    const context = createContext(receiver);
    context.__wmaRuleArgs = values;
    return globalThis.eval5.evaluate("(function(){" + body + "}).apply(receiver,__wmaRuleArgs)", context, {
      timeout: EXECUTION_TIMEOUT_MS,
      globalContextInFunction: receiver
    });
  }

  globalThis.WMA_compileImagusTransform = function (source, inline, receiver) {
    const body = "var $ = arguments; " + (inline ? "return " : "") + source.slice(1);
    return function () { return execute(source, body, receiver, Array.from(arguments)); };
  };

  globalThis.WMA_compileImagusResolver = function (source, receiver) {
    const body = "var $=arguments[0];" + source.slice(1);
    return function ($) { return execute(source, body, receiver, [$]); };
  };
})();
