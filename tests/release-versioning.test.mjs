import assert from "node:assert/strict";
import test from "node:test";

import { compareSemver, determineIncrement } from "../scripts/release-versioning.mjs";

test("detects breaking changes as major releases", () => {
  assert.equal(determineIncrement("feat!: remove legacy option"), "major");
  assert.equal(determineIncrement("fix(parser): tighten behavior\n\nBREAKING CHANGE: rejects old config"), "major");
});

test("detects features as minor releases", () => {
  assert.equal(determineIncrement("feat: add workflow action fixtures"), "minor");
  assert.equal(determineIncrement("fix: patch bug\n\nfeat(rules): add new compatibility rule"), "minor");
});

test("falls back to patch releases", () => {
  assert.equal(determineIncrement("fix: correct module detection"), "patch");
  assert.equal(determineIncrement("docs: clarify release process"), "patch");
});

test("compares SemVer releases and prereleases", () => {
  assert.equal(compareSemver("0.1.0", "0.1.0-alpha.0"), 1);
  assert.equal(compareSemver("0.1.0-alpha.1", "0.1.0-alpha.0"), 1);
  assert.equal(compareSemver("0.1.0-alpha.0", "0.1.0"), -1);
  assert.equal(compareSemver("1.0.0", "0.9.9"), 1);
  assert.equal(compareSemver("1.0.0", "1.0.0"), 0);
});
