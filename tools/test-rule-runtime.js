"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const location = { hostname: "example.com", href: "https://example.com/" };
const windowObject = {
  atob(value) { return Buffer.from(value, "base64").toString("binary"); },
  btoa(value) { return Buffer.from(value, "binary").toString("base64"); },
  DOMParser: function DOMParser() {},
  location
};
const context = vm.createContext({
  Buffer,
  console,
  document: {},
  location,
  URL,
  window: windowObject
});
context.globalThis = context;
context.self = context;

for (const relative of ["lib/eval5.min.js", "imagus/includes/rule-runtime.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), "utf8"), context, { filename: relative });
}

const receiver = { marker: "receiver" };
const transform = context.WMA_compileImagusTransform(":\nreturn window.atob($[1])", false, receiver);
assert.strictEqual(transform("unused", "aGVsbG8="), "hello");

const inline = context.WMA_compileImagusTransform(": $[1] + '-large'", true, receiver);
assert.strictEqual(inline("unused", "image"), "image-large");

const resolver = context.WMA_compileImagusResolver(":\nvar value=JSON.parse($._); return value.url", receiver);
assert.strictEqual(resolver({ _: '{"url":"https://example.com/full.jpg"}' }), "https://example.com/full.jpg");

assert.throws(
  () => context.WMA_compileImagusTransform(":\nwhile(true){}", false, receiver)(),
  /timeout|timed out|Execution/i
);

console.log(JSON.stringify({ customTransform: true, inlineTransform: true, customResolver: true, timeout: true }));
