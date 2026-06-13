# All-Rules Script Type Examples

These files are intentionally invalid SuiteScript examples for checking IDE
diagnostics with every `eslint-plugin-suitescript-compat` rule enabled.

From this repository, run:

```sh
npm install
npx eslint --config packages/eslint-plugin-suitescript-compat/examples/eslint.config.cjs packages/eslint-plugin-suitescript-compat/examples/SuiteScripts/strict/all-rules-by-script-type
```

That command is expected to fail because these files intentionally contain
diagnostics.

For IDE use, install and enable the editor's ESLint integration, then make sure
it uses `packages/eslint-plugin-suitescript-compat/examples/eslint.config.cjs`
for files under this examples tree. The config imports the local plugin source
with `require("../src")`, so these checked-in examples do not need a published
package install.

In another project, install the plugin package or local package path and import
`eslint-plugin-suitescript-compat` from that project's ESLint flat config.
