"use strict";

const {
  getFileHeaderSuiteScriptTags,
  getSuiteScriptSettings
} = require("../utils/suitescript");

function shouldRequireExplicitApiVersion(context) {
  const option = context.options[0] || {};

  if (typeof option.requireExplicitApiVersion === "boolean") {
    return option.requireExplicitApiVersion;
  }

  return getSuiteScriptSettings(context).requireExplicitApiVersion === true;
}

function isAmbiguousApiVersion(apiVersion) {
  return typeof apiVersion === "string" && apiVersion.toLowerCase() === "2.x";
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "optionally require SuiteScript files to use explicit @NApiVersion values",
      recommended: false,
      url: "https://github.com/hannasdev/netsuite-suitescript-notes/tree/main/packages/eslint-plugin-suitescript-compat/docs/rules/require-explicit-api-version.md"
    },
    schema: [
      {
        type: "object",
        properties: {
          requireExplicitApiVersion: {
            type: "boolean"
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      ambiguousApiVersion:
        "SuiteScript API version \"{{apiVersion}}\" is ambiguous; use @NApiVersion 2.0 or 2.1 when explicit version policy is enabled."
    }
  },

  create(context) {
    const tags = getFileHeaderSuiteScriptTags(context.sourceCode);

    return {
      Program(node) {
        if (
          shouldRequireExplicitApiVersion(context) &&
          isAmbiguousApiVersion(tags.apiVersion)
        ) {
          context.report({
            node,
            messageId: "ambiguousApiVersion",
            data: {
              apiVersion: tags.apiVersion
            }
          });
        }
      }
    };
  }
};
