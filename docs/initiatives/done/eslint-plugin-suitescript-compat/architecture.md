# ESLint Plugin For SuiteScript Compatibility Architecture Notes

## Context

The initiative changes this repository from documentation-only into a repository that may contain runnable tooling. The architecture needs to keep rule behavior source-backed, testable, and conservative while leaving room for future SuiteScript release updates.

## Current State

The repository currently contains Markdown documentation about SuiteScript version behavior and source-review conventions. It has no package structure, test framework, ESLint dependency, or generated artifacts.

The current source note documents:

- SuiteScript 1.0 support and maintenance posture.
- SuiteScript 2.0 and 2.1 runtime differences.
- 2026.1 account-level execution preferences.
- Inferred versus directly sourced script type compatibility claims.

## Target Shape

The repository should gain a small ESLint plugin package that can be tested locally and used by external SuiteScript projects.

Expected package responsibilities:

- Parse file-level SuiteScript JSDoc from comments.
- Identify candidate entry point scripts from JSDoc, returned entry point names, and optional configuration.
- Inspect SuiteScript module IDs in common `define([...])` and `require([...])` patterns.
- Report diagnostics with rule docs that distinguish direct Oracle documentation from repository policy.
- Export `recommended` and `strict` configurations.

Initial implementation baseline:

- Repository shape: npm workspace at the repository root, with plugin source in `packages/eslint-plugin-suitescript-compat`.
- Package manager: npm.
- Node runtime: Node.js 20 or newer.
- ESLint target: ESLint 9 flat-config compatible plugin exports first.
- Module format: CommonJS package entry point for the initial implementation.
- Test runner: Node's built-in `node --test` with ESLint `RuleTester`.
- Root validation command: `npm test`.
- Initial package distribution state: `private: true` until Milestone 5 records a release decision.
- Code license boundary: package code should use MIT via package metadata and a package-local license file; repository prose documentation remains under the root CC BY 4.0 license unless a later licensing change is explicitly planned.

## Decisions

| Decision | Rationale | Alternatives Considered |
| --- | --- | --- |
| Build as an ESLint plugin | ESLint is already the standard JavaScript static analysis extension point and supports rule tests, configs, and CI workflows. | Standalone CLI, NetSuite SDF validation wrapper. |
| Keep plugin source in this repository under `packages/` initially | It keeps source-backed docs and tooling together while behavior is still settling. | Separate repository immediately, root-level package only. |
| Target ESLint 9, Node 20+, CommonJS, npm, and `node --test` first | This gives a concrete implementation baseline with modern ESLint support and minimal test infrastructure. | ESLint 8 compatibility, dual ESM/CJS, Vitest/Jest, pnpm/yarn. |
| Keep the initial npm package private and package code MIT-licensed | The root repository currently licenses original prose content under CC BY 4.0, which is not a good default for reusable code. A package-local MIT license and `private: true` avoid confusing docs/code licensing and accidental publication before review. | Apply CC BY 4.0 to code, change the whole repository license immediately, publish before release review. |
| Start with file-only analysis | It avoids needing customer account data or deployment metadata and keeps the tool broadly usable. | Require script records, SDF project metadata, or NetSuite account access. |
| Require explicit config for ambiguous mandatory cases | Shared modules and entry scripts can look similar; config avoids noisy enforcement. | Force all `*.js` files to include SuiteScript entry point JSDoc. |
| Treat `@NScriptType` as the plugin's primary script-type annotation target | SuiteScript files commonly use `@NScriptType`; custom tool 2026.1 docs also reference this spelling. | Support only `@ScriptType`, or silently accept any tag spelling. |
| Keep rule docs source-linked | This repository's trust model depends on traceable claims. | Put source links only in the central Markdown note. |
| Avoid npm publishing until behavior is reviewed | Early source review and local usage matter more than package distribution. | Publish a package as soon as the skeleton works. |

## Contracts And Boundaries

- Rule modules own AST inspection and diagnostics.
- Shared helpers own SuiteScript JSDoc extraction, script type normalization, API version normalization, and module ID detection.
- Rule docs own user-facing source rationale and limitations.
- Tests own examples of valid and invalid behavior; they should be the executable specification for each rule.
- Package metadata owns code license and publication state; the first implementation must keep `private: true` and mark package code as MIT-licensed.
- Repository documentation remains unofficial and must not imply Oracle or NetSuite endorsement.

## Configuration Contract

The plugin should allow project-specific metadata without requiring it:

```js
settings: {
  suitescript: {
    entrypointGlobs: ["src/FileCabinet/SuiteScripts/**/*.js"],
    requireExplicitApiVersion: false,
    defaultScriptContext: "server"
  }
}
```

Rule-level options may override settings when needed. Configuration should be additive: the plugin can infer likely entry point scripts, but explicit project configuration should win.

## JSDoc Detection Contract

The plugin should extract SuiteScript JSDoc from leading block comments and normalize at least:

- `@NApiVersion`
- `@NScriptType`
- `@ScriptType` only if verified and intentionally supported

Source basis:

- Oracle's SuiteScript 2.x overview says SuiteScript 2.x scripts need SuiteScript JSDoc tags for API version and script type.
- Oracle's User Event tutorial says `@NApiVersion` is required in all entry point scripts and shows `@NScriptType` as the script type tag.
- Rule docs must link directly to those Oracle pages and must explain any project-policy layer separately from direct Oracle wording.

The first implementation should not rewrite files or auto-insert annotations. Autofix can be considered later only when script type and API version are unambiguous.

## Entry Point Detection Contract

The plugin may treat a file as an entry point script when any of these are true:

- The file has `@NScriptType`.
- The file path matches configured entry point globs.
- The returned object from a SuiteScript `define` or `require` module factory includes enough known entry point names to map to one script type.

The plugin should avoid flagging shared modules by default when none of those signals are present.

Initial script-type-to-entrypoint mapping:

| Script type | Strong entry point signals |
| --- | --- |
| UserEventScript | `beforeLoad`, `beforeSubmit`, `afterSubmit` |
| Suitelet | `onRequest` |
| ScheduledScript | `execute` |
| MapReduceScript | `getInputData`, `map`, `reduce`, `summarize` |
| ClientScript | `pageInit`, `fieldChanged`, `postSourcing`, `sublistChanged`, `lineInit`, `validateField`, `validateLine`, `validateInsert`, `validateDelete`, `saveRecord`, `localizationContextEnter`, `localizationContextExit` |
| Restlet | `get`, `post`, `put`, `delete` |
| Portlet | `render` |
| MassUpdateScript | `each` |
| WorkflowActionScript | `onAction` |

Single generic names such as `execute`, `get`, `post`, `delete`, or `render` are strong only when they appear in a SuiteScript `define`/`require` module return object or the file is within configured entrypoint globs. If a signal remains ambiguous, the rule should prefer no diagnostic unless configuration marks the file as an entry point.

Milestone 1 inference scope is intentionally narrower than the target mapping: it should support files that already have `@NScriptType`, configured entrypoint globs, and User Event returned-object inference using `beforeLoad`, `beforeSubmit`, or `afterSubmit`. Other script type inference from the table is deferred until a later milestone explicitly adds tests and rule documentation for it.

Bundle Installation, SDF Installation, and Custom Tool entrypoint inference are intentionally deferred from the initial mapping. They require additional source review and examples before being treated as strong file-only signals.

## Syntax Compatibility Contract

The initial `no-2-1-syntax-in-2-0` rule should run with parser options that can parse modern JavaScript, then report a conservative ES5.1-incompatible node list when the file is annotated as `@NApiVersion 2.0` or `2.x`.

Initial syntax/node list:

- `ArrowFunctionExpression`
- `ClassDeclaration` and `ClassExpression`
- `TemplateLiteral`
- `SpreadElement` and object spread properties when represented by the parser
- `RestElement`
- `AwaitExpression` and async functions
- `ImportDeclaration`, `ExportNamedDeclaration`, `ExportDefaultDeclaration`, and `ExportAllDeclaration`
- optional chaining nodes
- nullish coalescing expressions
- `ForOfStatement`
- `VariableDeclaration` with `let` or `const`
- destructuring patterns in declarations, parameters, or assignments

Parser-error strategy: if the configured parser cannot parse a syntax form before the custom rule runs, the plugin documentation should tell users to rely on the parser error for that case and should include fixtures showing which diagnostics are parser-provided versus rule-provided.

## Module Compatibility Contract

The initial 2.1-only module list is:

- `N/llm`
- `N/pgp`
- `N/crypto/random` when used in server scripts

Server context should be determined from `@NScriptType`, explicit rule options, or `settings.suitescript.defaultScriptContext`. Client scripts should not be reported for `N/crypto/random` solely on the server-only basis. Unknown context should produce no `N/crypto/random` diagnostic in `recommended`; `strict` may opt into reporting unknown context with a message that names the uncertainty.

## Migration / Compatibility

Existing documentation remains valid and should not depend on the plugin. The plugin should link to docs where useful, but rule behavior should be tested independently.

If the package later moves to a separate repository, source links and package names should be updated in one milestone rather than mixed into rule implementation work.

## Failure Modes

- Parser cannot parse syntax before a custom rule runs: document parser requirements and include fixtures that demonstrate expected behavior.
- Dynamic module name cannot be resolved: do not report unless a literal SuiteScript module ID is visible.
- Script type cannot be inferred: do not require `@NScriptType` unless configured or entry point signals are strong.
- Oracle changes source documentation: update rule docs and tests in the same change that updates compatibility behavior.

## Security / Safety Considerations

- The plugin should not read NetSuite credentials, account IDs, deployment records, or external services.
- Rule tests should use synthetic examples only.
- Documentation and examples must avoid customer-specific script IDs, account URLs, and proprietary code.
- Any future publishing workflow should avoid committing npm tokens or generated credentials.

## Validation

- ESLint rule tests for every diagnostic.
- Fixture lint runs for recommended and strict configurations.
- Manual source review for every rule that claims Oracle-documented behavior.
- GitHub CI can be added once the package structure exists.

## Open Questions

- [ ] Should any rules provide autofixes, or should the initial plugin be diagnostic-only?
