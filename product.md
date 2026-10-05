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

For the precision-marking intro specifically, the production identity is integrated into the banana itself as a small etched **`Respect The Juice`** mark near the right tip. This supersedes the earlier `RTJ Productions` wording. Do not add a duplicate lower-corner production credit unless explicitly approved later.

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

## Current Part 2 flow

This is the current product-level sequence. Detailed staging authority lives in:

- `production/PART2_TRANSITION_ASSET_CHECKPOINT.md`
- `production/PART2_ACTING_STAGING_BRIEF.md`
- `production/design/BANANA_PART2_ATTEMPT01_DESIGN_DECISIONS.md`

### A. Delivery-method transition

1. End on the three delivery-method options.
2. Rapid selector cycles through all three with sound.
3. Selector looks random but deterministically slows and lands on **TREBUCHET** for this build. TREBUCHET is the only named option; the other two slots stay unlabelled (shown as unknown) until their names are decided.
4. TREBUCHET settles/bounces and receives one restrained confirmation glow pulse.
5. Cut to a compact map delivery beat.
6. The locked **Trebutech** delivery truck travels toward **HOME** (its branding communicates the rented trebuchet; no visible cargo).
7. Truck arrives at HOME; HOME receives a small arrival settle/bounce and glow pulse.
8. Show the transaction clearly:
   - **TREBUCHET RENTAL**
   - **− £15.00**
   - cash/register `ching-ching` sound.
9. Update remaining budget immediately.
10. Only then reveal the **DELIVERY PROBLEM** page.

This transition exists to answer why Valenté has a trebuchet and to make the budget consequence visible before analysis begins.

### B. Delivery Problem / comprehension gate

The problem page must not auto-advance.

1. Show `DELIVERY PROBLEM` and the carried state: payload, remaining budget, destination.
2. Player selects **SIZE UP THE PROBLEM**.
3. The second state becomes map/goal-centric and reveals the real constraints:
   - **DISTANCE**;
   - **CONDITION**;
   - **BUDGET / REMAINING BUDGET**;
   - **DELIVERY METHOD**.
4. Stop and allow the player to read.
5. Player explicitly selects **CONTINUE** before Attempt 01 begins.

The player should be able to answer: what is the task, where is it going, how far is it, what condition must it arrive in, how much money remains, and what delivery method is being attempted.

### C. Problem-page visual hierarchy

- Use compact journey naming: **HOME → TFY**.
- Put **NOTTINGHAM** and **NORTHAMPTON** on the map itself rather than repeating both inside a card.
- Keep the map frameless; do not bury it inside another heavy panel.
- On SIZE UP, HOME and TFY become more prominent and the map/goal becomes center stage.
- Valenté supports the information rather than competing with it; preferred treatment is a small circular face/avatar marker at HOME.
- Distance, condition, budget and delivery method support the map rather than replacing it.
- Important problem elements may drop into place, settle and glow once, but do not animate every label/decorative object.
- While Delivery Method is undecided, use a neutral parcel/route/transport icon rather than a trebuchet icon.
- Grid language remains quiet/subordinate.

### D. Explanatory HOME → TFY micro-animation

The problem explanation has a physical receiving target:

1. Valenté avatar sits at HOME.
2. A banana icon appears at/beside HOME.
3. Banana follows the route toward TFY.
4. A receiving basket is already visible on the roof of the TFY building.
5. Banana drops into the rooftop basket.
6. Play a short satisfying **swish**.
7. Basket/TFY gives a small receive reaction / glow pulse.
8. HOME/Valenté gives a small acknowledgement bounce/pulse.

This is a short explanatory micro-animation showing the goal. It is **not** the actual Attempt 01 result.

### E. Attempt 01 setup and launcher interaction

After CONTINUE:

1. Reveal the rented trebuchet.
2. Valenté inspects it: **“How do I use this thing?”**
3. Small shrug/acceptance beat: try it anyway.
4. Goggles on / ready.
5. Hard cut into the operator/bracing state.
6. Player's selected banana is loaded/used via existing `BX.getChoice()` authority.
7. Charge interaction:
   - uninterrupted hold to 100% → normal launch;
   - early release #1 → first interruption reaction;
   - early release #2 → one-hand shrug reaction;
   - early release #3 → Valenté loses patience, shakes launcher, malfunction, accidental **WHUMP** launch.
8. Both launch branches still miss and go to Leicester.

Do not redesign locked launcher plates or hard-code a different projectile banana.

### F. Leicester failure payoff

1. Banana descends toward Leicester.
2. Forest canopy appears below.
3. Banana disappears through trees.
4. Rustling leaves.
5. Clear **thud**.
6. Brief readable hold, approximately 2 seconds.
7. Fox appears with banana in mouth.
8. Fox looks left.
9. Fox looks right.
10. Fox disappears back into trees.
11. Show **FAILED ATTEMPT** and **RESULT: LEICESTER**.
12. Carry forward using locked determined/goggles pose rather than a long disappointed beat.

### G. Immediate asset dependency order

Do not regenerate assets that already exist as authority.

Existing location authority (original standalone renders; the old `home_canon.webp` / `tfy_canon.webp` runtime files are superseded):
- `assets/locations/S02_HOME_3D_LOCKED.png`
- `assets/locations/S02_TFY_BUILDING_LOCKED.png`

Existing launcher authority:
- locked launcher/rig assets already recorded in Part 2 production docs.

Next missing dependencies should be handled in this order:

1. TFY rooftop receiving basket overlay / basket-ready TFY treatment while preserving `assets/locations/S02_TFY_BUILDING_LOCKED.png`. The first basket file was locked prematurely and is pending a simpler map-scale replacement.
2. Trebuchet rental/delivery truck — **LOCKED**: `assets/part2/TREBUTECH_DELIVERY_TRUCK_LOCKED.png`. The truck's TREBUTECH branding communicates the delivery; no visible trebuchet cargo.
3. Neutral Delivery Method icon, preferably live SVG/CSS rather than a rendered bitmap.
4. Valenté HOME marker derived from locked Valenté identity rather than generating a replacement face.
5. Forest/canopy and fox payoff assets after the transition/problem dependencies are stable.

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
Visual hierarchy: **LOCKED**.  
Source asset set: **LOCKED ON MAIN**.  
Etched wording: **`Respect The Juice` — LOCKED DIRECTION**.  
Marking choreography/timing: **CLAUDE DESIGN REFINEMENT IN PROGRESS**.  
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
- completed etched wording **`Respect The Juice`**, small and close to the right tip;
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

`PRECISION_BANANA_MARKED_LOCKED.png` now remains authority for the approved banana geometry/rendering and the general etched-mark treatment, but its baked `RTJ Productions` text is **superseded**. It must not be used as final wording. The final mark is `Respect The Juice`.

The composition JPG remains authority for title/banana/laser relationship and mark placement, but its visible grid intensity and old mark wording are **not** authority.

### Motion direction under review

Current sequence logic:

1. **SYSTEM WAKE** — dark field remains dominant; localized cyan/aqua energy wakes beneath/around the processing area; grid becomes only faintly more legible as a secondary consequence.
2. **BANANA ARRIVAL** — clean banana lands/settles flat in the processing environment.
3. **ACTIVE STATE** — localized cyan/aqua glow strengthens around/beneath the banana, then stabilizes; grid remains restrained.
4. **ACQUIRE / TARGET** — restrained registration only if useful.
5. **LASER POSITION** — laser head moves to the right-side marking area.
6. **MARK** — laser visibly engraves `Respect The Juice`, with word-by-word writing behavior rather than a continuous linear reveal.
7. **FINISH** — beam stops and a tiny localized heat/smoke wisp may remain briefly.
8. **REVEAL / HOLD** — final marked banana and centered title resolve clearly.

The marking should read as **Respect → reposition → The → reposition → Juice**. Etching audio should run only while glyph strokes are actively being engraved and stop during word repositioning.

Exact revised marking timing, glyph paths, word-gap durations, final audio assets/mix, tap-to-skip and any remaining laser-head mount treatment remain review decisions until the Claude Design refinement is approved.

### Transition constraint

The clean and marked banana source renders are not geometrically identical. Do not full-crossfade the entire banana if that causes visible shape morphing.

Because the old marked source contains superseded wording, the final implementation must not depend on revealing that old baked text. Preserve the approved banana geometry while building the new `Respect The Juice` mark as its own controlled layer/path or approved replacement treatment.

## Deferred RTJ drink-pouring ident — FUTURE / NOT CURRENT PASS

A previously created Respect The Juice drink-pouring ident has been resurfaced as a possible BANANA.EXE production bumper. A banana-specific variant could eventually add a peel → blender → banana smoothie setup before the ident, or the ident could be used as a scene/chapter transition.

This is **deliberately deferred**. Do not insert, redesign or implement the ident in the current precision-intro pass. Do not lengthen the current intro to accommodate banana peeling, blending, smoothie pouring or an RTJ bumper.

Keep the idea available for a later production/update decision once the current BANANA.EXE flow is stable.

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
