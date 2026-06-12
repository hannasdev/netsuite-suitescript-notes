"use strict";

const {
  getFileHeaderSuiteScriptTags
} = require("../utils/suitescript");

function isRestrictedApiVersion(apiVersion) {
  if (typeof apiVersion !== "string") {
    return false;
  }

  const normalized = apiVersion.toLowerCase();
  return normalized === "2.0" || normalized === "2.x";
}

function reportSyntax(context, node, apiVersion, syntax) {
  context.report({
    node,
    messageId: "syntaxNotSupported",
    data: {
      apiVersion,
      syntax
    }
  });
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow SuiteScript 2.1 syntax in scripts annotated as 2.0 or 2.x",
      recommended: false,
      url: "https://github.com/hannasdev/netsuite-suitescript-notes/tree/main/packages/eslint-plugin-suitescript-compat/docs/rules/no-2-1-syntax-in-2-0.md"
    },
    schema: [],
    messages: {
      syntaxNotSupported:
        "SuiteScript syntax \"{{syntax}}\" is not safe for scripts annotated as @NApiVersion {{apiVersion}}; use @NApiVersion 2.1 or rewrite with SuiteScript 2.0-compatible syntax."
    }
  },

  create(context) {
    const tags = getFileHeaderSuiteScriptTags(context.sourceCode);

    if (!isRestrictedApiVersion(tags.apiVersion)) {
      return {};
    }

    return {
      ArrowFunctionExpression(node) {
        reportSyntax(context, node, tags.apiVersion, "arrow function");

        if (node.async) {
          reportSyntax(context, node, tags.apiVersion, "async function");
        }
      },

      ClassDeclaration(node) {
        reportSyntax(context, node, tags.apiVersion, "class declaration");
      },

      ClassExpression(node) {
        reportSyntax(context, node, tags.apiVersion, "class expression");
      },

      TemplateLiteral(node) {
        reportSyntax(context, node, tags.apiVersion, "template literal");
      },

      SpreadElement(node) {
        reportSyntax(context, node, tags.apiVersion, "spread syntax");
      },

      RestElement(node) {
        reportSyntax(context, node, tags.apiVersion, "rest syntax");
      },

      FunctionDeclaration(node) {
        if (node.async) {
          reportSyntax(context, node, tags.apiVersion, "async function");
        }
      },

      FunctionExpression(node) {
        if (node.async) {
          reportSyntax(context, node, tags.apiVersion, "async function");
        }
      },

      AwaitExpression(node) {
        reportSyntax(context, node, tags.apiVersion, "await expression");
      },

      ImportDeclaration(node) {
        reportSyntax(context, node, tags.apiVersion, "import declaration");
      },

      ExportNamedDeclaration(node) {
        reportSyntax(context, node, tags.apiVersion, "export declaration");
      },

      ExportDefaultDeclaration(node) {
        reportSyntax(context, node, tags.apiVersion, "default export");
      },

      ExportAllDeclaration(node) {
        reportSyntax(context, node, tags.apiVersion, "export all declaration");
      },

      ChainExpression(node) {
        reportSyntax(context, node, tags.apiVersion, "optional chaining");
      },

      LogicalExpression(node) {
        if (node.operator === "??") {
          reportSyntax(context, node, tags.apiVersion, "nullish coalescing");
        }
      },

      ForOfStatement(node) {
        reportSyntax(context, node, tags.apiVersion, "for...of statement");
      },

      VariableDeclaration(node) {
        if (node.kind === "let" || node.kind === "const") {
          reportSyntax(context, node, tags.apiVersion, `${node.kind} declaration`);
        }
      },

      ObjectPattern(node) {
        reportSyntax(context, node, tags.apiVersion, "object destructuring");
      },

      ArrayPattern(node) {
        reportSyntax(context, node, tags.apiVersion, "array destructuring");
      }
    };
  }
};
