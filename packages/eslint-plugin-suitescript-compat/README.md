# eslint-plugin-suitescript-compat

Unofficial ESLint rules for source-backed SuiteScript compatibility checks.

This package is private while rule behavior and release posture are being
reviewed. Package code is MIT licensed. Repository prose documentation outside
this package remains under the repository's root CC BY 4.0 license unless a
future release decision changes that boundary.

Oracle, NetSuite, SuiteScript, and related names belong to their respective
owners. This package is not affiliated with, endorsed by, or sponsored by
Oracle.

## Rules Included

- `suitescript-compat/no-2-1-modules-in-2-0`
- `suitescript-compat/no-2-1-syntax-in-2-0`
- `suitescript-compat/require-explicit-api-version`
- `suitescript-compat/require-entrypoint-jsdoc`

## Configs Included

- `suitescriptCompat.configs.recommended`
- `suitescriptCompat.configs.strict`

`recommended` enables lower-noise checks intended for regular CI:

- `suitescript-compat/require-entrypoint-jsdoc`
- `suitescript-compat/no-2-1-modules-in-2-0`

`strict` enables every current rule and requires explicit `@NApiVersion 2.0`
or `2.1` instead of `2.x`.

## Public Posture

This is unofficial community tooling for source-backed SuiteScript checks. It
does not replace NetSuite account validation, deployment records, or Oracle
documentation. Rule docs link to the repository source note or Oracle pages that
support each diagnostic, and policy-only checks are labeled as project policy.

## Installation And Configuration

This package is private while release posture is under review. In this
repository, `npm install` links the workspace package for local development.
For external evaluation before a release decision, install ESLint 9 and the
package from a local checkout or package path rather than publishing to npm:

```sh
npm install --save-dev eslint /path/to/netsuite/packages/eslint-plugin-suitescript-compat
```

From an external project, use the installed package name in an ESLint flat
config:

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

For stricter migration work, use `suitescriptCompat.configs.strict`.

## Adoption Workflows

See [docs/adoption.md](docs/adoption.md) for local-checkout setup, CI examples,
and the representative valid and invalid example scripts under `examples/`.

Release posture is recorded in [docs/release-decision.md](docs/release-decision.md).
Future rule source review should follow
[docs/source-review.md](docs/source-review.md).

## Limitations

The rules use file-local JSDoc, module dependency arrays, and parser-visible
syntax. They do not read NetSuite accounts, deployment records, File Cabinet
metadata, or customer-specific project state. Parser settings must be modern
enough for syntax rules to inspect modern JavaScript; older parser settings can
fail before custom rules run.

## Local Validation

```sh
npm test
```

Preset fixture lint commands:

```sh
npx eslint --config packages/eslint-plugin-suitescript-compat/fixtures/presets/recommended/eslint.config.cjs packages/eslint-plugin-suitescript-compat/fixtures/presets/recommended/valid-user-event.js
npx eslint --config packages/eslint-plugin-suitescript-compat/fixtures/presets/strict/eslint.config.cjs packages/eslint-plugin-suitescript-compat/fixtures/presets/strict/valid-user-event.js
```
