"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { Linter } = require("eslint");
const plugin = require("../src");

test("exports the require-entrypoint-jsdoc rule", () => {
  assert.equal(plugin.meta.name, "eslint-plugin-suitescript-compat");
  assert.equal(
    typeof plugin.rules["require-entrypoint-jsdoc"].create,
    "function"
  );
});

test("loads through ESLint's plugin configuration", () => {
  const linter = new Linter();
  const messages = linter.verify("define([], function () { return {}; });", {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "script"
    },
    plugins: {
      "suitescript-compat": plugin
    },
    rules: {
      "suitescript-compat/require-entrypoint-jsdoc": "error"
    }
  });

  assert.deepEqual(messages, []);
});
