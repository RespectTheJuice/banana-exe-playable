# BANANA.EXE — Banana Boutique Precision Marking Direction

Status: ACTIVE DESIGN DIRECTION — NOT VISUALLY LOCKED

Product: BANANA.EXE  
Production credit: **AN RTJ PRODUCTION**

Purpose: convert the current precision-marking discussion, Claude Design findings, visual references and revised grid behavior into a durable system specification.

## 1. Current decision

The Banana Boutique precision-marking idea is approved as a product/world-building system.

The first Claude Design exploration is useful for:

- sequence structure;
- mark placement;
- readability testing;
- curved-surface logic;
- small-scale fallback logic;
- implementation architecture;
- identifying the missing identity master.

However, its visual realism is **not final authority**. The final treatment should be less photoreal/product-commercial and more clearly part of the stylized BANANA.EXE world.

## 2. Existing Claude findings to preserve

Preserve these working findings from the first design pass unless a later test disproves them:

- locked player banana selected through `BX.getChoice()`;
- banana art remains unmodified;
- mark sits on the lower outer/belly curve;
- mark follows banana curvature;
- peel texture/shading shows through the final mark;
- left-to-right laser path in reading order;
- restrained contact glow helps the eye follow the mark;
- no flames, heavy smoke, black char or ragged burn edges;
- full mark + wordmark when readable;
- approved banana mark alone at smaller sizes;
- final animation frame doubles as the static hero still;
- identity master remains a ship blocker, not a concept blocker.

The first Claude prototype used six beats over 8.0 seconds: Drop, Acquire, Target, Mark, Complete, Hero. The revised direction adds a pre-drop GRID WAKE beat; exact total timing remains open.

## 3. Revised grid direction

The word **grid** refers to a visible square technical grid across a dark navy / near-black field, matching the supplied grid reference rather than a generic industrial platform.

The grid is an active system stage.

### Pre-drop behavior

The grid begins dark but alive.

Energy pattern:

**pulse → pulse → pulse pulse pulse → steady pulse**

The pulse behavior should echo the energy escalation language of the final trebuchet interruption without reading as a failure state.

Visual tone:

- warm gold / amber energy;
- dark navy field;
- thin visible square grid lines;
- glow concentrated enough to read as powered but restrained enough to keep the banana dominant;
- no full-screen neon overload.

### Banana impact

When the banana lands:

- the pulsing pattern resolves;
- the grid enters a stable continuously active glow;
- contact should feel like the system has accepted the object;
- registration/acquisition begins only after the landing settles.

This transition is important. The grid should feel like a machine waking into a working state, not a passive background texture.

## 4. Revised sequence

### 0. GRID WAKE
Grid pulses into readiness before the banana appears.

### 1. DROP
The selected banana enters, lands slightly imperfectly and settles.

### 2. ACQUIRE
The active grid establishes orientation and registration with restrained system graphics.

Recommended graphics remain minimal:

- corner brackets;
- long-axis indication;
- center/reference point;
- one compact readout if needed.

### 3. TARGET
A curved target band identifies the mark area on the lower outer curve.

### 4. MARK
Laser applies the approved Banana Boutique identity progressively.

Desired visual behavior:

- small warm contact glow;
- temporary hot amber immediately behind the marking point;
- final caramel/brown mark as it cools;
- peel texture remains visible;
- no char-black finish.

### 5. COMPLETE
Laser stops. Temporary target and registration graphics clear.

### 6. HERO
Banana holds on the stable glowing grid.

The HERO state is the still-frame composition.

## 5. Visual tone

Target:

- cinematic;
- premium;
- stylized;
- deliberate;
- in-world technology;
- subtly absurd because of how seriously a banana is treated.

Avoid:

- sterile food-tech advertising;
- photoreal industrial-demo energy as the dominant aesthetic;
- generic laboratory machinery;
- excessive holographic HUD decoration;
- comedy machinery;
- cheap sci-fi.

The technology should be impressive. The joke comes from applying that level of precision to a banana.

## 6. Banana Boutique identity

Current blocker:

The approved Banana Boutique identity currently exists only as a small perspective raster on `BANANA_BOUTIQUE_BUILDING_LOCKED.png`.

Before ship-ready implementation, create and approve a flat master containing:

- Banana Boutique wordmark;
- approved banana/crescent mark;
- proportions derived from the locked sign;
- identified or faithfully reconstructed type treatment.

Stand-in type or substitute marks may be used for timing/layout tests only and must not ship.

### Application variants

**Variant A — mark + wordmark**
Use where the text remains readable.

**Variant B — banana mark only**
Use at small sizes such as chips/gameplay/projectile overlays where the wordmark becomes unreadable.

This is an application variant of the same identity, not a new logo.

## 7. BANANA.EXE + RTJ production signature

The precision-marking frame should identify the world without becoming a second title card.

Preferred treatment:

- lower-left `BANANA.EXE` system tag;
- subdued ember/dark signal red;
- small scale;
- secondary to the banana;
- not bright alarm red.

Add **AN RTJ PRODUCTION** as a smaller secondary line directly beneath the BANANA.EXE tag or as a restrained opposing-corner credit if needed for composition.

Recommended color for RTJ credit:

- warm off-white;
- muted gold-grey;
- another quiet neutral compatible with the Boutique gold.

Do not give the RTJ credit the same visual weight as BANANA.EXE or the branded banana.

## 8. Hero still rule

The final animation frame is the still.

It should contain:

- precision-marked banana as hero;
- stable glowing square grid;
- restrained final ambient glow;
- no temporary target brackets/readout;
- lower-left BANANA.EXE system tag;
- restrained RTJ production credit;
- no unrelated UI clutter.

## 9. Working references Claude should use

Claude Design should work from all of the following:

1. `/product.md`
2. `/production/CANON_REGISTRY.md`
3. this file
4. the first precision-marking Claude Design canvas / exported PDF as a logic reference, not final visual authority
5. supplied dark square-grid visual reference
6. supplied glowing Banana Boutique banana-mark reference
7. locked player banana assets `assets/banana_*_v1.png`
8. locked Banana Boutique building/sign authority
9. existing Part 2 trebuchet interruption energy language as a motion/energy reference only

## 10. LOCKED / REUSE

- player banana choice through `BX.getChoice()`;
- locked banana PNGs remain untouched;
- approved Banana Boutique building/sign identity as source authority;
- mark placement logic on lower outer curve as working production direction;
- no changes to locked Part 2 launcher art;
- final frame doubles as static still;
- precision marking, not sticker application.

## 11. OPEN / MAY DESIGN

- exact revised pulse timing;
- exact glow intensity;
- exact stylization level;
- laser-head visual treatment;
- exact camera behavior;
- final RTJ credit placement if lower-left becomes crowded;
- final total sequence duration after GRID WAKE is added;
- exact final approved identity master treatment.

## 12. FORBIDDEN DRIFT

Do not:

- redraw the selected banana;
- replace the grid with a generic industrial table/platform;
- turn the frame into a realistic food-manufacturing advert;
- introduce a new Banana Boutique identity;
- use stand-in typography as final identity;
- recolor the final mark black;
- add flames/heavy smoke/sparks as spectacle;
- make BANANA.EXE bright warning-red;
- imply Part 1 pacing is locked;
- touch locked Part 2 launcher assets.

## 13. Next dependency

Before Claude Code implementation:

1. approve revised stylized visual direction;
2. produce/approve the flat Banana Boutique identity master;
3. confirm application variants A and B;
4. decide whether the precision mark persists into downstream gameplay/projectile states;
5. then prepare a Claude Code implementation brief.
