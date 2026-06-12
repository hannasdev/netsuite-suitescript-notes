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
  assert.equal(
    typeof plugin.rules["no-2-1-syntax-in-2-0"].create,
    "function"
  );
});

test("exports recommended and strict flat configs", () => {
  assert.equal(
    plugin.configs.recommended.rules[
      "suitescript-compat/require-entrypoint-jsdoc"
    ],
    "error"
  );
  assert.equal(
    plugin.configs.recommended.rules[
      "suitescript-compat/no-2-1-modules-in-2-0"
    ],
    "error"
  );
  assert.equal(
    plugin.configs.recommended.rules[
      "suitescript-compat/require-explicit-api-version"
    ],
    undefined
  );
  assert.equal(
    plugin.configs.recommended.rules[
      "suitescript-compat/no-2-1-syntax-in-2-0"
    ],
    undefined
  );

  assert.deepEqual(
    plugin.configs.strict.rules[
      "suitescript-compat/require-explicit-api-version"
    ],
    ["error", { requireExplicitApiVersion: true }]
  );
  assert.equal(
    plugin.configs.strict.rules["suitescript-compat/no-2-1-syntax-in-2-0"],
    "error"
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
      "suitescript-compat/no-2-1-syntax-in-2-0": "error",
      "suitescript-compat/require-entrypoint-jsdoc": "error",
      "suitescript-compat/require-explicit-api-version": [
        "error",
        { requireExplicitApiVersion: true }
      ]
    }
  });

  assert.deepEqual(messages, []);
});

test("recommended config catches low-noise compatibility problems", () => {
  const linter = new Linter();
  const messages = linter.verify(
    `
      /**
       * @NApiVersion 2.0
       * @NScriptType UserEventScript
       */
      define(["N/llm"], function () {
        return {};
      });
    `,
    plugin.configs.recommended
  );

  assert.deepEqual(
    messages.map((message) => message.ruleId),
    ["suitescript-compat/no-2-1-modules-in-2-0"]
  );
});

test("strict config enables explicit version and syntax checks", () => {
  const linter = new Linter();
  const messages = linter.verify(
    `
      /**
       * @NApiVersion 2.x
       * @NScriptType UserEventScript
       */
      define([], () => ({}));
    `,
    plugin.configs.strict
  );

  assert.deepEqual(
    messages.map((message) => message.ruleId),
    [
      "suitescript-compat/require-explicit-api-version",
      "suitescript-compat/no-2-1-syntax-in-2-0"
    ]
  );
});
