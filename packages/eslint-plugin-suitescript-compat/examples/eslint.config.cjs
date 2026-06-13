"use strict";

const suitescriptCompat = require("../src");

module.exports = [
  {
    files: [
      "SuiteScripts/**/*.js",
      "packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/**/*.js"
    ],
    ...suitescriptCompat.configs.recommended,
    settings: {
      suitescript: {
        entrypointGlobs: [
          "SuiteScripts/**/*.js",
          "packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/**/*.js"
        ],
        defaultScriptContext: "server"
      }
    }
  },
  {
    files: [
      "SuiteScripts/strict/**/*.js",
      "packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/strict/**/*.js"
    ],
    ...suitescriptCompat.configs.strict,
    settings: {
      suitescript: {
        entrypointGlobs: [
          "SuiteScripts/strict/**/*.js",
          "packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/strict/**/*.js"
        ],
        defaultScriptContext: "server"
      }
    }
  }
];
