"use strict";

const no21ModulesIn20 = require("./rules/no-2-1-modules-in-2-0");
const no21SyntaxIn20 = require("./rules/no-2-1-syntax-in-2-0");
const requireEntrypointJsdoc = require("./rules/require-entrypoint-jsdoc");
const requireExplicitApiVersion = require("./rules/require-explicit-api-version");

const rules = {
  "no-2-1-modules-in-2-0": no21ModulesIn20,
  "no-2-1-syntax-in-2-0": no21SyntaxIn20,
  "require-explicit-api-version": requireExplicitApiVersion,
  "require-entrypoint-jsdoc": requireEntrypointJsdoc
};

const plugin = {
  meta: {
    name: "eslint-plugin-suitescript-compat",
    version: "0.0.0"
  },
  rules,
  configs: {}
};

Object.assign(plugin.configs, {
  recommended: {
    name: "suitescript-compat/recommended",
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "script"
    },
    plugins: {
      "suitescript-compat": plugin
    },
    rules: {
      "suitescript-compat/no-2-1-modules-in-2-0": "error",
      "suitescript-compat/require-entrypoint-jsdoc": "error"
    }
  },
  strict: {
    name: "suitescript-compat/strict",
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
  }
});

module.exports = plugin;
