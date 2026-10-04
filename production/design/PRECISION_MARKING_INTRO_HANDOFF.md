# BANANA.EXE — Precision Marking Intro Handoff

**Status:** DESIGN REVIEW IN PROGRESS  
**Production:** AN RTJ PRODUCTION

This handoff is for Claude Design / Claude Code implementation of the BANANA.EXE precision-marking intro.

## Governing documents

Read before implementation:

1. `/product.md`
2. `/production/CANON_REGISTRY.md`
3. `/production/VISUAL_LANGUAGE.md`
4. this file

If any scene-specific implementation conflicts with those authorities, stop and reconcile before coding.

## Locked source authority

The approved source assets are committed on `main` under:

```text
assets/part2/precision/source/
```

Required source files:

```text
assets/part2/precision/source/BANANA_EXE_TITLE_LOCKED.png
assets/part2/precision/source/PRECISION_BANANA_BASE_LOCKED.png
assets/part2/precision/source/PRECISION_BANANA_MARKED_LOCKED.png
assets/part2/precision/source/PRECISION_LASER_HEAD_LOCKED.png
assets/part2/precision/source/PRECISION_MARKING_COMPOSITION_LOCKED.jpg
```

These source PNG/JPG files are production authority. Do not overwrite, delete, repaint, or replace them while creating runtime derivatives.

## Runtime asset workflow

Claude may create optimized WebP derivatives in:

```text
assets/part2/precision/
```

Recommended runtime names:

```text
assets/part2/precision/banana_exe_title.webp
assets/part2/precision/precision_banana_base.webp
assets/part2/precision/precision_banana_marked.webp
assets/part2/precision/precision_laser_head.webp
```

Runtime WebPs are derivatives only. The locked source files remain the visual authority.

## Asset roles

`BANANA_EXE_TITLE_LOCKED.png`
- exact reusable title treatment;
- do not redraw or restyle;
- yellow/gold faces, cyan/aqua period, dark blue dimensional shadow/extrusion.

`PRECISION_BANANA_BASE_LOCKED.png`
- clean unmarked banana base;
- used for arrival / pre-marking state.

`PRECISION_BANANA_MARKED_LOCKED.png`
- approved completed state;
- contains the small `RTJ Productions` etch near the banana's right tip;
- use as the end-state authority for placement, size and treatment of the etch.

`PRECISION_LASER_HEAD_LOCKED.png`
- compact technical laser-head asset/reference;
- beam itself should be generated live so position/timing can animate.

`PRECISION_MARKING_COMPOSITION_LOCKED.jpg`
- overall composition target for title, banana, laser relationship and mark placement;
- its visible grid intensity is **not** authority;
- do not use it as a flattened gameplay scene.

## Locked composition

Preserve:

- dark navy / blue-black environment;
- extremely subtle Part 2-style grid structure only;
- localized system glow uses the cyan/aqua BANANA.EXE period color (guide `#97EEEA` / RGB 151, 238, 234);
- large centered BANANA.EXE title using the locked title treatment;
- banana lies flat in the processing environment;
- compact technical laser head descends from above near the banana's right tip;
- laser event is red;
- small localized heat/smoke wisp is permitted at contact;
- completed etched wording is `RTJ Productions`, small and near the right tip;
- no outer UI frame;
- no redundant top-right banana icon;
- no duplicate lower-corner production credit.

The accidental title/banana 'face' read may survive naturally but must not be forced by reshaping the banana.

## Grid hierarchy — corrected direction

The grid is **not** the star of this scene.

The precision intro must inherit established Part 2 hierarchy:

- dark navy / blue-black is the dominant field;
- visible grid geometry is quiet environmental structure;
- grid lines should be thin, low-opacity and low-contrast;
- no bright perspective horizon;
- no full-frame luminous "Tron floor";
- cyan/aqua energy should be concentrated as localized glow around/beneath the active processing area;
- localized glow may be substantially more visible than the grid lines;
- the grid may become slightly more legible during system wake or banana arrival, then settle back;
- after banana arrival, avoid obvious grid-wide pulsing.

**Hierarchy test:** if the grid is noticed before the banana, BANANA.EXE title, or active laser event, it is too strong.

The **light performs; the grid does not**.

## Build live, do not bake

Implement live where practical:

- subtle full-frame Part 2-style grid texture;
- localized cyan/aqua system glow beneath/around the processing area;
- red laser beam;
- laser contact glow;
- light localized smoke/heat wisp;
- acquisition/registration graphics if used;
- progressive reveal from clean banana to marked banana;
- camera/presentation timing.

The marked banana asset exists specifically so Claude does not need to guess the final etch placement or redraw it from scratch.

## Intro motion

1. **SYSTEM WAKE** — dark field remains dominant; localized cyan/aqua energy begins to wake. The grid may become faintly legible as a secondary consequence, but it does not perform a hero pulse sequence.
2. **BANANA ARRIVAL** — clean banana lands/settles flat in the processing environment.
3. **ACTIVE STATE** — localized cyan/aqua glow strengthens around/beneath the banana and then stabilizes; the grid returns to a restrained resting level.
4. **ACQUIRE / TARGET** — restrained registration may identify the working area.
5. **LASER POSITION** — laser head moves to the right-side marking area.
6. **MARK** — red laser progressively reveals the marked state near the right tip.
7. **FINISH** — laser stops; tiny localized smoke/heat wisp may remain briefly.
8. **REVEAL / HOLD** — final marked banana and centered title resolve clearly.

Exact timing remains open until implemented and reviewed. Do not compress the sequence to the point that the player cannot encode the action/consequence.

## Marking implementation

- etched wording: **RTJ Productions**;
- small, subtle, caramel/brown result;
- position close to the banana's right tip;
- follow the banana surface/curve;
- laser/contact point must spatially correspond to the mark being created;
- no heavy smoke, black char, flame or large spark shower;
- completed mark should look precision-marked rather than scorched.

## Color contract

- resting environment: dark navy / blue-black;
- system accent/glow: BANANA.EXE period cyan/aqua (`#97EEEA` guide);
- visible grid geometry: same cyan family but much weaker than localized system glow;
- title letters: locked warm yellow/gold;
- title period: locked cyan/aqua;
- laser/action energy: red;
- completed etch: caramel/brown.

Red remains an action color, not a static brand color.

## Implementation anti-drift

Do not:

- redesign BANANA.EXE title;
- make grid a hero element;
- create a bright full-frame perspective floor;
- build a luminous horizon band;
- thicken grid lines to make the processing state more obvious;
- use grid-wide pulsing as the primary wake effect;
- revert system cyan to saturated generic electric blue;
- make grid warm gold/yellow;
- add outer HUD frame/corner decorations;
- add a redundant banana icon;
- move the title into the lower-left;
- add duplicate RTJ production credit outside the banana without explicit direction;
- substitute unrelated banana art for the supplied source assets;
- make the laser head toy-like or oversized;
- turn light heat wisp into obvious burning;
- overwrite or delete anything in `assets/part2/precision/source/`.

## Player banana choice

This intro is a presentation/processing sequence. Do not silently alter existing downstream player-choice authority. Part 2 projectile behavior still uses existing `BX.getChoice()` logic unless a later explicit decision changes how this intro connects to the chosen banana.

## Current transition constraint

The clean and marked banana source renders are not geometrically identical. Do not full-crossfade the entire banana if that causes visible shape morphing.

Current design solution under review:

- use the marked banana as the stable base;
- cover only the etch area with a clean-peel patch derived from the clean banana;
- remove that patch progressively behind the laser/contact path;
- verify the patch seam again after runtime WebP conversion.

## Claude Code deliverable

Do not begin production implementation until the current Claude Design pass is approved.

When approved, implement the intro as a self-contained sequence that:

- reads from the locked source authority and creates optimized runtime derivatives where useful;
- creates subtle grid texture plus localized system glow, laser and marking effects live;
- preserves current production authority;
- exposes timings/constants clearly for review;
- does not modify locked launcher assets 04–08;
- does not refactor unrelated Part 2 behavior during this pass.

Before implementation, verify all five locked source files exist at the exact `source/` paths above. If any are missing, stop rather than substituting invented assets.
