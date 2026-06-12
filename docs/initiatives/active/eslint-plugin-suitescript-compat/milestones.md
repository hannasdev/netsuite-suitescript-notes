# ESLint Plugin For SuiteScript Compatibility Milestones

## M1: Plugin Skeleton And JSDoc Rule

### Outcome

Create a working ESLint plugin skeleton with the first reliable rule: detecting missing mandatory SuiteScript entry point JSDoc annotations.

### Scope

- Add repo-root npm workspace structure with plugin source under `packages/eslint-plugin-suitescript-compat`.
- Add package metadata with `private: true`, package-local MIT code license, and README/license wording that distinguishes package code from root CC BY 4.0 prose docs.
- Add rule docs infrastructure.
- Implement `require-entrypoint-jsdoc`.
- Add fixtures and tests for configured entrypoint files, User Event returned-object inference, and shared modules.
- Document local test command.

### Scope Budget

- Primary behavior change: running ESLint can flag SuiteScript entry point files missing `@NApiVersion` or `@NScriptType`.
- Major subsystem boundaries touched: package scaffolding, JSDoc rule/test fixtures.
- Acceptance criteria count: 5.
- Estimated non-generated diff size: under 800 changed lines.
- Validation shape: focused automated rule tests.
- Split rationale: this is the smallest useful vertical slice because it proves parser setup, rule shape, docs, and testing with one high-confidence rule.

### Non-Goals

- Do not implement version-only module checks yet.
- Do not publish the package.
- Do not infer customer deployment metadata beyond local file content and optional config.
- Do not implement the full script-type-to-entrypoint mapping beyond User Event returned-object inference.

### Acceptance Criteria

- [x] A private local package with package-local MIT code licensing can load as an ESLint plugin.
- [x] `require-entrypoint-jsdoc` reports missing `@NApiVersion` for files in Milestone 1's inference scope.
- [x] `require-entrypoint-jsdoc` reports missing `@NScriptType` for files in Milestone 1's inference scope.
- [x] Shared modules without entry point exports are not flagged by default.
- [x] Rule docs cite Oracle's SuiteScript 2.x overview and User Event tutorial, plus the repository's SuiteScript version note, and explain when the rule treats annotations as mandatory.

### Required Validation

- `npm test`
- Manual: review rule docs for source-backed wording and explicit inference labels.

### Risks / Watchpoints

- The rule must avoid requiring `@NScriptType` for plain library modules.
- The rule should support configured entrypoint files and User Event files that return `beforeLoad`, `beforeSubmit`, or `afterSubmit`.
- Package/license wording must keep docs/code licensing distinct before any public package release.

### Status

- [ ] Not started
- [x] Implemented
- [x] Conformance reviewed
- [x] Adversarially reviewed
- [x] PR opened
- [x] Merged

## M2: Version And Module Compatibility Rules

### Outcome

Add checks for ambiguous SuiteScript version annotations and 2.1-only module usage in scripts that target SuiteScript 2.0 or `2.x`.

### Scope

- Implement `require-explicit-api-version`.
- Implement `no-2-1-modules-in-2-0`.
- Detect module IDs in `define([...])` and `require([...])`.
- Treat server-only `N/crypto/random` as reportable only when the script context is known or configured as server; emit no diagnostic in `recommended` when context is unknown.
- Add rule docs with Oracle source links and release caveats.
- Add tests for `2.0`, `2.x`, and `2.1` scripts.

### Scope Budget

- Primary behavior change: linting catches ambiguous API versions and 2.1-only modules in non-2.1 scripts.
- Major subsystem boundaries touched: rule source, shared JSDoc/module parsing helpers.
- Acceptance criteria count: 6, because the server/client/unknown context handling for `N/crypto/random` is important enough to track explicitly.
- Estimated non-generated diff size: under 800 changed lines.
- Validation shape: focused automated rule tests.
- Split rationale: version parsing and module import detection are related enough to share helpers but separable from syntax compatibility.

### Non-Goals

- Do not implement syntax compatibility checks in this milestone.
- Do not attempt to resolve dynamically computed module names.
- Do not model account-level preferences beyond documented rule options.

### Acceptance Criteria

- [x] `require-explicit-api-version` can flag `@NApiVersion 2.x` when configured.
- [x] `no-2-1-modules-in-2-0` flags `N/llm`, `N/pgp`, and server-side `N/crypto/random` in `2.0` or `2.x` scripts.
- [x] The module rule does not flag those modules in explicitly `2.1` scripts.
- [x] `N/crypto/random` behavior is covered for server, client, and unknown contexts.
- [x] Rule messages name the detected API version and module.
- [x] Rule docs explain that diagnostics are based on file annotations and documented module availability; account-level execution preferences do not by themselves make a `2.0` or `2.x` file safe to use 2.1-only modules.

### Required Validation

- `npm test`
- Manual: compare 2.1-only module list to the reviewed source note before merge.

### Risks / Watchpoints

- Module detection should cover normal SuiteScript AMD patterns without overreaching into arbitrary strings.
- Rule docs must not imply that account preferences change file upload syntax validation.

### Status

- [ ] Not started
- [x] Implemented
- [x] Conformance reviewed
- [x] Adversarially reviewed
- [x] PR opened
- [ ] Merged

## M3: Syntax Compatibility Rule

### Outcome

Add conservative SuiteScript 2.0 syntax compatibility checks.

### Scope

- Implement `no-2-1-syntax-in-2-0` for a conservative list of syntax features.
- Cover the initial syntax/node list documented in architecture notes.
- Document parser-error behavior for syntax that cannot be parsed before custom rules run.
- Add focused tests for `2.0`, `2.x`, and `2.1` scripts.

### Scope Budget

- Primary behavior change: users can catch a conservative set of ES5.1-incompatible syntax in `2.0` and `2.x` scripts.
- Major subsystem boundaries touched: rule source, rule tests.
- Acceptance criteria count: 5.
- Estimated non-generated diff size: under 800 changed lines.
- Validation shape: automated rule tests.
- Split rationale: syntax checks are isolated from preset/default decisions to reduce review churn.

### Non-Goals

- Do not publish to npm unless separately approved.
- Do not include every documented 2.0/2.1 runtime behavior difference.
- Do not add recommended or strict presets in this milestone.
- Do not support TypeScript-specific SuiteScript parsing unless the repository chooses TypeScript as an explicit target.

### Acceptance Criteria

- [ ] `no-2-1-syntax-in-2-0` flags a conservative initial syntax list for `2.0` and `2.x` scripts.
- [ ] The rule does not flag explicitly `2.1` scripts for those syntax forms.
- [ ] Parser-error strategy is documented in rule docs.
- [ ] Tests cover each syntax node in the initial list.
- [ ] Rule docs explain that this is an ES5.1 compatibility check, not a complete NetSuite runtime emulator.

### Required Validation

- `npm test`
- Manual: review parser-error documentation against fixture behavior.

### Risks / Watchpoints

- Some syntax may be rejected by the parser before a custom ESLint rule can report it.
- The initial syntax list must stay conservative; speculative runtime behavior checks belong in later rules.

### Status

- [ ] Not started
- [ ] Implemented
- [ ] Conformance reviewed
- [ ] Adversarially reviewed
- [ ] PR opened
- [ ] Merged

## M4: Config Presets And Usage Documentation

### Outcome

Expose recommended and strict ESLint configurations and document local usage.

### Scope

- Add `recommended` and `strict` plugin configurations.
- Add user-facing setup documentation.
- Add example fixture configuration.
- Validate the plugin against its own fixtures with both presets.

### Scope Budget

- Primary behavior change: users can enable presets and catch documented checks through a standard ESLint setup.
- Major subsystem boundaries touched: config exports, user docs.
- Acceptance criteria count: 5.
- Estimated non-generated diff size: under 800 changed lines.
- Validation shape: automated tests plus manual fixture lint run.
- Split rationale: presets and usage docs are reviewed after individual rule behavior stabilizes.

### Non-Goals

- Do not add new lint rules in this milestone.
- Do not publish to npm.
- Do not support TypeScript-specific SuiteScript parsing unless separately planned.

### Acceptance Criteria

- [ ] `recommended` includes low-noise rules only.
- [ ] `strict` includes explicit version policy and syntax compatibility checks.
- [ ] README or package docs explain installation, configuration, and limitations.
- [ ] Example config demonstrates project settings for entrypoint globs and script context.
- [ ] Manual fixture lint run succeeds with both presets.

### Required Validation

- `npm test`
- Manual: run ESLint against fixture files with `recommended` and `strict` configs.

### Risks / Watchpoints

- Presets should default to trust-building diagnostics, not a flood of speculative warnings.
- Docs must keep the unofficial/trademark posture from `NOTICE.md`.

### Status

- [ ] Not started
- [ ] Implemented
- [ ] Conformance reviewed
- [ ] Adversarially reviewed
- [ ] PR opened
- [ ] Merged

## M5: Examples And Release Decision

### Outcome

Prepare the plugin for public use by documenting workflows, examples, limitations, and the release path.

### Scope

- Add example SuiteScript files and ESLint config snippets.
- Document CI usage.
- Document source review process for adding future rules.
- If approved, prepare package metadata for an initial prerelease.

### Scope Budget

- Primary behavior change: maintainers can evaluate and adopt the plugin without reading implementation code.
- Major subsystem boundaries touched: docs, package metadata if release is approved.
- Acceptance criteria count: 5.
- Estimated non-generated diff size: under 800 changed lines.
- Validation shape: manual docs walkthrough plus automated tests from prior milestones.
- Split rationale: adoption docs and release packaging are reviewable after behavior stabilizes.

### Non-Goals

- Do not add new lint rules in this milestone.
- Do not publish without explicit approval.
- Do not claim official Oracle or NetSuite endorsement.

### Acceptance Criteria

- [ ] Public docs explain the plugin's unofficial status and source-backed posture.
- [ ] Example SuiteScript files show representative valid and invalid diagnostics.
- [ ] Rule documentation includes source links or repository source-note links.
- [ ] Release decision is recorded, including package registry and versioning approach.
- [ ] All tests from prior milestones pass before any release preparation.

### Required Validation

- `npm test`
- Manual: follow the setup docs in a clean fixture or temporary project.

### Risks / Watchpoints

- Publishing too early can create support expectations before rule semantics settle.
- Splitting to a separate repo later may require import path and documentation changes.

### Status

- [ ] Not started
- [ ] Implemented
- [ ] Conformance reviewed
- [ ] Adversarially reviewed
- [ ] PR opened
- [ ] Merged
