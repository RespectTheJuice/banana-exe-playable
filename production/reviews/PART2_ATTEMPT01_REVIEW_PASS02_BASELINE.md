# BANANA.EXE — Part 2 / Attempt 01 Review Pass 02 Baseline

**Status:** Accepted review baseline, subject to visual/audio playtest  
**Claude review commit:** `6cc308247d9959c6bf9d4d2b0e2fbdd20bbd7036`  
**Branch:** `part2-attempt01-review`  
**Purpose:** Preserve the concrete findings/timings from Claude's second review pass before later transition and asset changes are layered on top.

This file records implementation-review details that were reported as working and useful. It does **not** override newer production decisions in `production/PART2_TRANSITION_ASSET_CHECKPOINT.md` or `production/design/BANANA_PART2_ATTEMPT01_DESIGN_DECISIONS.md`.

---

## 1. Automated review state

Claude reported:

- **107 / 107 automated checks passing** after widening the randomized charge-vibration measurement window.
- The review ZIP was generated from the review commit but was **not committed**.
- All assets in the review ZIP matched that commit byte-for-byte.

Automated checks do not substitute for human listening or visual approval.

---

## 2. Discharge baseline

Current review value: **1700 ms** total discharge.

Behavior:

- two-stage drain;
- approximately 57% of energy drops by 250 ms;
- slower tail follows;
- descending electrical tone continues through the tail;
- slow mechanical spin-down sits underneath;
- glow and audio remain driven by one discharge curve.

Timing baseline:

| Time | Beat |
|---:|---|
| 0 ms | release impact |
| 1440 ms | thunk |
| 1460 ms | pose swap |
| 1540 ms | energy reaches zero |
| 1560 / 1640 ms | relay ticks |

These are current review timings, not sacred final numbers. Preserve the readable shape if tuned later.

---

## 3. Full-charge baseline

At 100%:

- hold maximum charge for **700 ms**;
- sustain a fully-charged tone over the hum;
- then perform the normal launch path;
- current review cuts to flight around **950 ms** after the full-charge trigger.

This remains subordinate to the locked branch rule:

- uninterrupted 100% hold -> normal launch -> Leicester failure;
- three valid early releases -> shake / accidental WHUMP -> Leicester failure.

---

## 4. Third-release baseline

Current review value: approximately **3.8 s to WHUMP**.

| Time | Beat |
|---:|---|
| 0–600 ms | familiar power-down |
| 600–1000 ms | wind-down stalls/hiccups; machine does not move |
| 1000 ms | hard cut to locked 07 angry/shake plate; no flash |
| 1000–1450 ms | hold the angry 07 completely still first |
| 1450 ms | Valenté begins shoving/shaking; knocks sync to his shoves |
| ~1650–1750 ms | launcher begins reacting, after Valenté initiates the shove |
| 2000 / 2300 ms | sparse then denser electrical arcs |
| 2100 ms+ | smoke begins |
| 2650 ms | instability peak |
| 2850 ms | dead-flat machine: no movement / no energy; flatline tone begins |
| 3500–3800 ms | silence |
| 3800 ms | WHUMP |
| 4050 ms | cut |

### Causality rule

The order is important:

**Valenté gets annoyed -> holds -> physically starts shoving -> machine reacts -> malfunction grows -> dead still -> WHUMP.**

Do not make the machine malfunction first and then have Valenté react.

### Locked-art limitation

07 currently does double duty as:

- the angry/fed-up face;
- the shake pose.

The anger-first read is achieved by holding the locked 07 completely still before motion begins, not by inventing a separate face.

---

## 5. Flight baseline

Current review flight duration: approximately **5200 ms**.

Beat shape:

- climb until ~1600 ms;
- stall/crest until ~2600 ms;
- lose height until ~4000 ms while continuing to move right;
- hold at Leicester.

Current visual direction:

- left-to-right travel;
- perspective ground plane;
- Nottingham front-left;
- Leicester / TFY further right and further back;
- banana receives a ground shadow;
- banana scales down with depth;
- x-position never moves backwards;
- while descending, it still continues right.

This flight is separate from the short explanatory HOME -> TFY micro-animation on the problem page.

---

## 6. Leicester forest / fox pacing baseline

Current review pacing is intentionally slower than the original.

| Time | Beat |
|---:|---|
| 0 ms | banana falls into canopy |
| 1300 ms | canopy foliage/rustle |
| 2700 ms | thud |
| 3150 ms | pause |
| 5650 ms | fox enters |
| 6950 ms | fox looks left |
| 8400 ms | fox looks right |
| 9800 ms | fox exits |
| 11,300 ms | FAILED ATTEMPT |
| 12,850 ms | RESULT: LEICESTER |
| 14,850 ms | locked 08 carry-forward pose |
| 16,750 ms | sequence done |

### Foliage audio baseline

Claude implemented three procedural foliage sounds:

- canopy: ~1.1 s, broad filtered-noise rustle with one soft branch swish;
- fox in: ~0.4 s, closer rustle;
- fox out: ~0.55 s, softer and fading away.

Important direction:

- continuous filtered noise / irregular swells;
- **no gravel/pellet/click-cluster sound**.

### Manual audio review still required

Claude explicitly had **not listened to the audio**. Timing/error checks passed, but the foliage sounds, power-down, full-charge sustain and flatline must be heard by a human before final lock.

---

## 7. Setup grounding baseline

Claude measured the earlier setup pose as floating by roughly 70 px.

Current review fix:

- Valenté's soles sit at approximately y 812;
- launcher rear-left pad contact sits around y 808;
- add a soft contact shadow;
- launcher itself does not move;
- 01–03 remain aligned across pose cuts.

### Locked-art limitation: pose 01 eyeline

Pose 01 has a mostly front-facing head with eyes glancing up/right.

Staging can place the launcher/barrel in the direction of that gaze, but a clear “looking down at the controls” read would require new art. Do not pretend the locked pose can communicate an eyeline it does not contain.

---

## 8. Pause baseline

Current accepted review direction:

- no dimming;
- no blur;
- paused content remains readable;
- thin gold frame indicates pause;
- RESUME control remains available;
- desktop may show a small PAUSED tag at the bottom;
- phones omit the PAUSED tag because it interfered with HOLD;
- Part 2 problem page may still scroll while paused;
- underlying scene interactions remain blocked while paused.

### Existing mobile issue

Pre-existing issue still needs a later correction:

- on phones, the HUD banana chip can overlap the RESUME/PAUSE control.

Do not mark mobile pause as fully resolved until that overlap is checked/fixed.

---

## 9. Problem-page implementation findings from Review Pass 02

Claude's review implemented several useful structural changes:

- brief/information leads rather than large character art;
- large Valenté removed from the problem page;
- small circular avatar marker over HOME;
- frameless map;
- DISTANCE card made more readable at desktop and phone widths;
- controls/cards checked at 1280, 390 and 360 widths;
- hero map held to ~700 px at 1280 × 720 so the state can fit without scrolling.

### Superseded details

The later production checkpoint supersedes the following Review Pass 02 wording/flow:

- compact journey wording should be **HOME -> TFY**, not a FROM row plus duplicate city wording;
- Nottingham and Northampton belong on the map;
- Part 2 now begins with the delivery-method selector + trebuchet rental delivery + budget hit **before** the problem page;
- TFY gets a rooftop receiving basket for the explanatory banana journey;
- Delivery Method uses a neutral icon while undecided;
- important problem elements may drop in, settle, and glow once.

---

## 10. Asset / delivery-size note

Claude reported the review ZIP at approximately **28.2 MiB**, close to its 30 MiB upload limit.

Adding forest/fox imagery may require:

- a split review package; or
- more efficient delivery copies.

This is a review-package constraint, not permission to degrade or replace locked production masters. Keep PNG masters as production authority; derived WebP can be used for delivery/runtime where explicitly approved.

---

## 11. Review-pass status

Preserve from this pass unless later visual/audio review rejects it:

- grounded 01–03 setup;
- slower/readable discharge shape;
- 700 ms full-charge sustain;
- anger-first third-release causality;
- left-to-right flight;
- slower forest/fox sequence;
- procedural foliage direction;
- readable pause state;
- mobile checks;
- 05/06 registration;
- locked 07/08 usage.

Do not treat automation success as final aesthetic approval.
