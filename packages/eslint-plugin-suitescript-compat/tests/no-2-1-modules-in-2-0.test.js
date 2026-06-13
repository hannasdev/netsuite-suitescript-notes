"use strict";

const { RuleTester } = require("eslint");
const rule = require("../src/rules/no-2-1-modules-in-2-0");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "script"
  }
});

const SERVER_SCRIPT_TYPES = [
  { name: "Bundle Installation", tag: "BundleInstallationScript" },
  { name: "Custom Tool", tag: "CustomToolScript" },
  { name: "Map/Reduce", tag: "MapReduceScript" },
  { name: "Mass Update", tag: "MassUpdateScript" },
  { name: "Portlet", tag: "Portlet" },
  { name: "RESTlet", tag: "RESTlet" },
  { name: "Scheduled Script", tag: "ScheduledScript" },
  { name: "SDF Installation", tag: "SDFInstallationScript" },
  { name: "Suitelet", tag: "Suitelet" },
  { name: "User Event", tag: "UserEventScript" },
  { name: "Workflow Action", tag: "WorkflowActionScript" }
];

ruleTester.run("no-2-1-modules-in-2-0", rule, {
  valid: [
    {
      name: "allows 2.1-only modules in explicit 2.1 scripts",
      code: `
        /**
         * @NApiVersion 2.1
         * @NScriptType UserEventScript
         */
        define(["N/llm", "N/pgp", "N/crypto/random"], function () {
          return {};
        });
      `
    },
    {
      name: "allows other literal modules in 2.0 scripts",
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType UserEventScript
         */
        define(["N/record"], function () {
          return {};
        });
      `
    },
    {
      name: "does not report server-only crypto module for client scripts",
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType ClientScript
         */
        define(["N/crypto/random"], function () {
          return {};
        });
      `
    },
    {
      name: "does not report server-only crypto module for unknown context",
      code: `
        /**
         * @NApiVersion 2.x
         */
        define(["N/crypto/random"], function () {
          return {};
        });
      `
    },
    {
      name: "does not report server-only crypto module when option forces unknown context",
      options: [{ scriptContext: "unknown" }],
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType UserEventScript
         */
        define(["N/crypto/random"], function () {
          return {};
        });
      `
    },
    {
      name: "ignores dynamically computed module names",
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType UserEventScript
         */
        define(["N/" + "llm"], function () {
          return {};
        });
      `
    },
    {
      name: "ignores non-array require calls",
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType UserEventScript
         */
        require("N/llm");
      `
    }
  ],
  invalid: [
    ...SERVER_SCRIPT_TYPES.map((scriptType) => ({
      name: `reports server-side N/crypto/random for ${scriptType.name} scripts`,
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType ${scriptType.tag}
         */
        define(["N/crypto/random"], function () {
          return {};
        });
      `,
      errors: [
        {
          messageId: "serverModuleNotSupported",
          data: { apiVersion: "2.0", moduleId: "N/crypto/random" }
        }
      ]
    })),
    {
      name: "reports N/llm in 2.0 define dependencies",
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType UserEventScript
         */
        define(["N/llm"], function () {
          return {};
        });
      `,
      errors: [
        {
          messageId: "moduleNotSupported",
          data: { apiVersion: "2.0", moduleId: "N/llm" }
        }
      ]
    },
    {
      name: "reports N/pgp in 2.x require dependencies",
      code: `
        /**
         * @NApiVersion 2.x
         * @NScriptType ScheduledScript
         */
        require(["N/pgp"], function () {});
      `,
      errors: [
        {
          messageId: "moduleNotSupported",
          data: { apiVersion: "2.x", moduleId: "N/pgp" }
        }
      ]
    },
    {
      name: "reports N/llm in named define dependencies",
      code: `
        /**
         * @NApiVersion 2.0
         * @NScriptType UserEventScript
         */
        define("custom/UserEvent", ["N/llm"], function () {
          return {};
        });
      `,
      errors: [
        {
          messageId: "moduleNotSupported",
          data: { apiVersion: "2.0", moduleId: "N/llm" }
        }
      ]
    },
    {
      name: "reports server-side N/crypto/random from default context setting",
      settings: {
        suitescript: {
          defaultScriptContext: "server"
        }
      },
      code: `
        /**
         * @NApiVersion 2.x
         */
        define(["N/crypto/random"], function () {
          return {};
        });
      `,
      errors: [
        {
          messageId: "serverModuleNotSupported",
          data: { apiVersion: "2.x", moduleId: "N/crypto/random" }
        }
      ]
    },
    {
      name: "reports server-side N/crypto/random from rule option",
      options: [{ scriptContext: "server" }],
      code: `
        /**
         * @NApiVersion 2.0
         */
        define(["N/crypto/random"], function () {
          return {};
        });
      `,
      errors: [
        {
          messageId: "serverModuleNotSupported",
          data: { apiVersion: "2.0", moduleId: "N/crypto/random" }
        }
      ]
    }
  ]
});
