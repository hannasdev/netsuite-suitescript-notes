# Release Decision

Decision date: 2026-06-12

## Current Decision

Do not publish this package in M5. Keep
`packages/eslint-plugin-suitescript-compat/package.json` marked `"private": true`
and support evaluation from a local checkout.

## Registry

No package registry is active for this milestone. The package is source-only in
this repository until a future release milestone approves publication.

If publication is approved later, prefer npm with a clearly unofficial package
name and README wording that does not imply Oracle or NetSuite endorsement.
GitHub Packages remains a fallback if repository access control matters more
than broad discoverability.

## Versioning Approach

The package remains at `0.0.0` while private. A future prerelease should use
SemVer with `0.x` versions until rule behavior is proven in real projects, for
example `0.1.0-alpha.0` for an initial public preview.

Any future release milestone should update these files together:

- `package.json`
- package README
- rule docs when behavior or source basis changes
- release notes or changelog if the repository adopts one

Publishing is explicitly out of scope until a human approves the registry,
package name, version, and support posture.
