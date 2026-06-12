# ESLint Plugin For SuiteScript Compatibility

## Status

- State: Active
- Owner: TBD
- Created: 2026-06-12
- Related docs:
  - [SuiteScript 1.0 vs 2.0 vs 2.1 in NetSuite 2026.1](../../../../docs/suitescript-versions-2026-1.md)

## Problem

NetSuite SuiteScript projects can drift into runtime ambiguity: files may omit mandatory SuiteScript JSDoc annotations, use `@NApiVersion 2.x` when explicit runtime behavior matters, import SuiteScript 2.1-only modules from 2.0 scripts, or use JavaScript syntax that is incompatible with the target SuiteScript runtime.

The current repository documents those compatibility issues, but it does not yet give maintainers an automated way to detect them in code review or CI.

Oracle source basis: Oracle's SuiteScript 2.x overview says SuiteScript 2.x scripts need SuiteScript JSDoc tags for API version and script type. Oracle's User Event tutorial says `@NApiVersion` is required in all entry point scripts, shows `@NScriptType` as the script type tag, and says returned entry points must match the script type set by `@NScriptType`. [Overview source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098615298.html), [User Event tutorial source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_1510274245.html)

## Goals

- Provide an ESLint plugin that catches reliable, source-backed SuiteScript compatibility issues.
- Make missing mandatory entry point annotations visible, especially `@NApiVersion` and `@NScriptType`, with rule docs linking to the Oracle source basis.
- Detect SuiteScript version and script type from file-level JSDoc without requiring NetSuite account access.
- Give each rule documentation that explains the risk and links back to official Oracle NetSuite sources or repository notes.
- Keep the initial rule set conservative so users trust warnings and errors.

## Non-Goals

- Do not attempt to fully emulate NetSuite's deployment validator.
- Do not require customer account metadata, script records, deployment records, or File Cabinet access.
- Do not lint SuiteScript 1.0 APIs beyond clear version annotation and compatibility boundaries in the MVP.
- Do not publish to npm as part of the first implementation milestone unless explicitly activated later.
- Do not hard-code customer-specific project layouts.

## Product And Design Alignment

This repository is an unofficial, source-linked NetSuite SuiteScript knowledge base. The plugin should follow the same posture: original analysis, conservative claims, links to Oracle documentation, and no copied vendor documentation.

The tool should be useful to maintainers before deployment, especially in code review and CI, while making uncertainty explicit when a check depends on metadata outside a single JavaScript file.

## Proposed Solution

Create an ESLint plugin tentatively named `eslint-plugin-suitescript-compat`.

Naming note: SuiteScript and NetSuite are Oracle marks. Public package and README copy must describe the plugin as unofficial community tooling and must not imply Oracle or NetSuite endorsement.

The MVP should include rules that operate on a single file and produce low-noise diagnostics:

- `require-entrypoint-jsdoc`: require `@NApiVersion` and `@NScriptType` when a file is known or strongly inferred to be a SuiteScript entry point script.
- `require-explicit-api-version`: optionally flag `@NApiVersion 2.x` when project policy requires `2.0` or `2.1`.
- `no-2-1-modules-in-2-0`: flag SuiteScript 2.1-only modules in scripts annotated as `2.0` or `2.x`.
- `no-2-1-syntax-in-2-0`: flag ECMAScript syntax that cannot be safely parsed or executed by SuiteScript 2.0's ES5.1 runtime, using ESLint parser capabilities and conservative rule checks.

The plugin should expose recommended configurations that users can adopt gradually:

- `recommended`: low-noise checks suitable for CI.
- `strict`: stronger migration checks, including explicit version policy.

## User / Maintainer Workflows

- A maintainer adds the plugin to an existing SuiteScript project and enables `recommended` rules in CI.
- A developer opens a pull request with a new User Event script missing `@NScriptType`; lint fails with a source-backed message.
- A migration team enables stricter checks to prevent new `@NApiVersion 2.x` files and catch accidental use of 2.1-only modules in 2.0 scripts.
- A reviewer uses rule documentation to understand whether a diagnostic is a direct Oracle-documented incompatibility or a conservative project policy.

## Acceptance Criteria

- [ ] The repository contains a planned ESLint plugin package structure with rule source, tests, and rule docs.
- [ ] The MVP rules identify missing entry point JSDoc, ambiguous API version annotations, 2.1-only modules in 2.0/2.x scripts, and 2.1 syntax in 2.0/2.x scripts.
- [ ] Rule docs clearly separate Oracle-documented behavior from project policy or inference.
- [ ] Tests cover positive and negative examples for each MVP rule.
- [ ] The plugin can be run locally against fixture files with a documented command.
- [ ] No rule requires proprietary NetSuite account data or customer-specific metadata.

## Risks And Tradeoffs

| Risk | Impact | Mitigation / Decision Path |
| --- | --- | --- |
| False positives on shared modules | Users disable the plugin | Require entry point annotations only when configured or strongly inferred from entry points/script type JSDoc. |
| Parser support for ES5.1-incompatible syntax varies by ESLint parser config | Some syntax may fail before the rule runs | Document parser expectations and use ESLint parser errors as part of the validation story where appropriate. |
| Oracle docs use both `@ScriptType` and `@NScriptType` wording in different contexts | Rule could enforce the wrong spelling | Treat `@NScriptType` as the primary SuiteScript 2.x annotation used in script files, but document source wording and support compatibility aliases only if verified. |
| Script type often lives in deployment metadata rather than file name | Rule cannot know every mandatory case | Support explicit config and conservative inference; avoid pretending file-only linting has account context. |
| Source-backed compatibility list may change across NetSuite releases | Rules become stale | Store rule docs with release/source references and design rule metadata for future version updates. |

## Testing Strategy

Use ESLint's rule testing utilities to validate each rule with focused fixtures. Tests should include:

- valid entry point scripts with both required JSDoc tags
- invalid entry point scripts missing one or both tags
- custom modules that should not require `@NScriptType`
- scripts annotated as `2.0`, `2.x`, and `2.1`
- imports through both `define([...])` and `require([...])`
- syntax examples that are invalid under the configured SuiteScript version

Run the plugin test suite locally before milestone completion and document any manual source review needed for new rules.

## Open Questions

- [ ] Should the package eventually be published under a personal npm scope, GitHub Packages, or kept source-only? Until this is decided in Milestone 5, the package should use `private: true`.
- [ ] Which project layouts should be included as first-party examples: SuiteCloud project, File Cabinet export, or generic `src/**/*.js`?
