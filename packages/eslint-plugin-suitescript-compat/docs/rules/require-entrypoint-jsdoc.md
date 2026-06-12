# require-entrypoint-jsdoc

Requires SuiteScript entry point files to include both `@NApiVersion` and
`@NScriptType` in file-level JSDoc.

## Source Basis

Oracle's SuiteScript 2.x overview says SuiteScript 2.x scripts need SuiteScript
JSDoc tags for API version and script type. Oracle's User Event tutorial says
`@NApiVersion` is required in all entry point scripts, shows `@NScriptType` as
the script type tag, and says returned entry points must match the script type
set by `@NScriptType`.

Repository note:

- `docs/suitescript-versions-2026-1.md`

Oracle sources:

- <https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098615298.html>
- <https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_1510274245.html>

## Milestone 1 Scope

This rule intentionally uses a narrow entry point inference scope:

- files that already include `@NScriptType` in leading file-level JSDoc
- files matched by `settings.suitescript.entrypointGlobs`
- files whose SuiteScript `define` or `require` module factory returns User
  Event entry points: `beforeLoad`, `beforeSubmit`, or `afterSubmit`

Other script type inference is deferred until later milestones add source review,
examples, and tests.

The rule reads only leading JSDoc block comments before the first statement.
Inline comments, trailing comments, and JSDoc blocks inside the module body do
not satisfy the file-level annotation requirement.

`entrypointGlobs` supports a small path-matching subset: `*` matches within one
path segment, and `**/` or `**` matches across path segments. Brace expansion,
`?`, and extglob patterns are not supported in this milestone.

## Invalid

```js
define([], function () {
  function beforeSubmit(context) {}

  return { beforeSubmit: beforeSubmit };
});
```

## Valid

```js
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([], function () {
  function beforeSubmit(context) {}

  return { beforeSubmit: beforeSubmit };
});
```

## Project Configuration

Use `entrypointGlobs` when a project layout already identifies entry point files.

```js
module.exports = [
  {
    settings: {
      suitescript: {
        entrypointGlobs: ["src/FileCabinet/SuiteScripts/**/*.js"]
      }
    }
  }
];
```
