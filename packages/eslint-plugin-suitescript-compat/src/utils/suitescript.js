"use strict";

const SUITESCRIPT_TAGS = {
  apiVersion: "NApiVersion",
  scriptType: "NScriptType"
};

const SERVER_SCRIPT_TYPES = new Set([
  "bundleinstallationscript",
  "customtoolscript",
  "mapreducescript",
  "massupdatescript",
  "portlet",
  "restlet",
  "scheduledscript",
  "sdfinstallationscript",
  "suitelet",
  "usereventscript",
  "workflowactionscript"
]);

const CLIENT_SCRIPT_TYPES = new Set(["clientscript"]);

function getCommentText(comment) {
  return comment && typeof comment.value === "string" ? comment.value : "";
}

function isJsdocBlock(sourceCode, comment) {
  return sourceCode.text.slice(comment.range[0], comment.range[0] + 3) === "/**";
}

function getFileHeaderJsdocComments(sourceCode) {
  const firstStatement = sourceCode.ast.body[0];
  const headerEnd = firstStatement ? firstStatement.range[0] : sourceCode.text.length;

  return sourceCode
    .getAllComments()
    .filter(
      (comment) =>
        comment.type === "Block" &&
        comment.range[1] <= headerEnd &&
        isJsdocBlock(sourceCode, comment)
    );
}

function hasJsdocTag(comments, tagName) {
  const tagPattern = new RegExp(`@${tagName}\\b`);
  return comments.some((comment) => tagPattern.test(getCommentText(comment)));
}

function getJsdocTagValue(comments, tagName) {
  const tagPattern = new RegExp(`@${tagName}\\s+([^\\s*]+)`);

  for (const comment of comments) {
    const match = getCommentText(comment).match(tagPattern);

    if (match) {
      return match[1];
    }
  }

  return null;
}

function getFileHeaderSuiteScriptTags(sourceCode) {
  const comments = getFileHeaderJsdocComments(sourceCode);

  return {
    comments,
    apiVersion: getJsdocTagValue(comments, SUITESCRIPT_TAGS.apiVersion),
    scriptType: getJsdocTagValue(comments, SUITESCRIPT_TAGS.scriptType)
  };
}

function getSuiteScriptSettings(context) {
  return context.settings && context.settings.suitescript
    ? context.settings.suitescript
    : {};
}

function getPropertyName(property) {
  if (!property || property.type === "SpreadElement") {
    return null;
  }

  if (property.key.type === "Identifier") {
    return property.key.name;
  }

  if (property.key.type === "Literal") {
    return String(property.key.value);
  }

  return null;
}

function isModuleLoaderCall(node) {
  return (
    node.callee &&
    node.callee.type === "Identifier" &&
    (node.callee.name === "define" || node.callee.name === "require")
  );
}

function getModuleFactoryArgument(node) {
  if (!isModuleLoaderCall(node)) {
    return null;
  }

  return node.arguments.find(
    (argument) =>
      argument.type === "FunctionExpression" ||
      argument.type === "ArrowFunctionExpression"
  );
}

function isFunctionNode(node) {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  );
}

function getSuiteScriptModuleDependencyNodes(node) {
  if (!isModuleLoaderCall(node)) {
    return [];
  }

  const dependencies = node.arguments.find(
    (argument) => argument && argument.type === "ArrayExpression"
  );

  if (!dependencies || dependencies.type !== "ArrayExpression") {
    return [];
  }

  return dependencies.elements.filter(
    (element) =>
      element &&
      element.type === "Literal" &&
      typeof element.value === "string"
  );
}

function normalizeScriptType(scriptType) {
  return typeof scriptType === "string"
    ? scriptType.replace(/\s+/g, "").toLowerCase()
    : "";
}

function normalizeScriptContext(scriptContext) {
  return ["server", "client", "unknown"].includes(scriptContext)
    ? scriptContext
    : null;
}

function getScriptContext(context, scriptType, option = {}) {
  const optionContext = normalizeScriptContext(option.scriptContext);

  if (Object.hasOwn(option, "scriptContext") && optionContext) {
    return optionContext;
  }

  const normalizedScriptType = normalizeScriptType(scriptType);

  if (SERVER_SCRIPT_TYPES.has(normalizedScriptType)) {
    return "server";
  }

  if (CLIENT_SCRIPT_TYPES.has(normalizedScriptType)) {
    return "client";
  }

  const settingsContext = normalizeScriptContext(
    getSuiteScriptSettings(context).defaultScriptContext
  );

  return settingsContext || "unknown";
}

module.exports = {
  SUITESCRIPT_TAGS,
  getFileHeaderJsdocComments,
  getFileHeaderSuiteScriptTags,
  getModuleFactoryArgument,
  getPropertyName,
  getScriptContext,
  getSuiteScriptModuleDependencyNodes,
  getSuiteScriptSettings,
  hasJsdocTag,
  isFunctionNode
};
