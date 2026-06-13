# Release Guide

This package publishes to npm through GitHub Actions trusted publishing. The
workflow does not require a long-lived npm automation token.

## One-Time npm Setup

Before the first release, configure a trusted publisher for
`eslint-plugin-suitescript-compat` on npmjs.com:

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

## Publish

For a preview release, update `package.json` to a prerelease version and create
a matching tag:

```sh
git tag v0.1.0-alpha.0
git push origin v0.1.0-alpha.0
```

Prerelease versions publish with the `next` dist-tag. Stable versions publish
with the `latest` dist-tag. The workflow refuses to publish when the Git tag does
not match the package version.

## Local Checks

Run these before tagging:

```sh
npm test
npm pack --dry-run --workspace eslint-plugin-suitescript-compat
```
