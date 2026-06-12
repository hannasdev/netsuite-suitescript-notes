"use strict";

const { RuleTester } = require("eslint");
const rule = require("../src/rules/require-explicit-api-version");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "script"
  }
});

ruleTester.run("require-explicit-api-version", rule, {
  valid: [
    {
      name: "does not report 2.x until explicit policy is configured",
      code: `
        /**
         * @NApiVersion 2.x
         * @NScriptType UserEventScript
         */
        define([], function () {
          return {};
        });
      `
    },
    {
      name: "allows 2.0 when explicit policy is configured",
      settings: {
        suitescript: {
          requireExplicitApiVersion: true
        }
      },
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType UserEventScript
         */
        define([], function () {
          return {};
        });
      `
    },
    {
      name: "allows 2.1 when explicit policy is configured",
      options: [{ requireExplicitApiVersion: true }],
      code: `
        /**
         * @NApiVersion 2.1
         * @NScriptType UserEventScript
         */
        define([], function () {
          return {};
        });
      `
    },
    {
      name: "rule option can disable explicit api version setting",
      settings: {
        suitescript: {
          requireExplicitApiVersion: true
        }
      },
      options: [{ requireExplicitApiVersion: false }],
      code: `
        /**
         * @NApiVersion 2.x
         * @NScriptType UserEventScript
         */
        define([], function () {
          return {};
        });
      `
    }
  ],
  invalid: [
    {
      name: "reports 2.x when setting requires explicit api version",
      settings: {
        suitescript: {
          requireExplicitApiVersion: true
        }
      },
      code: `
        /**
         * @NApiVersion 2.x
         * @NScriptType UserEventScript
         */
        define([], function () {
          return {};
        });
      `,
      errors: [
        {
          messageId: "ambiguousApiVersion",
          data: { apiVersion: "2.x" }
        }
      ]
    },
    {
      name: "reports 2.x when rule option requires explicit api version",
      options: [{ requireExplicitApiVersion: true }],
      code: `
        /**
         * @NApiVersion 2.x
         * @NScriptType UserEventScript
         */
        define([], function () {
          return {};
        });
      `,
      errors: [
        {
          messageId: "ambiguousApiVersion",
          data: { apiVersion: "2.x" }
        }
      ]
    }
  ]
});
