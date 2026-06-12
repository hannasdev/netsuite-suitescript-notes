"use strict";

const {
  SUITESCRIPT_TAGS,
  getFileHeaderJsdocComments,
  getModuleFactoryArgument,
  getPropertyName,
  hasJsdocTag,
  isFunctionNode
} = require("../utils/suitescript");

const USER_EVENT_ENTRY_POINTS = new Set([
  "beforeLoad",
  "beforeSubmit",
  "afterSubmit"
]);

function normalizeFilename(filename) {
  return filename.replaceAll("\\", "/");
}

function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function globToRegExp(glob) {
  const normalized = normalizeFilename(glob);
  let pattern = "";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];

    if (char === "*" && next === "*") {
      if (normalized[index + 2] === "/") {
        pattern += "(?:.*/)?";
        index += 2;
      } else {
        pattern += ".*";
        index += 1;
      }
    } else if (char === "*") {
      pattern += "[^/]*";
    } else {
      pattern += escapeRegExp(char);
    }
  }

  return new RegExp(`(^|/)${pattern}$`);
}

function getEntrypointGlobs(context) {
  const settings = context.settings && context.settings.suitescript;
  return Array.isArray(settings && settings.entrypointGlobs)
    ? settings.entrypointGlobs
    : [];
}

function filenameMatchesEntrypointGlob(context) {
  const filename = normalizeFilename(context.getFilename());

  if (!filename || filename === "<input>") {
    return false;
  }

  return getEntrypointGlobs(context).some((glob) => {
    if (typeof glob !== "string" || glob.length === 0) {
      return false;
    }

    return globToRegExp(glob).test(filename);
  });
}

function hasUserEventReturnObject(node) {
  if (!node || node.type !== "ObjectExpression") {
    return false;
  }

  return node.properties.some((property) =>
    USER_EVENT_ENTRY_POINTS.has(getPropertyName(property))
  );
}

function hasUserEventReturnStatement(node) {
  return Boolean(node.argument && hasUserEventReturnObject(node.argument));
}

function isEntrypointCandidate(context, fileHeaderComments, state) {
  return (
    hasJsdocTag(fileHeaderComments, SUITESCRIPT_TAGS.scriptType) ||
    filenameMatchesEntrypointGlob(context) ||
    state.hasUserEventReturnObject
  );
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "require SuiteScript entry point files to declare @NApiVersion and @NScriptType",
      recommended: false,
      url: "https://github.com/hannasdev/netsuite-suitescript-notes/tree/main/packages/eslint-plugin-suitescript-compat/docs/rules/require-entrypoint-jsdoc.md"
    },
    schema: [],
    messages: {
      missingApiVersion:
        "SuiteScript entry point files must include @NApiVersion in their file-level JSDoc.",
      missingScriptType:
        "SuiteScript entry point files must include @NScriptType in their file-level JSDoc."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const fileHeaderComments = getFileHeaderJsdocComments(sourceCode);
    const moduleFactoryFunctions = new WeakSet();
    const functionStack = [];
    const state = {
      hasUserEventReturnObject: false
    };

    return {
      CallExpression(node) {
        const factory = getModuleFactoryArgument(node);

        if (factory) {
          moduleFactoryFunctions.add(factory);

          if (
            factory.type === "ArrowFunctionExpression" &&
            hasUserEventReturnObject(factory.body)
          ) {
            state.hasUserEventReturnObject = true;
          }
        }
      },

      ":function"(node) {
        if (isFunctionNode(node)) {
          functionStack.push(node);
        }
      },

      ":function:exit"(node) {
        if (isFunctionNode(node)) {
          functionStack.pop();
        }
      },

      ReturnStatement(node) {
        const currentFunction = functionStack[functionStack.length - 1];

        if (
          moduleFactoryFunctions.has(currentFunction) &&
          hasUserEventReturnStatement(node)
        ) {
          state.hasUserEventReturnObject = true;
        }
      },

      "Program:exit"(node) {
        if (!isEntrypointCandidate(context, fileHeaderComments, state)) {
          return;
        }

        if (!hasJsdocTag(fileHeaderComments, SUITESCRIPT_TAGS.apiVersion)) {
          context.report({
            node,
            messageId: "missingApiVersion"
          });
        }

        if (!hasJsdocTag(fileHeaderComments, SUITESCRIPT_TAGS.scriptType)) {
          context.report({
            node,
            messageId: "missingScriptType"
          });
        }
      }
    };
  }
};
