# Source Review Process

Use this process before adding or changing SuiteScript compatibility rules.

## Source Standard

- Prefer official Oracle NetSuite documentation for direct product claims.
- Link to the repository SuiteScript version note when it already records a
  reviewed source trail.
- Mark repository policy separately from Oracle-documented behavior.
- Do not copy vendor documentation into this repository.
- Keep quotations short and necessary.

## Rule Update Checklist

For every new or changed rule:

- Record the source basis in the rule doc.
- Explain limitations and file-only inference boundaries.
- Add positive and negative tests that exercise the claimed behavior.
- Include examples that avoid account IDs, customer script IDs, internal URLs,
  screenshots, credentials, and proprietary code.
- Run `npm test`.

## Release Review Checklist

Before changing release posture:

- Confirm package name and trademark wording are unofficial.
- Confirm package code and repository prose license boundaries are still clear.
- Confirm `private` is changed only with explicit human approval.
- Confirm source links are current for any public behavior claims.
- Record registry and versioning decisions in `docs/release-decision.md`.
