# BANANA.EXE — Product

**An RTJ Production**

Status: ACTIVE PRODUCT MASTER

Purpose: hold the current product-level truth for BANANA.EXE: what the product is, what is locked, what is still open, and the major systems that scene-level production documents must inherit.

Document hierarchy:

1. `product.md` — product-level master and current status.
2. `production/CANON_REGISTRY.md` — locked identity, asset and anti-drift authority.
3. `production/README.md` — production workflow and document map.
4. scene/system documents under `production/` — subordinate working specifications and checkpoints.

A more specific current scene/system document may add detail, but it must not silently contradict this product master or the canon registry. If authority is genuinely contradictory, stop and reconcile the documents before producing new work.

## Production identity

BANANA.EXE is an **RTJ production**.

For title cards, trailers, presentation boards and finished outward-facing material, the preferred credit language is:

**AN RTJ PRODUCTION**

For the Banana Boutique precision-marking shot specifically, use a restrained system signature rather than a large second title:

- `BANANA.EXE` as the primary small system tag in the lower-left area;
- `AN RTJ PRODUCTION` may sit directly beneath it in smaller neutral text, or appear as a small opposing-corner credit if composition requires;
- the RTJ credit must remain secondary to the banana and Banana Boutique mark.

Current visual direction for the `BANANA.EXE` tag: subdued ember/dark signal red rather than bright primary red. The RTJ production credit should use a quieter warm-neutral/off-white or muted gold-grey so the two lines do not compete.

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

The current Claude prototype already establishes the six-beat sequence and uses the locked player banana rather than repainting it. It also treats the identity lockup as a stand-in pending a proper master file. These are useful production findings, not final visual lock. See the working precision-marking brief under `production/design/`. 

### Core idea

Banana Boutique does not finish its bananas with a sticker or attached label.

The brand is applied directly to the peel through an in-world precision laser-marking process performed on the established grid.

The grid is functional, not decorative. It acts as the registration surface used to locate the banana, establish its orientation and curvature, and align the Banana Boutique mark before application.

Use the language **precision marked** or **laser marked** rather than **laser burned**.

The visual result should read as a clean brown/caramel tonal change in the peel, integrated into the banana skin rather than printed on top of it.

Avoid:

- stickers;
- printed labels;
- branding irons;
- flames;
- heavy smoke;
- scorched or damaged-looking fruit;
- cheap sci-fi spectacle;
- sterile photoreal food-tech advertising as the final aesthetic.

### Grid visual direction

The grid is an active stage.

Use the supplied dark navy square-grid reference as the current direction:

- dark navy / near-black field;
- clearly readable square grid;
- warm gold/amber energy glow;
- restrained rather than full-screen neon spectacle.

Before the banana appears, the grid should pulse with energy in a rhythm inspired by the final trebuchet interruption:

**pulse → pulse → pulse pulse pulse → steady pulse**

The pulses should build expectation rather than communicate failure.

When the banana lands:

- the impact resolves the pulsing state;
- the grid moves into a stable, continuously active glow;
- the registration/acquisition process then begins.

This makes the grid feel like a machine/system waking up rather than a passive floor texture.

### Motion sequence

Current sequence direction:

1. **GRID WAKE / PULSE** — dark grid pulses into readiness.
2. **DROP** — an unbranded banana drops onto the grid and settles naturally.
3. **ACQUIRE** — the now-active grid registers position/orientation with restrained graphics.
4. **TARGET** — the intended marking area on the visible outer curve is briefly identified.
5. **MARK** — the laser progressively creates the approved Banana Boutique mark. A restrained contact glow is desirable.
6. **COMPLETE** — laser disengages and temporary targeting/registration graphics clear.
7. **HERO** — the completed precision-marked banana holds on the steadily glowing grid.

The previous Claude Design prototype used six beats over 8.0 seconds: Drop, Acquire, Target, Mark, Complete, Hero. The added pre-drop GRID WAKE is a direction refinement; exact total duration remains open until the revised sequence is tested.

### Mark placement and scale behavior

Useful findings from the Claude Design study are retained as working direction:

- the lower outer/belly curve is the preferred mark area;
- the mark should follow the banana's curvature;
- the mark should preserve underlying peel texture/shading rather than looking pasted on;
- full Banana Boutique mark + wordmark may be used where readable;
- at small sizes, use the approved banana mark alone rather than forcing unreadable text;
- keep the mark caramel/brown with crisp edges so it reads as deliberate precision marking rather than bruising or burning.

These findings remain subordinate to final visual approval. The Claude study itself notes that the existing identity source is only a small perspective raster on the locked Banana Boutique sign, so a proper flat/vector identity master is still required before ship-ready implementation.

### Corner system signature

The precision-marking frame should carry a small BANANA.EXE system signature.

Preferred composition:

- lower-left corner;
- `BANANA.EXE` in subdued ember/dark signal red;
- optional `AN RTJ PRODUCTION` directly below in smaller warm-neutral/off-white or muted gold-grey;
- neither line should compete with the banana or the Banana Boutique mark;
- avoid bright warning-red styling.

### Still-frame rule

The final frame of the animation should also function as the Banana Boutique hero still.

Do not create a visually unrelated static version.

The final frame should therefore be deliberately composed as a premium product image in its own right.

Keep the following separable where practical:

- base banana;
- finished Banana Boutique mark;
- grid;
- registration/calibration graphics;
- laser emitter/contact effect;
- progressive marking effect;
- BANANA.EXE / RTJ system signature;
- final hero composition.

Any generated hero frame remains a candidate until Valenté explicitly approves the exact image.

## Precision-marking explainer / content extension

The precision-marking idea also creates a natural explainer-video question:

> **“So how do we use a laser to brand our bananas and not cook them?”**

This should be treated as a genuine piece of engineering curiosity inside the Banana Boutique world, not just marketing copy.

### Core explanation

A laser does not need to heat the whole banana in order to mark its peel.

The process is about controlling the amount of energy delivered to a very small surface area for a very short time.

The useful explanatory variables are:

- beam intensity / power;
- dwell time;
- scan speed;
- focus / spot size;
- depth of the surface effect;
- total energy delivered to the peel.

The communication principle is:

**CONTROL THE DOSE.**

The desired result is a shallow surface mark on the peel, not enough sustained heating to meaningfully cook the fruit beneath it.

Do not publish exact wattage, speed or hardware settings as if they are proven until the real process has actually been tested on appropriate equipment.

### Explainer-video structure

Suggested short-form structure:

1. **Problem** — “We want the brand on the banana itself.”
2. **Complication** — “Laser sounds great. Except lasers make heat.”
3. **Question** — “So how do we laser-brand a banana without cooking it?”
4. **Answer** — “Control the dose.”
5. **Visual explanation** — briefly show intensity, dwell time, scan speed, focus and surface-only marking.
6. **Reveal** — end on the finished Banana Boutique precision-marked banana.

Possible public hook/title:

**How do you laser-brand a banana without cooking it?**

Possible internal concept title:

**BANANA BOUTIQUE: PRECISION MARKING TEST**

### Product-world payoff

The branding sequence has two legitimate lives:

- **inside the trailer/game:** a premium Banana Boutique product reveal;
- **outside the game:** a short engineering/explainer video that makes the fictional process feel plausible and shareable.

This is useful world-building because branded bananas now feel like objects that have passed through a real Banana Boutique process rather than ordinary bananas with a logo added afterwards.

## Continuity rule

The Banana Boutique precision-marking system is a separate production element.

It must not be used as an excuse to redraw or silently alter locked Part 2 launcher assets.

If visible banana branding is later carried through gameplay, that must be handled as an explicit downstream implementation decision while preserving player banana choice and existing scene authority.
