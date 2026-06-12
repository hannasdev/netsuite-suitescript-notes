"use strict";

const requireEntrypointJsdoc = require("./rules/require-entrypoint-jsdoc");

module.exports = {
  meta: {
    name: "eslint-plugin-suitescript-compat",
    version: "0.0.0"
  },
  rules: {
    "require-entrypoint-jsdoc": requireEntrypointJsdoc
  }
};
