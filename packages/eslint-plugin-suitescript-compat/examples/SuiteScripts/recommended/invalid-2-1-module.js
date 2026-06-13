/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define(["N/llm"], function (llm) {
  function beforeLoad() {
    return llm;
  }

  return {
    beforeLoad: beforeLoad
  };
});
