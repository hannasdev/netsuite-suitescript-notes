# require-explicit-api-version

Optionally reports `@NApiVersion 2.x` so projects can require an explicit
SuiteScript runtime annotation such as `2.0` or `2.1`.

## Source Basis

Oracle documents that `@NApiVersion 2.x` resolves to SuiteScript 2.0 by default
when uploaded and executed. Oracle also documents account-level preferences that
can run compatible `2.x` or `2.0` scripts as SuiteScript 2.1 without changing
the script file, while warning that `2.x` syntax is still validated as
SuiteScript 2.0.

Repository note:

- `docs/suitescript-versions-2026-1.md`

Oracle sources:

- <https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_156632003699.html>
- <https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html>

## Configuration

This rule reports only when explicit version policy is configured. Use either
rule options:

```js
module.exports = [
  {
    rules: {
      "suitescript-compat/require-explicit-api-version": [
        "error",
        { requireExplicitApiVersion: true }
      ]
    }
  }
];
```

Or project settings:

```js
module.exports = [
  {
    settings: {
      suitescript: {
        requireExplicitApiVersion: true
      }
    }
  }
];
```

## Invalid

```js
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define([], function () {
  return {};
});
```

## Valid

```js
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([], function () {
  return {};
});
```

## Limitations

This is a project-policy rule. It does not read account-level execution
preferences or decide whether a specific deployment can run as SuiteScript 2.1.
