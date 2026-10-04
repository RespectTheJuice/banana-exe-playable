# BANANA.EXE — Product

**An RTJ Production**

Status: ACTIVE PRODUCT MASTER

Purpose: hold the current product-level truth for BANANA.EXE: what the product is, what is locked, what is still open, and the major systems that scene-level production documents must inherit.

Document hierarchy:

1. `product.md` — product-level master and current status.
2. `production/CANON_REGISTRY.md` — locked identity, asset and anti-drift authority.
3. `production/VISUAL_LANGUAGE.md` — active visual-language authority.
4. `production/README.md` — production workflow and document map.
5. scene/system documents under `production/` — subordinate working specifications and checkpoints.

A more specific current scene/system document may add detail, but it must not silently contradict this product master, the canon registry, or the visual-language authority. If authority is genuinely contradictory, stop and reconcile the documents before producing new work.

## Production identity

BANANA.EXE is an **RTJ production**.

Preferred outward-facing credit language:

**AN RTJ PRODUCTION**

For the precision-marking intro specifically, the production credit is integrated into the banana itself as a small etched **`RTJ Productions`** mark near the right tip. Do not add a duplicate lower-corner production credit unless explicitly approved later.

## Product premise

BANANA.EXE is a humorous, cinematic browser game built around a Head Geek application challenge. The tone should remain funny, premium, world-built and deliberate rather than random or cheap.

The game treats absurd ideas with serious production logic. Comedy should come from the commitment and engineering, not from making the world itself sloppy.

## Production operating rule

BANANA.EXE production follows:

**DECIDE → RECORD → BRIEF → CREATE → REVIEW → LOCK → IMPLEMENT**

Do not jump from a conversational decision directly into asset generation or implementation when the production record has not been updated.

Before a new asset/design/code pass:

1. decide what changed;
2. record the decision in the appropriate production document;
3. identify the exact working references Claude/design/code should use;
4. create only the next required assets;
5. review them;
6. lock approved assets/decisions;
7. only then implement.

This is a production safeguard, not a requirement that Valenté personally remember every documentation step. The workflow exists so either the producer or the tools can check the gate before moving forward.

## Part 1 status

Part 1 **overall pacing is not locked**.

Story beats, content direction and major sequence intent may be approved, but timing, holds, readability and comprehension remain open because some sections still move too quickly.

Do not treat existing Part 1 timings as final authority merely because the scene content exists.

Part 1 is also **not grid-led by default**. Its dominant activities include browsing, shopping, choosing, traveling and world/location presentation, so retail, map, travel and scene-specific world language should lead where appropriate.

The grid may appear in Part 1 when a scene genuinely enters a working, system, calibration or processing state, but it should not be forced into shopping/travel scenes simply for consistency.

## Grid usage rule

The grid is a **contextual visual language**, not the universal background of BANANA.EXE and not a hero element.

Use grid language when BANANA.EXE is in a:

- working state;
- processing state;
- calibration state;
- systems/technical state;
- problem-solving/analysis state;
- powered interaction where the grid helps communicate mechanism.

Part 2 uses grid language more often because it is more heavily about delivery mechanics, analysis, launcher operation, failure, system behavior and technical attempts. Even there, the established hierarchy is subtle: grid geometry is quiet structure while brighter cyan energy belongs around active systems, controls, routes and events.

The precision-marking intro may use the same subtle grid language because the banana is being processed, but the processing state must be communicated primarily through localized system light and the laser event rather than making the grid visually dominant.

Do not interpret this as “BANANA.EXE = grid everywhere.”

## Current Part 2 authority

The launcher / interruption / Leicester failure sequence is currently locked as follows:

- uninterrupted hold to 100% → normal launch → Leicester failure;
- one early release → first interruption reaction;
- two early releases → second interruption reaction;
- three early releases → third interruption shake → accidental WHUMP launch;
- both paths still fail in Leicester;
- then continue through forest canopy → rustling leaves → thud → fox appears with banana in mouth → fox looks left → fox looks right → fox disappears → failed attempt → carry-forward pose.

Approved current production assets:

- `07_third_interruption_shake_LOCKED.png`
- `08_determined_transition_goggles_TRANSPARENT_LOCKED.png`

Registration rules:

- 07 is registered against 04 and does not need a transform;
- 05 and 06 use `translate(-4px, 12px)`;
- 08 is transparent and does not need the retired black-card workaround.

Implementation authority:

- production repo: `RespectTheJuice/banana-exe-playable`;
- `attempt01.js` exists;
- approved Part 2 assets belong in `assets/part2/`;
- the projectile must use the player's selected banana via the existing `BX.getChoice()` logic;
- do not hard-code a projectile cropped from the launcher.

Locked launcher art should not be casually redesigned to support downstream ideas.

## Precision-marking intro

### Status

Concept: **LOCKED**.  
Visual direction: **LOCKED EXCEPT CURRENT GRID/WAKE REFINEMENT**.  
Source asset set: **LOCKED ON MAIN**.  
Motion/timing: **CLAUDE DESIGN REVIEW IN PROGRESS**.  
Production implementation: **NOT YET STARTED**.

Detailed authority lives in:

- `production/VISUAL_LANGUAGE.md`
- `production/design/PRECISION_MARKING_INTRO_HANDOFF.md`

### Locked visual direction

Preserve:

- dark navy / blue-black environment as the dominant field;
- only extremely subtle Part 2-style grid structure, if visible;
- localized cyan/aqua system glow derived from the cyan/aqua period in the BANANA.EXE title, guide `#97EEEA` / RGB 151, 238, 234;
- large centered `BANANA.EXE` title using the locked title asset;
- banana lying flat in the processing environment;
- stylized/CGI middle-ground banana treatment: neither flat-cartoon nor photoreal fruit photography;
- compact technical laser head descending from above near the banana's right tip;
- red laser/action energy;
- small localized heat/smoke wisp only;
- completed etched wording **`RTJ Productions`**, small and close to the right tip;
- caramel/brown completed etch;
- no outer HUD/UI frame;
- no redundant banana icon;
- no duplicate lower-corner production credit.

The incidental visual read where the centered BANANA.EXE title can feel like sunglasses/eyes and the banana curve like a smile is a bonus only. Do not distort the banana to force that face.

### Grid hierarchy correction

Earlier precision-intro direction overstated the grid by treating it as an active glowing processing-floor feature. That is no longer authority.

The corrected rule is:

- the grid is subordinate environmental structure;
- dark navy / blue-black remains visually dominant;
- visible grid lines stay thin, low-opacity and quiet;
- no bright perspective horizon or full-frame luminous floor;
- localized cyan/aqua glow carries the system wake/active-state behavior;
- the grid may become only slightly more legible during wake/arrival and then settle back;
- if the grid is noticed before the banana, title or active laser event, it is too strong;
- **the light performs; the grid does not**.

### Locked source assets

Source authority lives in:

`assets/part2/precision/source/`

Required locked files:

- `BANANA_EXE_TITLE_LOCKED.png`
- `PRECISION_BANANA_BASE_LOCKED.png`
- `PRECISION_BANANA_MARKED_LOCKED.png`
- `PRECISION_LASER_HEAD_LOCKED.png`
- `PRECISION_MARKING_COMPOSITION_LOCKED.jpg`

These source files must not be overwritten or deleted. Claude Code may later create optimized runtime WebP derivatives in `assets/part2/precision/`.

The composition JPG remains authority for title/banana/laser relationship and mark placement, but its visible grid intensity is **not** authority.

### Motion direction under review

Current sequence logic:

1. **SYSTEM WAKE** — dark field remains dominant; localized cyan/aqua energy wakes beneath/around the processing area; grid becomes only faintly more legible as a secondary consequence.
2. **BANANA ARRIVAL** — clean banana lands/settles flat in the processing environment.
3. **ACTIVE STATE** — localized cyan/aqua glow strengthens around/beneath the banana, then stabilizes; grid remains restrained.
4. **ACQUIRE / TARGET** — restrained registration only if useful.
5. **LASER POSITION** — laser head moves to the right-side marking area.
6. **MARK** — red laser progressively reveals `RTJ Productions` near the right tip.
7. **FINISH** — beam stops and a tiny localized heat/smoke wisp may remain briefly.
8. **REVEAL / HOLD** — final marked banana and centered title resolve clearly.

Exact timing, title-opacity behavior during the process, laser-head retraction, any design-only mounting column, camera push, tap-to-skip and sound remain review decisions until the current Claude Design pass is approved.

### Transition constraint

The clean and marked banana source renders are not geometrically identical. Do not full-crossfade the entire banana if that causes visible shape morphing. The current Claude Design solution uses the marked banana as the base and a clean-peel patch over the etch area, then removes that patch behind the laser. This method is under visual review and must be tested again after runtime WebP conversion.

## Precision-marking explainer / content extension

The precision-marking idea also creates a natural explainer-video question:

> **“So how do we use a laser to brand our bananas and not cook them?”**

This is genuine engineering curiosity inside the BANANA.EXE world, not just marketing copy.

Useful explanatory variables:

- beam intensity / power;
- dwell time;
- scan speed;
- focus / spot size;
- depth of the surface effect;
- total energy delivered to the peel/surface.

The communication principle is:

**CONTROL THE DOSE.**

Do not publish exact wattage, speed or hardware settings as if proven until the real process has actually been tested on appropriate equipment.

Possible public hook/title:

**How do you laser-brand a banana without cooking it?**

Possible internal concept title:

**BANANA.EXE: PRECISION MARKING TEST**

## Continuity rule

The precision-marking intro is a separate production element.

It must not be used as an excuse to redraw or silently alter locked Part 2 launcher assets.

If visible banana marking is later carried through gameplay, that must be handled as an explicit downstream implementation decision while preserving player banana choice and existing scene authority.
