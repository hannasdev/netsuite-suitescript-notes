"use strict";

const suitescriptCompat = require("../../../src");

module.exports = [
  {
    ...suitescriptCompat.configs.strict,
    settings: {
      suitescript: {
        entrypointGlobs: ["**/*.js"],
        defaultScriptContext: "server"
      }
    }
  }
];
