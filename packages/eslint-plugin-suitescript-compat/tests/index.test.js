"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { Linter } = require("eslint");
const plugin = require("../src");

test("exports milestone rules", () => {
  assert.equal(plugin.meta.name, "eslint-plugin-suitescript-compat");
  assert.equal(
    typeof plugin.rules["require-entrypoint-jsdoc"].create,
    "function"
  );
  assert.equal(
    typeof plugin.rules["require-explicit-api-version"].create,
    "function"
  );
  assert.equal(
    typeof plugin.rules["no-2-1-modules-in-2-0"].create,
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
      "suitescript-compat/no-2-1-modules-in-2-0": "error",
      "suitescript-compat/require-entrypoint-jsdoc": "error",
      "suitescript-compat/require-explicit-api-version": [
        "error",
        { requireExplicitApiVersion: true }
      ]
    }
  });

  assert.deepEqual(messages, []);
});
