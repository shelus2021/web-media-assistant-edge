"use strict";

const fs = require("fs");
const path = require("path");

const contentPath = path.resolve(__dirname, "..", "imagus", "includes", "content.js");
let source = fs.readFileSync(contentPath, "utf8");

function replaceOnce(search, replacement, label) {
  const first = source.indexOf(search);
  if (first < 0) throw new Error(label + " pattern not found");
  if (source.indexOf(search, first + search.length) >= 0) throw new Error(label + " pattern is not unique");
  source = source.slice(0, first) + replacement + source.slice(first + search.length);
}

replaceOnce(
  'Function("var $ = arguments; "+(inline?"return ":"")+rule[param].slice(1)).bind(PVI)',
  'function(){var name=rule._wmaRuleName;var group=globalThis.WMA_IMAGUS_RULE_FUNCTIONS&&globalThis.WMA_IMAGUS_RULE_FUNCTIONS[name];var compiled=group&&group[param];if(typeof compiled!=="function")throw new Error("Bundled rule function is unavailable");return compiled.bind(PVI)}()',
  "rule transformer"
);

replaceOnce(
  'if(rule.res===1&&typeof d.params.rule.req_res==="string")rule.res=Function("$",d.params.rule.req_res);PVI.node=trg;d.m=rule.res.call(PVI,d.params)',
  'if(rule.res===1){var ruleName=rule._wmaRuleName;var ruleGroup=globalThis.WMA_IMAGUS_RULE_FUNCTIONS&&globalThis.WMA_IMAGUS_RULE_FUNCTIONS[ruleName];rule.res=ruleGroup&&ruleGroup.res}if(typeof rule.res!=="function")throw new Error("Bundled resolver is unavailable");PVI.node=trg;d.m=rule.res.call(PVI,d.params)',
  "response resolver"
);

fs.writeFileSync(contentPath, source, "utf8");
console.log("Patched Imagus content script for bundled MV3 rule functions.");
