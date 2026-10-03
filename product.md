# BANANA.EXE — Product

Status: ACTIVE PRODUCT SUMMARY

Purpose: capture the current product intent, the locked Part 2 launcher state, and the Banana Boutique precision-marking concept without replacing the more detailed production authority in `production/`.

When this file conflicts with a scene-specific production document or `production/CANON_REGISTRY.md`, use the more specific current production authority.

## Product premise

BANANA.EXE is a humorous, cinematic browser game built around a Head Geek application challenge. The tone should remain funny, premium, world-built and deliberate rather than random or cheap.

The game treats absurd ideas with serious production logic. Comedy should come from the commitment and engineering, not from making the world itself sloppy.

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

### Core idea

Banana Boutique does not finish its bananas with a sticker or attached label.

The brand is applied directly to the peel through an in-world precision laser-marking process performed on the established grid.

The grid is functional, not decorative. It acts as the registration surface used to locate the banana, establish its orientation and curvature, and align the Banana Boutique mark before application.

The process should feel premium, precise and slightly absurd in how seriously it treats an ordinary banana.

Use the language **precision marked** or **laser marked** rather than **laser burned**.

The visual result should read as a clean brown/caramel tonal change in the peel, integrated into the banana skin rather than printed on top of it.

Avoid:

- stickers;
- printed labels;
- branding irons;
- flames;
- heavy smoke;
- scorched or damaged-looking fruit;
- cheap sci-fi spectacle.

### Motion sequence

The branding beat should work as a short animation:

1. **DROP** — an unbranded banana drops onto the grid and settles naturally.
2. **ACQUIRE** — the grid wakes beneath it and minimal registration graphics establish position and orientation.
3. **TARGET** — the intended marking area on the visible outer curve is briefly identified.
4. **MARK** — the laser progressively traces the approved Banana Boutique mark. A restrained point-of-contact glow may be used if it improves readability.
5. **COMPLETE** — the laser disengages and the registration graphics clear.
6. **HERO** — the finished branded banana remains cleanly presented on the grid.

The animation should feel like precision engineering, not a novelty burn effect.

### Still-frame rule

The final frame of the animation should also function as the Banana Boutique hero still.

Do not create a visually unrelated static version.

The final frame should therefore be deliberately composed as a premium product image in its own right.

Keep the following separable where practical:

- base banana;
- finished Banana Boutique mark;
- grid;
- registration/calibration graphics;
- laser emitter/beam;
- progressive marking effect;
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

**control the dose.**

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

The branding sequence now has two legitimate lives:

- **inside the trailer/game:** a premium Banana Boutique product reveal;
- **outside the game:** a short engineering/explainer video that makes the fictional process feel plausible and shareable.

This is useful world-building because branded bananas now feel like objects that have passed through a real Banana Boutique process rather than ordinary bananas with a logo added afterwards.

## Continuity rule

The Banana Boutique precision-marking system is a separate production element.

It must not be used as an excuse to redraw or silently alter locked Part 2 launcher assets.

If visible banana branding is later carried through gameplay, that must be handled as an explicit downstream implementation decision while preserving player banana choice and existing scene authority.
