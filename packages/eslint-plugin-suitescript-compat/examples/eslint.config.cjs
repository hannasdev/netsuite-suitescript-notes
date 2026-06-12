"use strict";

const suitescriptCompat = require("../src");

module.exports = [
  {
    files: ["SuiteScripts/**/*.js"],
    ...suitescriptCompat.configs.recommended,
    settings: {
      suitescript: {
        entrypointGlobs: ["SuiteScripts/**/*.js"],
        defaultScriptContext: "server"
      }
    }
  },
  {
    files: ["SuiteScripts/strict/**/*.js"],
    ...suitescriptCompat.configs.strict,
    settings: {
      suitescript: {
        entrypointGlobs: ["SuiteScripts/strict/**/*.js"],
        defaultScriptContext: "server"
      }
    }
  }
];
