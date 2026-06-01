# NexRouter Frontend Rules

## Changelog + version required

For every code/docs/config change in this repo, update `CHANGELOG.md` **and** bump package version in the same change set. Do this proactively; do not wait to be asked.

Minimum rule:
- User-facing behavior/UI/provider/model/icon changes → bump patch version + add changelog entry.
- README/docs/deployment wording changes → bump patch version + add changelog entry.
- Internal scripts/config changes → bump patch version + add changelog entry.
- If `CHANGELOG.md` has a new top version, `package.json` and `package-lock.json` must match that exact version.
- Patch-only policy by default: `0.5.37` → `0.5.38` → `0.5.39`.

Recommended command:
```bash
npm version patch --no-git-tag-version
```
Then edit `CHANGELOG.md` top entry to the same version and today’s date.

Use concise sections: `Features`, `Fixes`, `Improvements`, `Docs`, `Chore`, `Cleanup`.

Before commit/push:
```bash
grep -n '"version"' package.json package-lock.json | head
head -20 CHANGELOG.md
```
Verify versions match.

## Public repo safety

Do not expose private deployment details, secrets, DB paths, private tokens, or VPS internals in public docs.
