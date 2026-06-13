/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define([], () => {
  const status = "created";

  return {
    beforeLoad: () => status
  };
});
