# BANANA.EXE — Precision Marking Intro Handoff

**Status:** DESIGN AUTHORITY READY / ASSET DROP REQUIRED  
**Production:** AN RTJ PRODUCTION

This handoff is for Claude Design / Claude Code implementation of the Banana.exe precision-marking intro.

## Governing documents

Read before implementation:

1. `/product.md`
2. `/production/CANON_REGISTRY.md`
3. `/production/VISUAL_LANGUAGE.md`
4. this file

If any scene-specific implementation conflicts with those authorities, stop and reconcile before coding.

## Locked composition

The precision-marking intro uses the approved composition documented in `production/VISUAL_LANGUAGE.md`:

- dark navy / blue-black environment;
- contextual working-state grid;
- grid/system glow uses the cyan/aqua BANANA.EXE period color (guide `#97EEEA` / RGB 151, 238, 234);
- large centered BANANA.EXE title using the locked title treatment;
- banana lies flat across the processing grid;
- compact technical laser head descends from above near the banana's right tip;
- laser event is red;
- small localized heat/smoke wisp is permitted at contact;
- completed etched wording is `RTJ Productions`, small and near the right tip;
- no outer UI frame;
- no redundant top-right banana icon;
- no duplicate lower-corner production credit.

The accidental title/banana 'face' read may survive naturally but must not be forced by reshaping the banana.

## Required asset drop

Place the supplied production assets at:

```text
assets/part2/precision/BANANA_EXE_TITLE_LOCKED.png
assets/part2/precision/PRECISION_BANANA_BASE_LOCKED.png
assets/part2/precision/PRECISION_LASER_HEAD_LOCKED.png
assets/part2/precision/PRECISION_MARKING_COMPOSITION_LOCKED.jpg
```

### Asset roles

`BANANA_EXE_TITLE_LOCKED.png`
- exact reusable title treatment;
- do not redraw or restyle;
- yellow/gold faces, cyan/aqua period, dark blue dimensional shadow/extrusion.

`PRECISION_BANANA_BASE_LOCKED.png`
- clean unmarked banana base;
- used for arrival / pre-marking state;
- do not bake the final RTJ Productions text into the base.

`PRECISION_LASER_HEAD_LOCKED.png`
- compact technical laser-head reference/asset;
- beam itself should be generated live so position/timing can animate.

`PRECISION_MARKING_COMPOSITION_LOCKED.jpg`
- composition target only;
- match layout/proportion/hierarchy rather than using it as a flattened gameplay scene.

## Build live, do not bake

The following should be implemented as code/SVG/CSS/DOM effects rather than permanent baked images where practical:

- perspective cyan/aqua grid;
- grid pulse / steady-active state;
- red laser beam;
- laser contact glow;
- light localized smoke/heat wisp;
- acquisition/registration graphics if used;
- progressive reveal of `RTJ Productions`;
- camera/presentation timing.

## Intro motion

Current motion logic:

1. **GRID WAKE** — working-state grid appears/pulses. Rhythm direction: `pulse → pulse → pulse pulse pulse → steady pulse`.
2. **BANANA ARRIVAL** — banana lands/settles flat on the grid.
3. **ACTIVE GRID** — impact resolves the pulsing into a stable energized cyan/aqua glow.
4. **ACQUIRE / TARGET** — restrained registration may identify the working area.
5. **LASER POSITION** — laser head moves to the right-side marking area.
6. **MARK** — red laser progressively reveals `RTJ Productions` near the right tip.
7. **FINISH** — laser stops; tiny localized smoke/heat wisp may remain briefly.
8. **REVEAL / HOLD** — final composition resolves clearly enough to read the title and production mark.

Exact timing remains open until implemented and reviewed. Do not compress the sequence to the point that the player cannot encode the action/consequence.

## Marking implementation

- etched wording: **RTJ Productions**;
- small, subtle, caramel/brown result;
- position close to the banana's right tip;
- follow the banana surface/curve;
- the laser/contact point must spatially correspond to the mark being created;
- do not place the laser centrally while the mark sits at the tip;
- no heavy smoke, black char, flame or large spark shower;
- the completed mark should look precision-marked rather than scorched.

## Color contract

- resting environment: dark navy / blue-black;
- system/grid energized glow: BANANA.EXE period cyan/aqua (`#97EEEA` guide);
- title letters: existing locked warm yellow/gold;
- title period: locked cyan/aqua;
- laser/action energy: red;
- completed etch: caramel/brown.

Red remains an action color, not a static brand color.

## Implementation anti-drift

Do not:

- redesign BANANA.EXE title;
- revert grid to saturated generic electric blue;
- make grid warm gold/yellow;
- add outer HUD frame/corner decorations;
- add a redundant banana icon;
- move the title into the lower-left;
- add duplicate RTJ production credit outside the banana without explicit direction;
- substitute a photoreal banana or a flat vector sticker banana for the supplied base;
- make the laser head toy-like or oversized;
- turn light heat wisp into obvious burning.

## Player banana choice

This intro is a presentation/processing sequence. Do not silently alter existing downstream player-choice authority. Part 2 projectile behavior still uses existing `BX.getChoice()` logic unless a later explicit decision changes how this intro connects to the chosen banana.

## Claude Code deliverable

Implement the intro as a self-contained sequence that:

- uses the supplied locked assets;
- creates the animated grid/laser/marking effects live;
- preserves current production authority;
- exposes timings/constants clearly for review;
- does not modify locked launcher assets 04–08;
- does not refactor unrelated Part 2 behavior during this pass.

Before implementation, verify the four required asset files exist at the paths above. If any are missing, stop rather than substituting invented assets.
