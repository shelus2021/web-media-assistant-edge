"use strict";

const fs = require("fs");
const path = require("path");

const extensionRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(__dirname, "imagus-sieve-source.jsn");
const runtimeSievePath = path.join(extensionRoot, "imagus", "sieve.jsn");
const outputPath = path.join(extensionRoot, "imagus", "includes", "rule-functions.js");
const rules = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const output = [
  "\"use strict\";",
  "",
  "// Generated from the bundled Imagus sieve. Keeping these functions in the package",
  "// avoids run-time code generation and makes the rules compatible with MV3 CSP.",
  "globalThis.WMA_IMAGUS_RULE_FUNCTIONS = Object.freeze({"
];

const generated = [];
function isExecutableRuleField(field, value) {
  return typeof value === "string" && (value.startsWith(":\n") || (field === "url" && /^:\s*\S/.test(value)));
}

for (const [name, rule] of Object.entries(rules)) {
  const functions = [];
  for (const field of ["to", "url", "res"]) {
    const value = rule[field];
    if (!isExecutableRuleField(field, value)) continue;
    const body = value.slice(1);
    let source;
    if (name === "ebay" && field === "res") {
      source = `function($){
var block = $._.match(/PicturePanelPH"\\)\\.init\\(([^\\n]+)\\)/);
var title = block && $._.match(/="twitter:title" content="([^"]+)/);
var price = block && $._.match(/itemprop="price"[^>]+>([^<]+)/);
var location = block && $._.match(/='availableAtOrFrom'>([^<]+)/);
if (!block) return false;
var images = [], match, pattern = /(?:videoUrl|maxImageUrl|displayImgUrl)\\s*:\\s*["']([^"']+)["']/g;
while ((match = pattern.exec(block[1]))) if (images.indexOf(match[1]) < 0) images.push(match[1]);
return images.map(function(url, index) {
  var item = [url];
  if (!index && title) item.push([price && price[1], location && location[1], title[1]].filter(Boolean).join(" | "));
  return item;
});
}`;
    } else {
      source = field === "res"
        ? "function($){" + body + "\n}"
        : "function(){var $ = arguments; " + (field === "url" ? "return " : "") + body + "\n}";
    }
    try {
      Function("return (" + source + ")")();
    } catch (error) {
      throw new Error(name + "." + field + ": " + error.message);
    }
    functions.push("    " + JSON.stringify(field) + ": " + source);
  }
  if (!functions.length) continue;
  generated.push("  " + JSON.stringify(name) + ": Object.freeze({\n" + functions.join(",\n") + "\n  })");
}

output.push(generated.join(",\n"), "});", "");
fs.writeFileSync(outputPath, output.join("\n"), "utf8");
const runtimeRules = structuredClone(rules);
for (const [name, rule] of Object.entries(runtimeRules)) {
  for (const field of ["to", "url", "res"]) {
    if (isExecutableRuleField(field, rule[field])) {
      rule[field] = ":\n@wma-bundled:" + name + ":" + field;
    }
  }
}
fs.writeFileSync(runtimeSievePath, JSON.stringify(runtimeRules), "utf8");
console.log("Generated " + generated.length + " compiled Imagus rule groups.");
