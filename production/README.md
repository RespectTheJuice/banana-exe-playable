# BANANA.EXE — Production System

Status: ACTIVE WORKFLOW

BANANA.EXE is **an RTJ production**.

This folder contains subordinate production authority for the product master in `/product.md`.

## Document hierarchy

Use this order when deciding what controls a production decision:

1. `/product.md` — product-level master, current status, major open/locked decisions.
2. `/production/CANON_REGISTRY.md` — locked identity, asset and anti-drift authority.
3. This file — workflow and map of the production system.
4. Scene/system documents under `/production/` — detailed working specifications and checkpoints.

Scene/system documents add detail. They should not silently override product-level truth or locked canon.

If two current documents contradict each other:

- stop;
- identify which decision is newer and intended to supersede the other;
- update the documents;
- then continue production.

## Production operating loop

BANANA.EXE follows:

**DECIDE → RECORD → BRIEF → CREATE → REVIEW → LOCK → IMPLEMENT**

### DECIDE
Agree what changed, what remains open, and what is actually being attempted next.

### RECORD
Write the decision into the appropriate production document before new asset generation or implementation.

### BRIEF
Assemble the exact working set for the next Claude Design / Claude Code pass:

- current master status;
- locked canon relevant to the scene;
- scene/system specification;
- approved asset filenames;
- visual references;
- open questions;
- explicit forbidden drift.

### CREATE
Create only the assets or design work required by the next dependency.

### REVIEW
Review the result against the brief and references, not against memory alone.

### LOCK
When Valenté explicitly approves an exact asset or production decision, record its lock status and filename.

### IMPLEMENT
Only then hand the locked assets/specification to Claude Code.

## Gate before work starts

Before beginning any new production pass, answer these questions:

1. What document currently controls this work?
2. Has the latest conversation decision been recorded?
3. What is LOCKED / REUSE?
4. What is OPEN / MAY DESIGN?
5. What exact files/references should Claude work from?
6. What is forbidden to invent or redesign?
7. Is this a design pass, asset-creation pass, or implementation pass?

If #2 is no, update the documentation first.

This is not intended to make Valenté manually police every handoff. It is a production habit the system should reinforce automatically whenever a decision changes the work.

## Working-document roles

### Product master
`/product.md`

Use for:

- product premise;
- RTJ production identity;
- current major locks;
- major open status such as Part 1 pacing;
- cross-scene systems such as Banana Boutique precision marking;
- global continuity decisions.

### Canon registry
`/production/CANON_REGISTRY.md`

Use for:

- locked character identities;
- locked location/building authority;
- locked brand identities;
- approved asset names;
- anti-drift rules;
- explicit reuse requirements.

### Scene/system specs
Examples:

- `PART2_TRANSITION_ASSET_CHECKPOINT.md`
- `design/BANANA_PART2_ATTEMPT01_DESIGN_DECISIONS.md`
- `design/BANANA_BOUTIQUE_PRECISION_MARKING_DIRECTION.md`

Use for detailed scene or system behavior.

### Handoff briefs
Files under `/production/briefs/` are temporary/current work packages for Claude Design or Claude Code.

They should tell the recipient exactly what to retrieve, what is locked, what is open, what to make, and what not to change.

A handoff brief is not permanent product truth. Once its decisions are accepted or superseded, the durable result should be reflected in the relevant master/canon/scene document.

## Current production cautions

- Part 1 pacing is not locked.
- Do not assume an existing implemented timing is approved just because the scene exists.
- Do not redraw locked Part 2 launcher assets to support a new downstream idea.
- New generated art is a candidate until Valenté approves the exact file.
- Before Claude Code implementation, resolve any asset explicitly marked as a blocker.
