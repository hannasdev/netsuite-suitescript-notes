# Release Guide

This package publishes to npm through GitHub Actions trusted publishing. The
workflow does not require a long-lived npm automation token.

## One-Time GitHub Setup

The release workflow mirrors the deploy-key release pattern used in
`mcp-writing`. When a PR is merged to `main`, `.github/workflows/release.yml`
determines the SemVer increment from conventional commits, commits the workspace
version bump, and pushes a matching `v*.*.*` tag.

Configure a dedicated release deploy key:

- Generate an SSH keypair for release automation.
- Add the public key as a repository deploy key with write access.
- Add the private key as an Actions secret named `RELEASE_DEPLOY_KEY`.
- Optionally add `RELEASE_DEPLOY_KNOWN_HOSTS` if strict known-host pinning is
  required beyond GitHub.com defaults.
- Add the deploy key actor as a bypass actor in the `main` branch ruleset.

Version increments follow conventional commits:

- `fix:` and non-feature changes create a patch release.
- `feat:` creates a minor release.
- `feat!:`, `fix!:`, or `BREAKING CHANGE` creates a major release.

## One-Time npm Setup

Configure a trusted publisher for `eslint-plugin-suitescript-compat` on
npmjs.com:

- Publisher: GitHub Actions
- Organization or user: `hannasdev`
- Repository: `eslint-plugin-suitescript-compat`
- Workflow filename: `publish.yml`
- Environment name: leave blank
- Allowed actions: `npm publish`

The workflow must exist at `.github/workflows/publish.yml` before npm will be
able to validate the trusted publisher configuration.

## Dry Run

From GitHub Actions, run `Publish npm package` manually with:

- `dry_run`: `true`
- `npm_tag`: `next`

This installs dependencies, runs tests, verifies package contents, and runs
`npm publish --dry-run` without publishing a package version.

## Publish Flow

Normal releases are automatic after a PR merge to `main`:

1. `release.yml` bumps `packages/eslint-plugin-suitescript-compat/package.json`
   and `package-lock.json`.
2. `release.yml` commits `Release <version>` back to `main`.
3. `release.yml` pushes tag `v<version>`.
4. `release.yml` creates a GitHub release with generated notes.
5. `publish.yml` runs on the tag and publishes to npm.

Prerelease versions publish with the `next` dist-tag. Stable versions publish
with the `latest` dist-tag. The workflow refuses to publish when the Git tag does
not match the package version.

## Local Checks

Run these before tagging:

```sh
npm test
npm pack --dry-run --workspace eslint-plugin-suitescript-compat
```
