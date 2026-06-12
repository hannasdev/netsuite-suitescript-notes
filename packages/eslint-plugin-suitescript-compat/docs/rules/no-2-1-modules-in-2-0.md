# no-2-1-modules-in-2-0

Reports documented SuiteScript 2.1-only modules in scripts annotated as
`@NApiVersion 2.0` or `@NApiVersion 2.x`.

## Source Basis

Oracle documents `N/llm`, `N/pgp`, and server-side `N/crypto/random` as
SuiteScript 2.1-only. The repository SuiteScript version note tracks that source
review and also explains why account-level execution preferences do not by
themselves make a `2.0` or `2.x` file safe to rely on 2.1-only modules.

Repository note:

- `docs/suitescript-versions-2026-1.md`

Oracle source:

- <https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158755248128.html>

## What This Rule Checks

This rule inspects literal module IDs in SuiteScript AMD dependency arrays:

- `define(["N/llm"], function (llm) {})`
- `define("custom/name", ["N/llm"], function (llm) {})`
- `require(["N/pgp"], function (pgp) {})`

It reports:

- `N/llm` in `2.0` or `2.x` scripts
- `N/pgp` in `2.0` or `2.x` scripts
- `N/crypto/random` in `2.0` or `2.x` server scripts

`N/crypto/random` is server-side only for this rule. The rule treats context as
server when a known server `@NScriptType` is present, when
`settings.suitescript.defaultScriptContext` is `"server"`, or when the rule
option `{ scriptContext: "server" }` is used. Client and unknown contexts do not
report `N/crypto/random` in this milestone.

## Invalid

```js
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define(["N/llm"], function (llm) {
  return {};
});
```

```js
/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
require(["N/crypto/random"], function (random) {});
```

## Valid

```js
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/llm"], function (llm) {
  return {};
});
```

```js
/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 */
define(["N/crypto/random"], function (random) {
  return {};
});
```

## Limitations

The rule does not resolve dynamically computed module names. It only reports
literal dependency strings visible in AMD dependency arrays. Non-array calls
such as `require("N/llm")` are outside this milestone.
