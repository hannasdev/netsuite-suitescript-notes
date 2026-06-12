"use strict";

const { RuleTester } = require("eslint");
const rule = require("../src/rules/require-entrypoint-jsdoc");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "script"
  }
});

ruleTester.run("require-entrypoint-jsdoc", rule, {
  valid: [
    {
      name: "valid user event script with required tags",
      code: `
        /**
         * @NApiVersion 2.1
         * @NScriptType UserEventScript
         */
        define([], function () {
          function beforeSubmit(context) {}
          return { beforeSubmit: beforeSubmit };
        });
      `
    },
    {
      name: "shared module without entry point signal",
      code: `
        define([], function () {
          function helper(context) {}
          return { helper: helper };
        });
      `
    },
    {
      name: "shared module with internal helper returning user event names",
      code: `
        define([], function () {
          function makeCallbacks() {
            return { beforeSubmit: function beforeSubmit(context) {} };
          }

          return { makeCallbacks: makeCallbacks };
        });
      `
    },
    {
      name: "configured entry point file with required tags",
      filename: "/project/src/FileCabinet/SuiteScripts/user-event.js",
      settings: {
        suitescript: {
          entrypointGlobs: ["src/FileCabinet/SuiteScripts/**/*.js"]
        }
      },
      code: `
        /**
         * @NApiVersion 2.1
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
      name: "user event return object missing both tags",
      code: `
        define([], function () {
          function beforeSubmit(context) {}
          return { beforeSubmit: beforeSubmit };
        });
      `,
      errors: [
        { messageId: "missingApiVersion" },
        { messageId: "missingScriptType" }
      ]
    },
    {
      name: "user event return object missing script type",
      code: `
        /**
         * @NApiVersion 2.1
         */
        define([], function () {
          function beforeLoad(context) {}
          return { beforeLoad: beforeLoad };
        });
      `,
      errors: [{ messageId: "missingScriptType" }]
    },
    {
      name: "expression-bodied user event arrow factory missing both tags",
      code: `
        define([], () => ({
          beforeSubmit(context) {}
        }));
      `,
      errors: [
        { messageId: "missingApiVersion" },
        { messageId: "missingScriptType" }
      ]
    },
    {
      name: "inline api version comment does not satisfy file-level jsdoc",
      code: `
        /**
         * @NScriptType UserEventScript
         */
        define([], function () {
          // TODO: add @NApiVersion 2.1 before deployment.
          return {};
        });
      `,
      errors: [{ messageId: "missingApiVersion" }]
    },
    {
      name: "script type tag missing api version",
      code: `
        /**
         * @NScriptType UserEventScript
         */
        define([], function () {
          return {};
        });
      `,
      errors: [{ messageId: "missingApiVersion" }]
    },
    {
      name: "non-leading jsdoc does not satisfy file-level annotations",
      filename: "/project/src/FileCabinet/SuiteScripts/user-event.js",
      settings: {
        suitescript: {
          entrypointGlobs: ["src/FileCabinet/SuiteScripts/**/*.js"]
        }
      },
      code: `
        define([], function () {
          /**
           * @NApiVersion 2.1
           * @NScriptType UserEventScript
           */
          return {};
        });
      `,
      errors: [
        { messageId: "missingApiVersion" },
        { messageId: "missingScriptType" }
      ]
    },
    {
      name: "configured entrypoint file missing both tags",
      filename: "/project/src/FileCabinet/SuiteScripts/user-event.js",
      settings: {
        suitescript: {
          entrypointGlobs: ["src/FileCabinet/SuiteScripts/**/*.js"]
        }
      },
      code: `
        define([], function () {
          return {};
        });
      `,
      errors: [
        { messageId: "missingApiVersion" },
        { messageId: "missingScriptType" }
      ]
    }
  ]
});
