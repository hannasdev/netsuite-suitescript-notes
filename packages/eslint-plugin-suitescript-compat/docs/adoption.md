# Adoption Guide

This package is unofficial community tooling for source-backed SuiteScript
compatibility checks. It is not affiliated with, endorsed by, or sponsored by
Oracle. The checks operate on JavaScript source files and do not read NetSuite
accounts, deployment records, script records, credentials, or File Cabinet
metadata.

## Local Checkout Evaluation

Until a release decision changes package distribution, evaluate the plugin from a
local checkout in a project that also installs ESLint 9:

```sh
npm install --save-dev eslint /path/to/netsuite/packages/eslint-plugin-suitescript-compat
```

Then use the installed package from an ESLint flat config:

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

When evaluating from this repository root, use the example config directly:

```sh
npx eslint --config packages/eslint-plugin-suitescript-compat/examples/eslint.config.cjs packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/recommended/valid-user-event.js
```

## Preset Choice

Use `recommended` first for low-noise CI checks:

- missing `@NApiVersion` or `@NScriptType` on entry point files
- documented SuiteScript 2.1-only modules in `2.0` or `2.x` scripts

Use `strict` for migration work that should also prevent:

- `@NApiVersion 2.x` when the project requires explicit `2.0` or `2.1`
- conservative SuiteScript 2.0 syntax compatibility risks

## CI Example

For a project with SuiteScript files under `SuiteScripts/`, add an npm script:

```json
{
  "scripts": {
    "lint:suitescript": "eslint \"SuiteScripts/**/*.js\""
  }
}
```

Then run it in CI after dependencies are installed:

```sh
npm run lint:suitescript
```

## Representative Examples

The `examples/SuiteScripts/` tree includes small synthetic files with no
customer-specific data:

- `recommended/valid-user-event.js`: valid with the `recommended` preset.
- `recommended/invalid-missing-jsdoc.js`: reports missing entry point JSDoc.
- `recommended/invalid-2-1-module.js`: reports a 2.1-only module in a 2.0 file.
- `strict/valid-2-1-user-event.js`: valid with the `strict` preset.
- `strict/invalid-2x-arrow.js`: reports explicit-version policy and syntax
  compatibility diagnostics.

To inspect expected diagnostics manually, run:

```sh
npx eslint --config packages/eslint-plugin-suitescript-compat/examples/eslint.config.cjs packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/recommended/invalid-missing-jsdoc.js
npx eslint --config packages/eslint-plugin-suitescript-compat/examples/eslint.config.cjs packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/strict/invalid-2x-arrow.js
```

Those commands are expected to fail because the files intentionally demonstrate
diagnostics.

The example config includes both copy-ready project globs such as
`SuiteScripts/**/*.js` and repository-root globs for the checked-in examples.

## Limitations

The plugin uses file-local source evidence only. It cannot know deployment-only
script type settings, account-level execution preferences, bundle metadata, or
customer-specific conventions unless those conventions are represented in ESLint
settings.
