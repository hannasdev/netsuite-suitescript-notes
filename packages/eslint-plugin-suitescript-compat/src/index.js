"use strict";

const no21ModulesIn20 = require("./rules/no-2-1-modules-in-2-0");
const no21SyntaxIn20 = require("./rules/no-2-1-syntax-in-2-0");
const requireEntrypointJsdoc = require("./rules/require-entrypoint-jsdoc");
const requireExplicitApiVersion = require("./rules/require-explicit-api-version");

module.exports = {
  meta: {
    name: "eslint-plugin-suitescript-compat",
    version: "0.0.0"
  },
  rules: {
    "no-2-1-modules-in-2-0": no21ModulesIn20,
    "no-2-1-syntax-in-2-0": no21SyntaxIn20,
    "require-explicit-api-version": requireExplicitApiVersion,
    "require-entrypoint-jsdoc": requireEntrypointJsdoc
  }
};
