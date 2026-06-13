/**
 * Expected strict diagnostics:
 * - require-explicit-api-version for @NApiVersion 2.x
 * - no-2-1-modules-in-2-0 for N/llm, N/pgp, and server-side N/crypto/random
 * - no-2-1-syntax-in-2-0 for arrow function, const, optional chaining, and nullish coalescing
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/llm", "N/pgp", "N/crypto/random"], (llm, pgp, random) => {
  const compatibilityRisk = context?.newRecord?.id ?? "user-event";

  return {
    beforeLoad: function () {
      return llm || pgp || random || compatibilityRisk;
    }
  };
});
