"use strict";

const {
  getFileHeaderSuiteScriptTags,
  getScriptContext,
  getSuiteScriptModuleDependencyNodes
} = require("../utils/suitescript");

const TWO_ONE_ONLY_MODULES = new Set(["N/llm", "N/pgp"]);
const SERVER_TWO_ONE_ONLY_MODULES = new Set(["N/crypto/random"]);

function isRestrictedApiVersion(apiVersion) {
  if (typeof apiVersion !== "string") {
    return false;
  }

  const normalized = apiVersion.toLowerCase();
  return normalized === "2.0" || normalized === "2.x";
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow SuiteScript 2.1-only modules in scripts annotated as 2.0 or 2.x",
      recommended: false,
      url: "https://github.com/hannasdev/netsuite-suitescript-notes/tree/main/packages/eslint-plugin-suitescript-compat/docs/rules/no-2-1-modules-in-2-0.md"
    },
    schema: [
      {
        type: "object",
        properties: {
          scriptContext: {
            enum: ["server", "client", "unknown"]
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      moduleNotSupported:
        "SuiteScript module \"{{moduleId}}\" is documented as SuiteScript 2.1-only and should not be imported by scripts annotated as @NApiVersion {{apiVersion}}.",
      serverModuleNotSupported:
        "Server-side SuiteScript module \"{{moduleId}}\" is documented as SuiteScript 2.1-only and should not be imported by server scripts annotated as @NApiVersion {{apiVersion}}."
    }
  },

  create(context) {
    const tags = getFileHeaderSuiteScriptTags(context.sourceCode);

    if (!isRestrictedApiVersion(tags.apiVersion)) {
      return {};
    }

    const option = context.options[0] || {};
    const scriptContext = getScriptContext(context, tags.scriptType, option);

    return {
      CallExpression(node) {
        for (const dependency of getSuiteScriptModuleDependencyNodes(node)) {
          const moduleId = dependency.value;

          if (TWO_ONE_ONLY_MODULES.has(moduleId)) {
            context.report({
              node: dependency,
              messageId: "moduleNotSupported",
              data: {
                apiVersion: tags.apiVersion,
                moduleId
              }
            });
          }

          if (
            scriptContext === "server" &&
            SERVER_TWO_ONE_ONLY_MODULES.has(moduleId)
          ) {
            context.report({
              node: dependency,
              messageId: "serverModuleNotSupported",
              data: {
                apiVersion: tags.apiVersion,
                moduleId
              }
            });
          }
        }
      }
    };
  }
};
