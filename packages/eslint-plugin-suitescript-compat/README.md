# eslint-plugin-suitescript-compat

Unofficial ESLint rules for source-backed SuiteScript compatibility checks.
The plugin helps SuiteScript projects catch version and runtime compatibility
mistakes in source control before deployment, especially while evaluating or
migrating between SuiteScript 2.0, `2.x`, and 2.1.

This package is private while rule behavior and release posture are being
reviewed. Package code is MIT licensed. Repository prose documentation outside
this package remains under the repository's root CC BY 4.0 license unless a
future release decision changes that boundary.

Oracle, NetSuite, SuiteScript, and related names belong to their respective
owners. This package is not affiliated with, endorsed by, or sponsored by
Oracle.

## What It Does

The plugin checks JavaScript source files for SuiteScript compatibility signals
that can be seen locally:

- file-level `@NApiVersion` and `@NScriptType` JSDoc tags
- SuiteScript AMD dependency arrays in `define([...])` and `require([...])`
- parser-visible JavaScript syntax in files annotated as SuiteScript 2.0 or
  `2.x`
- project settings that identify entry point files or default script context

It is designed for source-backed repositories and CI. It does not replace
NetSuite account validation, deployment records, script records, or Oracle
documentation.

## Relationship To `eslint-plugin-suitescript`

This plugin is intended to complement the community
[`eslint-plugin-suitescript`](https://www.npmjs.com/package/eslint-plugin-suitescript)
package, not compete with it.

Use `eslint-plugin-suitescript` for general SuiteScript linting such as:

- valid `@NApiVersion` and `@NScriptType` values
- script type entry point interfaces
- SuiteScript module name validation
- AMD dependency hygiene
- `N/log` and `log.*` call conventions
- SuiteScript 1.0 and 2.x globals

Use this plugin for compatibility checks that are intentionally not covered by
that general-purpose rule set:

- requiring file-level SuiteScript tags on source-backed entry point files
- flagging SuiteScript 2.1-only modules in scripts annotated as `2.0` or `2.x`
- flagging conservative SuiteScript 2.0 syntax compatibility risks
- optionally requiring explicit `2.0` or `2.1` annotations instead of `2.x`

There is a small amount of tag-related overlap by design. This plugin's
`require-entrypoint-jsdoc` rule focuses on missing source annotations for files
that look like entry points, while `eslint-plugin-suitescript` validates tag
values and script type interfaces when those tags are present.

## Quick Start

This package is private while release posture is under review. In this
repository, `npm install` links the workspace package for local development.
For external evaluation before a release decision, install ESLint 9 and the
package from a local checkout or package path rather than publishing to npm:

```sh
npm install --save-dev eslint@^9 /path/to/netsuite/packages/eslint-plugin-suitescript-compat
```

Then use the plugin from an ESLint flat config. The CommonJS example below
should live in `eslint.config.cjs`; projects using an ESM `eslint.config.js`
should use `import` syntax instead of `require`.

```js
const suitescriptCompat = require("eslint-plugin-suitescript-compat");

module.exports = [
  {
    files: ["SuiteScripts/**/*.js"],
    ...suitescriptCompat.configs.recommended,
    settings: {
      suitescript: {
        entrypointGlobs: ["SuiteScripts/**/*.js"],
        defaultScriptContext: "server"
      }
    }
  }
];
```

When evaluating from this repository root without installing into another
project, replace the package import with
`require("./packages/eslint-plugin-suitescript-compat")`.

## Presets

The plugin exports two flat config presets:

- `suitescriptCompat.configs.recommended`
- `suitescriptCompat.configs.strict`

`recommended` enables lower-noise checks intended for regular CI:

- `suitescript-compat/require-entrypoint-jsdoc`
- `suitescript-compat/no-2-1-modules-in-2-0`

`strict` enables every current rule and adds policy/syntax checks useful during
version cleanup or migration work:

- `suitescript-compat/require-entrypoint-jsdoc`
- `suitescript-compat/no-2-1-modules-in-2-0`
- `suitescript-compat/no-2-1-syntax-in-2-0`
- `suitescript-compat/require-explicit-api-version` with
  `{ requireExplicitApiVersion: true }`

## Rules

- `suitescript-compat/no-2-1-modules-in-2-0`
- `suitescript-compat/no-2-1-syntax-in-2-0`
- `suitescript-compat/require-explicit-api-version`
- `suitescript-compat/require-entrypoint-jsdoc`

### `suitescript-compat/require-entrypoint-jsdoc`

Requires SuiteScript entry point files to include both `@NApiVersion` and
`@NScriptType` in leading file-level JSDoc.

The rule treats a file as an entry point candidate when any of these signals are
present:

- the file already has a leading `@NScriptType` tag
- the file path matches `settings.suitescript.entrypointGlobs`
- the SuiteScript module factory returns User Event entry points:
  `beforeLoad`, `beforeSubmit`, or `afterSubmit`

Invalid code this rule catches:

```js
define([], function () {
  function beforeSubmit(context) {}

  return { beforeSubmit: beforeSubmit };
});
```

Valid code:

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

Full rule docs: [docs/rules/require-entrypoint-jsdoc.md](docs/rules/require-entrypoint-jsdoc.md)

### `suitescript-compat/no-2-1-modules-in-2-0`

Reports documented SuiteScript 2.1-only modules in scripts annotated as
`@NApiVersion 2.0` or `@NApiVersion 2.x`.

The rule currently reports:

- `N/llm` in `2.0` or `2.x` scripts
- `N/pgp` in `2.0` or `2.x` scripts
- `N/crypto/random` in `2.0` or `2.x` server scripts

Server context is determined from known server `@NScriptType` values, the rule
option `{ scriptContext: "server" }`, or
`settings.suitescript.defaultScriptContext: "server"`. Client and unknown
contexts do not report `N/crypto/random`.

Invalid code this rule catches:

```js
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define(["N/llm"], function (llm) {
  return {};
});
```

The same module is valid when the script explicitly runs as SuiteScript 2.1:

```js
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/llm"], function (llm) {
  return {};
});
```

Server-only `N/crypto/random` is also caught for known server script types:

```js
/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
require(["N/crypto/random"], function (random) {
  return {};
});
```

But client scripts do not receive the server-only diagnostic:

```js
/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 */
define(["N/crypto/random"], function (random) {
  return {};
});
```

Full rule docs: [docs/rules/no-2-1-modules-in-2-0.md](docs/rules/no-2-1-modules-in-2-0.md)

### `suitescript-compat/no-2-1-syntax-in-2-0`

Reports conservative JavaScript syntax compatibility risks in files annotated as
`@NApiVersion 2.0` or `@NApiVersion 2.x`.

The rule reports syntax forms that are not safe for SuiteScript 2.0's ES5.1
baseline, including:

- arrow functions
- classes
- template literals
- spread and rest syntax
- async functions and `await`
- ECMAScript module `import` and `export`
- optional chaining and nullish coalescing
- `for...of`
- `let` and `const`
- object and array destructuring

Invalid code this rule catches:

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

Valid SuiteScript 2.0-compatible code:

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

Full rule docs: [docs/rules/no-2-1-syntax-in-2-0.md](docs/rules/no-2-1-syntax-in-2-0.md)

### `suitescript-compat/require-explicit-api-version`

Optionally reports `@NApiVersion 2.x` so projects can require explicit
SuiteScript runtime annotations such as `2.0` or `2.1`.

This is a project-policy rule. It reports only when configured by rule option or
project settings.

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

Invalid code this rule catches when explicit-version policy is enabled:

```js
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define([], function () {
  return {};
});
```

Valid code:

```js
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([], function () {
  return {};
});
```

Full rule docs: [docs/rules/require-explicit-api-version.md](docs/rules/require-explicit-api-version.md)

## Settings

Settings live under `settings.suitescript`.

### `entrypointGlobs`

Identifies SuiteScript entry point files by path for
`require-entrypoint-jsdoc`.

```js
settings: {
  suitescript: {
    entrypointGlobs: ["SuiteScripts/**/*.js"]
  }
}
```

The matcher supports a small glob subset: `*` matches within one path segment,
and `**/` or `**` matches across path segments. Brace expansion, `?`, and
extglob patterns are not supported.

### `defaultScriptContext`

Provides a fallback script context for rules that need to distinguish server and
client behavior.

```js
settings: {
  suitescript: {
    defaultScriptContext: "server"
  }
}
```

Accepted values are `"server"`, `"client"`, and `"unknown"`.

### `requireExplicitApiVersion`

Enables `require-explicit-api-version` as a project-wide policy without passing
a rule option.

```js
settings: {
  suitescript: {
    requireExplicitApiVersion: true
  }
}
```

## Public Posture

This is unofficial community tooling for source-backed SuiteScript checks. It
does not replace NetSuite account validation, deployment records, or Oracle
documentation. Rule docs link to the repository source note or Oracle pages that
support each diagnostic, and policy-only checks are labeled as project policy.

## Examples And Adoption

See [docs/adoption.md](docs/adoption.md) for CI examples and the representative
valid and invalid example scripts under `examples/`.

Release posture is recorded in [docs/release-decision.md](docs/release-decision.md).
Future rule source review should follow
[docs/source-review.md](docs/source-review.md).

## Limitations

The rules use file-local JSDoc, module dependency arrays, and parser-visible
syntax. They do not read NetSuite accounts, deployment records, File Cabinet
metadata, or customer-specific project state. Parser settings must be modern
enough for syntax rules to inspect modern JavaScript; older parser settings can
fail before custom rules run.

The rules also avoid speculative checks that are not represented in source. For
example, they do not evaluate account-level SuiteScript 2.1 execution
preferences, deployment-only script type settings, governance behavior, or
dynamically computed module names.

## Local Validation

```sh
npm test
```

Preset fixture lint commands:

```sh
npx eslint --config packages/eslint-plugin-suitescript-compat/fixtures/presets/recommended/eslint.config.cjs packages/eslint-plugin-suitescript-compat/fixtures/presets/recommended/valid-user-event.js
npx eslint --config packages/eslint-plugin-suitescript-compat/fixtures/presets/strict/eslint.config.cjs packages/eslint-plugin-suitescript-compat/fixtures/presets/strict/valid-user-event.js
```
