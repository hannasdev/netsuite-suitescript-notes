"use strict";

const suitescriptCompat = require("../../../src");

module.exports = [
  {
    ...suitescriptCompat.configs.recommended,
    settings: {
      suitescript: {
        entrypointGlobs: ["**/*.js"],
        defaultScriptContext: "server"
      }
    }
  }
];
