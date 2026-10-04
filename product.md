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

For title cards, trailers, presentation boards and finished outward-facing material, the preferred credit language is:

**AN RTJ PRODUCTION**

For the Banana Boutique precision-marking shot specifically, use a restrained system signature rather than a large second title:

- `BANANA.EXE` as the primary small system tag in the lower-left area;
- `AN RTJ PRODUCTION` may sit directly beneath it in smaller neutral text, or appear as a small opposing-corner credit if composition requires;
- the RTJ credit must remain secondary to the banana and marking event.

`BANANA.EXE` uses the game’s existing **yellow** system-label language. Do not use red as a static BANANA.EXE tag in this sequence. Red is reserved for active energy/action events such as the laser.

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

The grid is a **contextual visual language**, not the universal background of BANANA.EXE.

Use grid language when BANANA.EXE is in a:

- working state;
- processing state;
- calibration state;
- systems/technical state;
- problem-solving/analysis state;
- powered interaction where the grid helps communicate mechanism.

This is why grid language fits Part 2 especially well. Part 2 is more heavily about delivery mechanics, analysis, launcher operation, failure, system behavior and technical attempts.

It is also appropriate for the Banana Boutique precision-marking intro because the banana is actively being processed.

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

## Banana Boutique — precision marking

### Status

Concept and process logic: **APPROVED DIRECTION**.

Visual treatment: **OPEN / NOT YET LOCKED**.

The first Claude Design precision-marking canvas is useful as a staging, placement, readability and implementation reference, but its realism level is not final visual authority. It reads too close to a real industrial/product-commercial treatment for the desired BANANA.EXE world.

Preserve the useful system findings while pushing the final treatment toward stylized, cinematic, premium BANANA.EXE.

### Core idea

Banana Boutique does not finish its bananas with a sticker or attached label.

The brand is applied directly to the peel through an in-world precision laser-marking process performed on an active processing grid.

Use the language **precision marked** or **laser marked** rather than **laser burned**.

The finished mark should read as a clean caramel/brown tonal change integrated into the peel/object surface rather than printed on top of it.

Avoid:

- stickers;
- printed labels;
- branding irons;
- flames;
- heavy smoke;
- scorched or damaged-looking fruit;
- cheap sci-fi spectacle;
- sterile photoreal food-tech advertising as the final aesthetic.

### Precision-marking visual system

Follow `production/VISUAL_LANGUAGE.md`.

The locked hierarchy is:

- **BLUE** = system / grid / BANANA.EXE world;
- **YELLOW** = BANANA.EXE label + banana icon family / game consistency;
- **RED** = laser event / danger-energy / active marking moment;
- **CARAMEL / BROWN** = completed precision-marking result.

Red is an **action color**, not a resting-brand color.

For this sequence:

- use a dark navy / blue-black field;
- use blue square grid lines, visibly thicker than the old thin reference lines;
- before the banana appears, the grid pulses with a powered rhythm;
- when the banana lands, the pulse resolves into a stable active blue glow;
- during marking, the laser/contact event is red;
- when marking is complete, the red action energy recedes and the completed mark remains caramel/brown;
- `BANANA.EXE` remains yellow.

### Banana representation

The precision-marking intro should use the established **stylized banana icon language**, not a photoreal banana.

Use the supplied glowing banana icon as the shape/style authority, but the precision-marking scene still needs the marking process itself.

Current direction:

- remove the crown;
- retain the simplified illustrated banana form and dark outline;
- do not render photographed/photoreal produce;
- place the banana object **lying flat on the grid plane**, like a game-world token/sprite being processed;
- camera may view the grid in perspective, but the banana must visually belong to that plane rather than standing upright as a product-display crescent;
- the precision mark is applied directly to this stylized banana object.

### Motion sequence

Current sequence direction:

1. **GRID WAKE / PULSE** — blue grid pulses into readiness.
2. **DROP** — stylized banana object lands flat on the grid plane.
3. **ACQUIRE** — active grid registers position/orientation with restrained graphics.
4. **TARGET** — intended marking area is identified.
5. **MARK** — red laser progressively creates the mark.
6. **COMPLETE** — laser disengages and temporary targeting/registration graphics clear.
7. **HERO** — completed precision-marked banana holds on the stable blue grid.

Exact total duration remains open until the revised sequence is tested.

### Mark application comparison

Current comparison remains open between:

- **A — symbol + BANANA BOUTIQUE text**;
- **B — symbol only**.

The comparison must hold every other variable constant so we can judge whether full Banana Boutique wording causes the Boutique to take too much narrative/visual focus away from BANANA.EXE.

No crown in either version.

### Corner system signature

For the precision-marking frame:

- lower-left preferred;
- `BANANA.EXE` in the game’s existing yellow;
- optional `AN RTJ PRODUCTION` directly below in smaller neutral/off-white or restrained muted tone;
- neither line should compete with the banana or marking event.

### Still-frame rule

The final frame of the animation should also function as the Banana Boutique hero still.

Do not create a visually unrelated static version.

Keep the following separable where practical:

- stylized banana object;
- finished mark;
- grid;
- registration/calibration graphics;
- red laser/contact effect;
- progressive marking effect;
- BANANA.EXE / RTJ system signature;
- final hero composition.

Any generated hero frame remains a candidate until Valenté explicitly approves the exact image.

## Precision-marking explainer / content extension

The precision-marking idea also creates a natural explainer-video question:

> **“So how do we use a laser to brand our bananas and not cook them?”**

This should be treated as genuine engineering curiosity inside the Banana Boutique world, not just marketing copy.

### Core explanation

A laser does not need to heat the whole banana in order to mark its surface.

The process is about controlling the amount of energy delivered to a very small surface area for a very short time.

The useful explanatory variables are:

- beam intensity / power;
- dwell time;
- scan speed;
- focus / spot size;
- depth of the surface effect;
- total energy delivered to the peel/surface.

The communication principle is:

**CONTROL THE DOSE.**

Do not publish exact wattage, speed or hardware settings as if they are proven until the real process has actually been tested on appropriate equipment.

### Explainer-video structure

1. **Problem** — “We want the brand on the banana itself.”
2. **Complication** — “Laser sounds great. Except lasers make heat.”
3. **Question** — “So how do we laser-brand a banana without cooking it?”
4. **Answer** — “Control the dose.”
5. **Visual explanation** — briefly show intensity, dwell time, scan speed, focus and surface-only marking.
6. **Reveal** — end on the finished precision-marked banana.

Possible public hook/title:

**How do you laser-brand a banana without cooking it?**

Possible internal concept title:

**BANANA BOUTIQUE: PRECISION MARKING TEST**

## Continuity rule

The Banana Boutique precision-marking system is a separate production element.

It must not be used as an excuse to redraw or silently alter locked Part 2 launcher assets.

If visible banana branding is later carried through gameplay, that must be handled as an explicit downstream implementation decision while preserving player banana choice and existing scene authority.
