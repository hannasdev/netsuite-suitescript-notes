# Release Decision

Decision date: 2026-06-13

## Current Decision

Prepare the package for a public npm preview release. Publish through GitHub
Actions trusted publishing instead of storing a long-lived npm automation token.

## Registry

npm is the target registry because discoverability matters for ESLint users.
The package name remains clearly unofficial and the README wording must not imply
Oracle or NetSuite endorsement. GitHub Packages remains a fallback only if
repository access control becomes more important than broad discoverability.

## Versioning Approach

Use SemVer with `0.x` versions until rule behavior is proven in real projects.
The first public preview is `0.1.0-alpha.0` and should be published with the
`next` npm dist-tag.

Release changes should update these files together when relevant:

- `package.json`
- package README
- rule docs when behavior or source basis changes
- release notes or changelog if the repository adopts one

Publishing requires the trusted publisher configuration described in
[release.md](release.md). The workflow refuses to publish when the Git tag does
not match the package version.
