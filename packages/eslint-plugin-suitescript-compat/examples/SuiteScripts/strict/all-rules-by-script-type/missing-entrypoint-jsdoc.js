/*
 * Expected strict diagnostics:
 * - require-entrypoint-jsdoc for missing @NApiVersion
 * - require-entrypoint-jsdoc for missing @NScriptType
 *
 * This file intentionally has no leading JSDoc block. It is matched by the
 * strict example entrypointGlobs setting, so missing SuiteScript tags report.
 */
define([], function () {
  return {
    beforeLoad: function () {
      return true;
    }
  };
});
