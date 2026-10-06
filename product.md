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

## Vehicle portal system

Vehicle portals are a recurring BANANA.EXE world-system behavior.

They are **base-entry / base-exit transitions**, not destination teleportation and not generic scene transitions.

### Core rule

**Portals belong to places, not vehicles.**

A portal appears only when a vehicle crosses the boundary of its own home/origin base.

Outbound:

1. vehicle is present at its home/origin base;
2. the base portal opens at the established road/driveway/dispatch boundary;
3. the vehicle physically passes through the portal;
4. the portal closes;
5. the vehicle continues its journey normally and remains visible wherever the story requires.

Destination arrival:

- no portal opens;
- the vehicle arrives normally;
- the vehicle may remain visibly present at the destination.

Return to base:

1. the vehicle visibly returns to its own home/origin base;
2. the same base portal opens;
3. the vehicle physically passes through it;
4. the vehicle is removed from the visible world only after crossing the threshold;
5. the portal closes.

A portal does **not** imply that the vehicle teleported directly from its base to its destination. The journey between locations remains real and may be shown.

### Visual language

Portals use a **standardized BANANA.EXE system color**, not the branding color of the building or vehicle.

Current direction:

- system cyan / aqua;
- near-white energy/highlight at the active edge where useful;
- restrained dark/navy interior depth;
- controlled light spill onto the immediate environment;
- premium, engineered aperture rather than a magical/explosive effect.

The surrounding building, road or vehicle may naturally reflect the emitted cyan light, but the portal itself does not become brand-colored.

This preserves one readable meaning across the world:

**cyan portal = a vehicle is crossing its home-base boundary.**

Do not use red, gold, green or other brand-specific portal colors merely to match the originating building.

### Portal restraint

Portals should remain meaningful and relatively rare.

Use them only for true vehicle base departure/return events.

Do not use a portal:

- when a vehicle arrives at a customer/destination;
- for ordinary mid-route movement;
- merely to hide a scene transition;
- every time the camera changes maps;
- as a generic spawn/despawn effect unrelated to a vehicle's own base.

The vehicle must visibly cross the portal threshold. Do not simply flash the portal and cut the vehicle away.

### Current story applications

Established applications include:

- **HOME** — Valenté's yellow car uses the HOME portal when leaving its base and when returning to HOME. Ordinary arrival at another location uses no portal.
- **Banana Boutique** — a Banana Boutique vehicle/person leaving the Boutique base to bring Valenté a replacement banana in Part 2 exits through the Boutique portal. Arrival at HOME uses no portal.
- **Trebutech Rental & Dispatch** — the locked Trebutech delivery truck exits its regional origin through the Trebutech base portal before continuing the visible journey to HOME. Arrival at HOME uses no portal. A later return to Trebutech would use the same origin portal.
- **Exotic Fruits** — in Part 4, the delivery vehicle/courier leaving Exotic Fruits while Valenté follows the delivery through the app exits the Exotic Fruits base through its portal. The destination arrival uses no portal.

Other locations may gain a portal only when the story establishes them as the home/base of a vehicle.

### Production status

The **portal behavior, semantic rule and standardized cyan/aqua system-color direction are locked product rules**.

The **open-state portal visual is now LOCKED** after the dedicated design/review pass:

- `assets/systems/vehicle-portal/VEHICLE_BASE_PORTAL_OPEN_LOCKED.svg` — the exact implementation source. Runtime code animates its own named groups (`portal-spill`, `portal-threshold`, `portal-membrane`, `portal-rings`, `portal-collar`, `portal-glow`, `portal-edge`, `portal-anchors`); it is never redrawn in CSS or canvas, recoloured or baked into a building render.
- `assets/systems/vehicle-portal/VEHICLE_BASE_PORTAL_OPEN_REFERENCE_LOCKED.png` — visual reference only.

Locked geometry: an upright aperture across the exit road, square to travel, 32 × 28 building units, flat on the road with rounded top corners; placed at the base boundary just past the apron edge (≈ 23 building units beyond it), never inside the bay.

Locked base-exit timing (first use: Trebutech):

| Time | Beat |
| --- | --- |
| 0–0.5 s | vehicle pulls away; portal invisible |
| ≈ 0.7 s | near-white seed line forms across the road |
| ≈ 1.0 s | edges rise from both anchors and meet at the top |
| ≈ 1.4 s | fully open (membrane, collar, spill) |
| ≈ 2.4–3.4 s | vehicle crosses: the part already through is in front of the plane, the rest behind the membrane; a separate cyan/white threshold-light band may cross the body (light only — vehicle pixels unchanged) |
| ≈ 3.9 s | contracts toward the threshold centre |
| ≈ 4.4 s | invisible; the vehicle keeps driving |
| ≈ 5.6 s | camera pull-back lands on the regional journey |

It is not a scene cut and the vehicle never vanishes. Sound stays a short system shimmer on the SFX bus. Other base applications (HOME, Banana Boutique, Exotic Fruits) reuse the same system and still need their own staging pass before implementation.

## Current Part 2 flow

This is the current product-level sequence. Detailed staging authority lives in:

- `production/PART2_TRANSITION_ASSET_CHECKPOINT.md`
- `production/PART2_ACTING_STAGING_BRIEF.md`
- `production/design/BANANA_PART2_ATTEMPT01_DESIGN_DECISIONS.md`

### A. Delivery-method transition

1. End on the three delivery-method options.
2. Rapid selector cycles through all three with sound.
3. Selector slots, left to right: **ROYAL SNAIL** (`UNAVAILABLE` stamp, `TOO SLOW`), **TREBUCHET**, and an unrevealed `? ? ?` slot (no drone, no DenorD, no hint). It looks random but runs a deterministic 17-step cycle through all three and always lands on **TREBUCHET**, then holds ≈ 1.4 s.
4. TREBUCHET locks: gold frame, restrained bounce, one glow pulse and a `LOCKED IN` chip; the other two dim.
5. Reveal the Trebutech Rental & Dispatch facility (regional origin, no named city, never on MAP 02A).
6. The locked **Trebutech** delivery truck departs its own base through the standardized BANANA.EXE vehicle portal.
7. The portal closes after the truck crosses it.
8. Camera pulls back onto the visible regional journey (edge label `TREBUTECH` / `RENTAL & DISPATCH` → `HOME` / `Nottingham`); the truck's branding communicates the rented trebuchet and there is no visible cargo. No Leicester, Northampton, TFY or DenorD on this journey.
9. Push into Nottingham: the same truck continues onto **MAP 02A** (no teleport, no reverse), shrinks to house scale and drives the existing street to HOME. The old Part 1 route is recessed by a non-destructive overlay.
10. The truck arrives at HOME normally — **no destination portal** — HOME gets one gold ring pulse and a restrained glow (the map never bounces).
11. Show the transaction clearly, beside the stopped truck without covering it or HOME:
   - **TREBUCHET RENTAL**
   - **− £15.00**
   - cash/register `ching-ching` sound.
12. Update remaining budget immediately.
13. Only then reveal the **DELIVERY PROBLEM** page.

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

- Use compact journey naming: **HOME → TFY**. The DISTANCE box reads only `DISTANCE` / `HOME → TFY` (no city names, no `NOT A LOCAL RUN`).
- Put **Nottingham** and **Northampton** on the map itself rather than repeating both inside a card. No Leicester before Attempt 01 fails there.
- BUDGET box shows the live value and `You have [live budget] remaining.` — never hard-coded (RIPE £30.00, GREEN £30.50, EXTRA RIPE £32.00 after the rental).
- Method bar: `DELIVERY METHOD | TREBUCHET` with a gold frame, a small launcher icon and one arrival glow; no extra chip.
- Keep the map frameless; do not bury it inside another heavy panel.
- On SIZE UP, HOME and TFY become more prominent and the map/goal becomes center stage.
- Valenté supports the information rather than competing with it; preferred treatment is a small circular face/avatar marker at HOME.
- Distance, condition, budget and delivery method support the map rather than replacing it.
- Important problem elements may drop into place, settle and glow once, but do not animate every label/decorative object.
- While Delivery Method is undecided (only reachable without the selector), use a neutral parcel icon and a cyan frame rather than a trebuchet icon.
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
- `assets/locations/TREBUTECH_RENTAL_DISPATCH_BUILDING_LOCKED.png` — regional origin, unnamed location
- `assets/locations/ROYAL_SNAIL_POST_OFFICE_LOCKED.png`, `assets/locations/ROYAL_SNAIL_DROP_BOX_LOCKED.png` — MAP 02A overlays

**MAP 02A world rule.** `assets/MAP_02A_NOTTINGHAM_PROCUREMENT_LOCKED.png` is canonical local Nottingham and is never redrawn or rebuilt. The Part 2 Nottingham world is HOME, Banana Boutique, the Royal Snail post office and the Royal Snail drop box; new services join it only as overlays at approved positions (HOME and Banana Boutique never move). Trebutech is **not** on MAP 02A and not in Nottingham.

Existing launcher authority:
- locked launcher/rig assets already recorded in Part 2 production docs.

Next missing dependencies should be handled in this order:

1. TFY rooftop receiving basket overlay / basket-ready TFY treatment while preserving `assets/locations/S02_TFY_BUILDING_LOCKED.png`. The first basket file was locked prematurely and is pending a simpler map-scale replacement.
2. Trebuchet rental/delivery truck — **LOCKED**: `assets/part2/vehicles/source/TREBUTECH_DELIVERY_TRUCK_LOCKED.png`. The truck's TREBUTECH branding communicates the delivery; no visible trebuchet cargo.
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
