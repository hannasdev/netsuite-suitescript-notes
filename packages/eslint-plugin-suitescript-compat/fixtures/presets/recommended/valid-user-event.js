/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define(["N/record"], function (record) {
  function beforeLoad(context) {
    return record.Type.SALES_ORDER && context.type;
  }

  return {
    beforeLoad: beforeLoad
  };
});
