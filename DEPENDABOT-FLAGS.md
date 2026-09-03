# Dependabot Flags

Alerts that cannot be patched automatically, with rationale documented here for
review.

---

## #236 — postcss-selector-parser (low) — DoS via AST recursion

| Field   | Value |
|---------|-------|
| Advisory | [GHSA-3q44-6jc3-7whr](https://github.com/advisories/GHSA-3q44-6jc3-7whr) |
| Package | `postcss-selector-parser` |
| Current version | 6.1.4 |
| Fixed in | 7.x (breaking major release) |
| Severity | Low |
| Dependency chain | `view/` → `tailwindcss@3.4.17` → `postcss-selector-parser@^6.1.2` |

### Why it cannot be patched now

The fix for this DoS (unbounded AST recursion on a crafted CSS selector string)
was introduced in `postcss-selector-parser@7.0.0`, which is a major breaking
release.  `tailwindcss@3.x` pins its dependency to `^6.1.2` and is incompatible
with 7.x.  A safe upgrade requires migrating to **Tailwind CSS v4**, which
contains its own CSS parsing engine and removes the `postcss-selector-parser`
dependency entirely.

### Risk assessment

- **Exploitability**: The vulnerable code runs at **build time only** — it
  processes CSS selector strings during `vite build` / `vite dev`.  It is
  not shipped in the production bundle and is not reachable by end-users at
  runtime.
- **Attack surface**: An attacker would need to inject a crafted CSS selector
  into source files checked into this repository — effectively requiring write
  access to the codebase.
- **Classification**: Dev/build toolchain dependency; no production exposure.

### Resolution path

Blocked on [Tailwind CSS v4 migration](https://tailwindcss.com/docs/upgrade-guide).
Track progress in a dedicated issue; re-evaluate this flag once the migration
is complete.

---

## Already resolved

| Alert | Package | Fixed version | Resolution |
|-------|---------|---------------|------------|
| #239 | `browserslist` (GHSA-7c5q-3px8-5hpq) | 4.28.8 | `npm audit fix` — commit `92d7d50` |
| #238 | `@humanfs/node` (symlink traversal) | 0.16.8 | `npm audit fix` — commit `92d7d50` |
