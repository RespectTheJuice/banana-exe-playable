# Banana.exe / RTJ public release gate

Status: **STAGED FOR REVIEW — NOT AN APPROVED GAME RELEASE** (7 November 2026).

This document records the change requested: make the existing public playable repository deployable as a **Respect The Juice** game. The original private production repository remains private and should not be used as the public website source.

## Non-negotiable preservation

- Preserve **AN RTJ PRODUCTION** / Respect The Juice identity. No invented second ident or duplicated corner credit.
- Preserve approved character, banana, storefront, map, palette and other locked assets; do not redraw or reinterpret them to make the release look finished.
- The product master says **Part 1 overall pacing is not locked**. Do not change that status by merging a deployment workflow.
- Original production loop remains **DECIDE → RECORD → BRIEF → CREATE → REVIEW → LOCK → IMPLEMENT**.
- Do not add unreviewed Scene 02 or Part 02 modifications as a release shortcut.

## Technical deployment change

- Add a GitHub Actions Pages workflow to publish only the game runtime: HTML, CSS, JavaScript and assets.
- Keep `production/`, `product.md`, internal working documentation and unused files out of the **Pages website artifact**. Note that the repository is itself already public, so this does not hide source files from GitHub visitors.
- Preserve the current game implementation; this PR changes hosting preparation only, not gameplay or art.
- A final Pages URL is **not confirmed** until deployment finishes and is tested.

## Review before treating this as a portfolio release

1. Check desktop and touch start→finish paths on the exact deployed build.
2. Confirm correct script/image/audio loading with no 404s.
3. Review Part 1 pacing and labels against the current product master.
4. Check accurate credits, permissions/licences of included assets, and whether any Time For You references or private details need approval for public promotion.
5. Check accessible keyboard/touch actions and small-screen layout.
6. Approve public-facing status: **work-in-progress playable preview** or **finished release**. Don't silently call it finished.
7. Only after review, add the public play link to the RTJ/portfolio channel of choice.

## Enablement note

This workflow is prepared for GitHub Pages using GitHub Actions as its source. If the repository's Pages settings are not enabled, the first workflow run may require an administrator to enable Pages in repository settings. No site URL should be announced without verification.
