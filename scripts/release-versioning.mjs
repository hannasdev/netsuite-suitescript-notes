#!/usr/bin/env node

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version);
  if (!match) {
    throw new Error(`Invalid SemVer version: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split(".") : []
  };
}

export function compareSemver(leftVersion, rightVersion) {
  const left = parseSemver(leftVersion);
  const right = parseSemver(rightVersion);

  for (const field of ["major", "minor", "patch"]) {
    const difference = left[field] - right[field];
    if (difference !== 0) return Math.sign(difference);
  }

  if (left.prerelease.length === 0 && right.prerelease.length > 0) return 1;
  if (left.prerelease.length > 0 && right.prerelease.length === 0) return -1;

  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = left.prerelease[index];
    const rightPart = right.prerelease[index];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    if (leftPart === rightPart) continue;

    const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : null;
    const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : null;
    if (leftNumber !== null && rightNumber !== null) {
      return Math.sign(leftNumber - rightNumber);
    }
    if (leftNumber !== null) return -1;
    if (rightNumber !== null) return 1;
    return leftPart < rightPart ? -1 : 1;
  }

  return 0;
}

export function determineIncrement(commitLog) {
  if (/^(?:[a-z]+(?:\([^)]+\))?!:|BREAKING[ -]CHANGE:)/gm.test(commitLog)) {
    return "major";
  }
  if (/^feat(?:\([^)]+\))?:/gm.test(commitLog)) return "minor";
  return "patch";
}

async function readStdin() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

function printUsage() {
  console.error("Usage: release-versioning.mjs increment | assert-not-behind <package-version> <tag-version>");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const command = process.argv[2];

  if (command === "increment") {
    process.stdout.write(`${determineIncrement(await readStdin())}\n`);
  } else if (command === "assert-not-behind") {
    const [packageVersion, tagVersion] = process.argv.slice(3);
    if (!packageVersion || !tagVersion) {
      printUsage();
      process.exit(1);
    }

    const comparison = compareSemver(packageVersion, tagVersion);
    if (comparison < 0) {
      console.error(`package.json version ${packageVersion} is behind latest tag ${tagVersion}.`);
      console.error("This usually means a stale workflow rerun after a tag was already published.");
      console.error("Do not rerun the old release job; trigger release from current main instead.");
      process.exit(1);
    }
  } else {
    printUsage();
    process.exit(1);
  }
}
