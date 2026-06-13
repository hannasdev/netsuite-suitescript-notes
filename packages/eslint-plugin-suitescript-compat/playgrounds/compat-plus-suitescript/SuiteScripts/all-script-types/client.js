/**
 * Expected strict diagnostics:
 * - require-explicit-api-version for @NApiVersion 2.x
 * - no-2-1-modules-in-2-0 for N/llm and N/pgp
 * - no-2-1-syntax-in-2-0 for arrow function, const, optional chaining, and nullish coalescing
 *
 * N/crypto/random is intentionally imported here but should not receive the
 * server-only module diagnostic because this is a ClientScript.
 *
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(["N/llm", "N/pgp", "N/crypto/random"], (llm, pgp, random) => {
  const compatibilityRisk = currentRecord?.id ?? "client";

  return {
    pageInit: function () {
      return llm || pgp || random || compatibilityRisk;
    }
  };
});
