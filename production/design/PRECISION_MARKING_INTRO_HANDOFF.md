# BANANA.EXE — Precision Marking Intro Handoff

**Status:** DESIGN REFINEMENT — MARK WORDING CHANGED / NOT CODE READY  
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

## Important source-asset supersession

`PRECISION_BANANA_MARKED_LOCKED.png` contains the old baked wording `RTJ Productions`.

That wording is **superseded**.

The file remains useful for:

- approved banana geometry/rendering;
- final banana proportions;
- general caramel/brown etched-mark treatment;
- overall right-tip marking zone.

Do **not** use its old text as the final mark and do not reveal that baked wording during the new writing animation.

The current final etched wording is:

**`Respect The Juice`**

The new mark should be built as its own controlled layer/path or other design-approved treatment while preserving the approved banana geometry.

## Asset roles

`BANANA_EXE_TITLE_LOCKED.png`
- exact reusable title treatment;
- do not redraw or restyle;
- yellow/gold faces, cyan/aqua period, dark blue dimensional shadow/extrusion.

`PRECISION_BANANA_BASE_LOCKED.png`
- clean unmarked banana base/reference.

`PRECISION_BANANA_MARKED_LOCKED.png`
- banana geometry/rendering and etched-treatment reference only;
- old wording is superseded.

`PRECISION_LASER_HEAD_LOCKED.png`
- compact technical laser-head asset/reference;
- beam itself should be generated live so position/timing can animate.

`PRECISION_MARKING_COMPOSITION_LOCKED.jpg`
- overall composition target for title, banana, laser relationship and general marking zone;
- its visible grid intensity and old mark wording are not authority;
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
- completed etched wording is `Respect The Juice`, small and near the right tip;
- no outer UI frame;
- no redundant top-right banana icon;
- no duplicate lower-corner production credit.

The accidental title/banana 'face' read may survive naturally but must not be forced by reshaping the banana.

## Grid hierarchy — locked corrected direction

The grid is **not** the star of this scene.

The precision intro inherits established Part 2 hierarchy:

- dark navy / blue-black is the dominant field;
- visible grid geometry is quiet environmental structure;
- grid lines are thin, low-opacity and low-contrast;
- no bright perspective horizon;
- no full-frame luminous "Tron floor";
- cyan/aqua energy is concentrated as localized glow around/beneath the active processing area;
- localized glow is substantially more visible than the grid lines;
- the grid may become slightly more legible during system wake or banana arrival, then settle back;
- after banana arrival, avoid obvious grid-wide pulsing.

Approved design target:

- grid 5% at rest;
- grid rises to approximately 9% during wake/landing, then settles back;
- no grid bloom, horizon band, haze, waves or pulses;
- localized cyan pool carries the active-system light behavior;
- localized cyan reduces during marking so the red laser remains the strongest active color.

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
- `Respect The Juice` mark and its progressive glyph-by-glyph reveal;
- camera/presentation timing.

## Intro motion

1. **SYSTEM WAKE** — dark field remains dominant; localized cyan/aqua energy begins to wake. The grid becomes faintly more legible only as a secondary consequence.
2. **BANANA ARRIVAL** — clean banana lands/settles flat in the processing environment.
3. **ACTIVE STATE** — localized cyan/aqua glow strengthens around/beneath the banana and then stabilizes; the grid returns to a restrained resting level.
4. **ACQUIRE / TARGET** — restrained registration identifies the working area.
5. **LASER POSITION** — laser head moves to the right-side marking area.
6. **MARK** — red laser visibly engraves `Respect The Juice` word by word and glyph by glyph.
7. **FINISH** — laser stops; tiny localized smoke/heat wisp may remain briefly; head retracts from the final composition.
8. **REVEAL / HOLD** — final marked banana and centered title resolve clearly.

Overall timing may extend slightly if required for legible writing. Preserve the approved event order and readable holds rather than forcing the old 13.55 s total.

## Marking choreography — CURRENT DESIGN TASK

The mark must read as the laser physically **writing / engraving** the phrase, not as a continuous linear mask reveal.

Word sequence:

1. **Respect**
2. brief visual disengage / reposition
3. **The**
4. brief visual disengage / reposition
5. **Juice**

Requirements:

- follow believable glyph/stroke structure;
- completed strokes remain behind as caramel/brown etch;
- use tiny natural breaks between letters where useful;
- do not drag the active contact continuously through blank spaces;
- do not let the contact outrun the visible etched stroke;
- word gaps must read as intentional repositioning, not as accidental holes in a continuous sweep;
- preserve the mark near the banana's right tip and follow the peel/curve;
- rebalance text size/spacing only as much as needed for `Respect The Juice` to fit cleanly and remain subtle.

## Sound choreography — CURRENT LOCKED INTENT

Audio must reinforce the physical writing action.

During `MARK`:

1. etch sound ON while `Respect` is actively engraved;
2. etch sound OFF during reposition to `The`;
3. etch sound ON while `The` is actively engraved;
4. etch sound OFF during reposition to `Juice`;
5. etch sound ON while `Juice` is actively engraved;
6. etch sound stops cleanly on the final glyph;
7. after finish/reveal resolves, play one short completion / move-on cue.

Small letter-to-letter microbreaks in the etch layer are acceptable if they strengthen the sense of actual writing.

Sound character:

- precision tool / laser-marking / engraving texture rather than arcade zap;
- controlled, tight, slightly mechanical/electrical;
- restrained high-frequency engraving/sizzle component is acceptable;
- do not sound like welding, fire, alarm, or a continuous sci-fi beam;
- there is no requirement for a constant beam tone;
- silence during word repositioning is part of the choreography.

Completion cue:

- short;
- clean;
- confident;
- means **process complete → continue**;
- not a victory fanfare.

Prototype audio is not yet verified. Do not claim audio is implemented merely because the spec contains cue timing.

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
- add duplicate production credit outside the banana without explicit direction;
- substitute unrelated banana art for the supplied source assets;
- make the laser head toy-like or oversized;
- turn light heat wisp into obvious burning;
- reveal the superseded `RTJ Productions` wording;
- treat the new phrase as one continuous horizontal wipe;
- run the etching sound continuously through word gaps;
- overwrite or delete anything in `assets/part2/precision/source/`.

## Player banana choice

This intro is a presentation/processing sequence. Do not silently alter existing downstream player-choice authority. Part 2 projectile behavior still uses existing `BX.getChoice()` logic unless a later explicit decision changes how this intro connects to the chosen banana.

## Deferred RTJ drink-pouring ident — FUTURE ONLY

A previously created Respect The Juice drink-pouring ident has been uploaded/reintroduced for consideration.

Possible future BANANA.EXE uses include:

- a production bumper;
- a scene/chapter transition;
- a later banana-specific ident variant;
- peel banana → blender → banana smoothie → RTJ ident.

This is a **future branch of work**, not part of the current precision-intro refinement.

For the current pass:

- do not insert the ident;
- do not redesign it;
- do not add banana peeling;
- do not add blending;
- do not add smoothie pouring;
- do not lengthen the intro to accommodate it;
- do not let the uploaded ident change current scope.

Preserve the idea for a later update once the current BANANA.EXE flow is stable.

## Claude Design deliverable — NEXT

Do not move to Claude Code yet.

Claude Design should now:

- replace `RTJ Productions` with `Respect The Juice`;
- prototype actual glyph/stroke writing behavior;
- show readable word pauses/repositions;
- update the final marked state without changing the locked banana geometry;
- update storyboard/spec/sound boundaries accordingly;
- report revised marking duration and overall intro duration;
- identify whether any new runtime mark layer/asset is needed.

Only after this pass is visually approved should the handoff move to Claude Code.
