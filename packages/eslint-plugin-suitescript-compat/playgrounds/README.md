# SuiteScript ESLint Playgrounds

These playgrounds are small installable projects for checking plugin behavior as
it would appear in a real repository or IDE.

## `compat-only`

Installs only `eslint-plugin-suitescript-compat` from the local package path.
Use this playground to see compatibility diagnostics in isolation.

```sh
cd packages/eslint-plugin-suitescript-compat/playgrounds/compat-only
npm install
npm run lint
```

## `compat-plus-suitescript`

Installs both `eslint-plugin-suitescript-compat` and the community
`eslint-plugin-suitescript` package. Use this playground to compare our
compatibility diagnostics with the broader SuiteScript linting rules.

```sh
cd packages/eslint-plugin-suitescript-compat/playgrounds/compat-plus-suitescript
npm install
npm run lint
```

Both lint commands are expected to fail because the files intentionally contain
diagnostics. The two playgrounds use matching `SuiteScripts/` files so IDE
diagnostics can be compared side by side.

## IDE Diagnostics

Install the VS Code ESLint extension, run `npm install` in each playground, and
then open `suitescript-eslint-playgrounds.code-workspace`. The workspace opens
both playgrounds as real project roots so the ESLint extension can resolve each
local `package.json`, `node_modules/`, and `eslint.config.cjs`.

If you open the repository root instead, VS Code may not discover the nested
playground working directories. Add this to a local `.vscode/settings.json` and
restart the ESLint server:

```json
{
  "eslint.useFlatConfig": true,
  "eslint.options": {
    "overrideConfigFile": "eslint.config.cjs"
  },
  "eslint.validate": ["javascript"],
  "eslint.workingDirectories": [
    {
      "directory": "packages/eslint-plugin-suitescript-compat/playgrounds/compat-only"
    },
    {
      "directory": "packages/eslint-plugin-suitescript-compat/playgrounds/compat-plus-suitescript"
    }
  ]
}
```

If the ESLint output says it cannot find `.eslintrc.cjs`, VS Code is still using
a legacy config override from user or workspace settings. Remove that override,
or keep the `eslint.options.overrideConfigFile` setting above so the extension
loads `eslint.config.cjs`.
