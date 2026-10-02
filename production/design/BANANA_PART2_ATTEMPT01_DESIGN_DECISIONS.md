# BANANA.EXE — Part 2 / Attempt 01 Design Decisions

**Status:** Active production specification  
**Source:** Claude Design consultation artifact + archived 9-board PDF  
**Artifact:** https://claude.ai/artifact/4MgDB4fndAPi7oE3g73vvP  
**Archive filename:** `BANANA_PART2_ATTEMPT01_DESIGN_CONSULTATION_v1.pdf`

This file converts the Claude Design review into repo-friendly production rules. It preserves the consultation findings while recording project-level decisions made after the review.

---

## 1. Rig-plate strategy

Use the landscape interaction shots as **full-frame rig plates** rather than attempting to separate Valenté from the launcher.

- `04`, `05`, `06`, and the eventual replacement `07` are stacked pose plates.
- Only one rig plate is visible at a time.
- The launcher, Valenté, floor, reflections, and background remain baked into each plate.
- Do **not** cut the launcher apart to create independent barrel/base layers; doing so would require repainting occluded launcher regions and would modify locked art.
- Pose changes are hard swaps or very short crossfades hidden under machine motion.

Reference plate space: **1672 × 941 px**.

---

## 2. Plate registration

`04` is the registration authority.

- `04`: no transform.
- `05`: `translate(-4px, 12px)`.
- `06`: `translate(-4px, 12px)`.
- Use **24 px overscan** cropped on every edge so registration offsets and shake never reveal an image edge.

The current `07` candidate is **not lockable**:
- about 2% scale mismatch;
- about 52 px horizontal offset;
- barrel angle differs;
- goggles differ;
- baked lightning/motion would conflict with live FX.

A replacement `07` must be built on the `04` canvas with launcher, floor, backdrop, lighting, and framing held pixel-identical.

---

## 3. Required replacement 07

**Purpose:** Third interruption / Valenté loses patience and shakes the launcher.

Requirements:

- Same **1672 × 941** canvas as `04`.
- Use `04` as the visual base.
- Launcher, floor, reflections, backdrop, camera, scale, and barrel angle remain pixel-identical to `04`.
- Only Valenté changes.
- Clear wraparound goggles must match `04`.
- Hoodie, gloves, stick-leg proportions, socks, and yellow sneakers must match locked character authority.
- Both fists on the A2 grip.
- Preserve the wide lunge / “loses patience” staging from the candidate.
- No baked electrical lightning on the barrel; live L3 handles this.
- Baked motion arcs around Valenté are acceptable.

Until replacement art exists, the current candidate remains **staging reference only**.

---

## 4. Layer hierarchy

### L0 — Stage underlay
CSS background matched to plate navy. Holds 24 px overscan crop.

### L1 — Rig plate
PNG/WebP pose plate. Covers launcher, Valenté, floor, reflections, background, and banana-in-cradle.

### L2 — Energy overlay
Inline SVG / screen blend:
- coil band;
- six travel rings;
- hub ring;
- rear capacitors;
- turntable ring;
- foot-pad strips.

### L3 — Electrical arcs
Inline SVG polylines. **Third interruption only.**

### L4 — Motion lines
Inline SVG strokes. Fade in above 60% charge.

### L5 — Smoke / sputter
Canvas 2D. **Third interruption only.** Lives outside the shake transform so smoke drifts in world space.

### L6 — Flash / flicker
DOM radial-gradient overlay for launch flash and third-interruption flicker.

### L7 — Banana projectile
PNG sprite derived from the locked launcher banana; no repaint.

### L8 — UI
DOM/CSS:
- charge meter;
- hold control;
- captions;
- speaker badge.

Keep UI outside the scaled rig box so text remains crisp.

### L9 — Later scenes
Separate scene containers for:
- flight;
- Leicester;
- forest;
- fox;
- failure result.

Cut into these on the launch WHUMP.

---

## 5. Anchor map

Plate-04 coordinate space:

- **A1 rig pivot:** `(870, 860)`
- **A2 grip:** `(470, 378)`
- **A3 hub:** `(585, 497)`, radius ~40
- **A4 barrel axis:** from `(900, 375)` at **-17.5°**
- **A5 coil band:** centre `(1130, 300)`, approx. `300 × 70`
- **A6 banana / launch:** `(1510, 118)`
- **A7 turntable:** `(890, 722)`, approx. `rx 165, ry 22`
- **F1/F2/F3 pad strips:** `(760, 880)`, `(310, 812)`, `(1310, 828)`
- **V1/V2/V3 smoke vents:** `(500, 520)`, `(500, 605)`, `(870, 800)`

Fine-tune anchors in implementation with a debug overlay.

---

## 6. Setup sequence

Use the alpha cutouts for poses `01`, `02`, and `03` beside the launcher reference on the navy stage.

Sequence:

1. **01 — inspect**
   - “How do I use this thing?”
2. **02 — shrug / acceptance**
3. **03 — goggles on / ready**
   - “Let me at least put my goggles on.”
4. Hard cut to **04 — operator / bracing**.

For setup composition:
- Valenté approx. **590 plate px tall**;
- feet on approx. **y 740**;
- launcher reference scale approx. **0.87** to match `04`.

---

## 7. Charge behavior

Single normalized value `c ∈ [0,1]` drives visuals and sound.

Default full-charge time: **2.4 s** continuous hold.

Charge-up:
- rig vibration increases with charge;
- coil overlay brightens;
- six rings travel breech → muzzle;
- capacitors step on around `c = 0.33 / 0.66 / 0.90`;
- motion lines begin at `c = 0.60`;
- charge hum rises with the same power curve.

Valenté does not require facial or limb animation while charging. The rig vibration does the acting.

---

## 8. Power-down — interruptions 1 and 2

Each valid early release uses the same **800 ms** clean power-down.

Key timing:
- `0 ms`: pointer release;
- `600 ms`: settle thunk begins;
- `620 ms`: pose swap;
- `700 ms`: power reaches zero;
- relay ticks around `680 ms` and `760 ms`.

Visual and audio power-down must derive from the same curve so glow and whine cannot drift apart.

Sound:
- descending synthesized whine;
- low mechanical settle/thunk;
- two short relay ticks;
- no failure buzzer;
- no smoke;
- no early noise burst.

No external audio asset is required; use existing synth helpers.

### Tap guard
An interruption only counts when `c >= 0.12` (~290 ms hold).

Shorter taps:
- play a mini power-down on `04`;
- do not swap pose;
- do not increment interruption count.

---

## 9. Interaction choreography

### Release #1
`04 → 05`

- Clean 800 ms power-down.
- Swap around 620 ms under settle thunk.
- Reaction: Valenté turns slightly toward player.
- No smoke.

On re-hold:
- snap to `04`;
- small spin-up jolt;
- hub flash;
- charge resumes.

### Release #2
`04 → 06`

Same timing as Release #1.

Reaction:
- one-hand shrug toward player.
- Optional caption: “I don't know what you're doing either.”

On re-hold:
- snap back to `04`;
- resume charge.

### Release #3
`04 → replacement 07 → accidental launch`

First **350 ms** matches the familiar clean power-down, then it goes wrong.

Third-interruption beat:
1. recognise familiar wind-down;
2. stutter / pitch glitch;
3. Valenté loses patience and shakes launcher;
4. electrical arcs rise;
5. smoke begins;
6. brief dead-still freeze;
7. **WHUMP** accidental launch.

Approximate current design timing:
- `0 ms`: release;
- `350 ms`: stutter;
- `520 ms`: shake plate enters under flicker;
- `650 ms+`: live arcs;
- `700 ms+`: smoke from V1/V2;
- `1000 ms`: V3 smoke;
- `1400 ms`: snap to dead still;
- `1650 ms`: WHUMP / projectile leaves;
- `1900 ms`: cut away.

Smoke belongs **only** on this third-interruption path.

---

## 10. Launch branch — PROJECT OVERRIDE

Claude Design left full-charge behavior open. The project decision is now locked:

### A. Uninterrupted full charge
If the player holds continuously to **100%**:

- launcher fires normally;
- skip the shake / malfunction beat;
- proceed directly into banana flight.

### B. Three valid early releases
If the player triggers three interruptions:

- third interruption runs the shake / malfunction / accidental WHUMP path;
- banana launches before a proper intentional release.

### Shared outcome
**Both launch paths still fail in Leicester.**

The comedy path changes according to player behavior, but Attempt 01 always ends at the Leicester forest / fox failure beat.

---

## 11. Projectile and duplicate-banana guard

Create the projectile sprite as an **alpha crop** of the banana from `banana_launcher_LOCKED.png`.

- No repaint.
- Scale to approximately **160 px** in plate space.
- Spawn from **A6**.
- Exit along barrel axis, approximately **-18°**.

Because the rig plate still contains the baked banana:
- cover A6 with a muzzle bloom during launch;
- hold bloom from approximately `1650 ms` until the scene cut at `1900 ms`;
- do not linger on the launcher after firing.

An empty-cradle repaint is not required unless later staging holds on the launcher after launch.

---

## 12. Leicester continuation

After either launch path:

1. banana flight;
2. descent toward Leicester;
3. forest canopy appears;
4. banana disappears into trees;
5. rustling leaves;
6. thud;
7. ~2 second hold;
8. fox appears with banana in mouth;
9. fox looks left;
10. fox looks right;
11. fox disappears into trees;
12. **FAILED ATTEMPT**
13. **RESULT: LEICESTER**
14. carry forward with determined Valenté beat.

---

## 13. Continuity and implementation risks

### High
**Replacement 07 required before final lock.**

### Medium
- Duplicate banana during launch → muzzle bloom guard.
- `04` contains baked motion arcs → maintain slight idle buzz/hum so they read naturally.
- Bright `04` coil vs dim `05/06` → swap late in power-down.
- `05/06` registration offset → transform + overscan.
- Shake may become too subtle on phones → clamp to at least ~1.5 CSS px on screen.

### Low
- Decode hitch → preload plates and await `img.decode()`.
- Ship WebP delivery copies but retain PNG masters as visual authority.
- `prefers-reduced-motion` → replace physical rig shake with glow pulses + meter tremor while preserving timing, sound, and pose swaps.

---

## 14. Current asset status

### LOCKED
- 01 confused / inspecting
- 02 shrug / acceptance
- 03 goggles on / ready
- 04 operator / bracing
- 05 first interruption / turn toward player
- 06 second interruption / one-hand shrug
- 08 determined carry-forward
- futuristic banana launcher

### OPEN
- **07 replacement shake plate**

### DERIVED, NO REPAINT
- banana projectile sprite

### BUILT LIVE IN CODE
- charge glow
- coil travel
- electrical arcs
- motion lines
- smoke
- flash / flicker
- charge meter
- power-down SFX
- third-interruption malfunction SFX

---

## 15. Review order after implementation

Run three separate passes:

1. **Dialogue / information only**
2. **Image / visual only**
3. **Combined playthrough**

Do not use polish to mask a comprehension or continuity failure.
