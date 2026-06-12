# no-2-1-syntax-in-2-0

Reports conservative JavaScript syntax compatibility risks in files annotated as
`@NApiVersion 2.0` or `@NApiVersion 2.x`.

## Source Basis

The repository SuiteScript version note tracks the reviewed source basis for
SuiteScript 2.0 and SuiteScript 2.1 runtime differences. This rule applies that
source-backed distinction as a conservative ES5.1 compatibility check. It is not
a complete NetSuite runtime emulator.

Repository note:

- `docs/suitescript-versions-2026-1.md`

Oracle sources:

- <https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html>
- <https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158755248128.html>

## What This Rule Checks

When a file header contains `@NApiVersion 2.0` or `@NApiVersion 2.x`, this rule
reports the following syntax forms:

- arrow functions
- class declarations and class expressions
- template literals
- spread syntax, including object spread when the parser represents it as spread
- rest syntax
- async functions and `await` expressions
- ECMAScript module `import` and `export` declarations
- optional chaining
- nullish coalescing
- `for...of` statements
- `let` and `const` declarations
- object and array destructuring in declarations, parameters, or assignments

Scripts annotated as `@NApiVersion 2.1` are not reported by this rule.

## Invalid

```js
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define([], () => {
  const message = `created`;
  return { beforeLoad: () => message };
});
```

```js
/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define([], function () {
  for (const value of values) {
    log.debug({ title: "value", details: value ?? "missing" });
  }
});
```

## Valid

```js
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([], () => {
  const message = `created`;
  return { beforeLoad: () => message };
});
```

```js
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define([], function () {
  var message = "created";
  return {
    beforeLoad: function () {
      return message;
    }
  };
});
```

## Parser Errors

This rule can only report syntax that the configured ESLint parser can parse.
Use parser options modern enough for the syntax you want this rule to inspect,
for example `ecmaVersion: 2024`.

If the parser is configured for an older ECMAScript version, ESLint may fail with
a parser error before this custom rule runs. Treat that parser error as the
compatibility signal for that file, then raise the parser version if you want
the SuiteScript-specific diagnostic text from this rule.

## Limitations

This rule checks syntax shape only. It does not emulate NetSuite execution,
account preferences, deployment metadata, governance behavior, or API behavior.
It intentionally avoids speculative runtime checks that are not represented by a
conservative syntax node list.
