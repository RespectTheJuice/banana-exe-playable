# BANANA.EXE — Part 2 Acting & Staging Brief

**Status:** Active production direction  
**Scope:** Part 2 problem page, Attempt 01 staging, new Valenté assets, Leicester failure gag, GitHub social preview, favicon  
**Does not authorize:** redesign of locked characters, buildings, brands, geography, prices, or existing approved assets

---

## 1. Part 2 problem page

### Problem
The Part 2 problem page had two issues:

- it advanced before the player had enough time to absorb the delivery constraints;
- text/UI competed visually with Valenté and the page needed a clearer hierarchy.

### Locked behavior
The sequence is:

1. **DELIVERY PROBLEM**
2. Show carried state:
   - payload;
   - remaining budget;
   - destination: TFY / Northampton.
3. Player selects **SIZE UP THE PROBLEM**.
4. Reveal:
   - **DISTANCE**;
   - **CONDITION**;
   - **BUDGET**;
   - **DELIVERY METHOD: UNDECIDED**.
5. Stop.
6. Player explicitly selects **CONTINUE**.

The page must not auto-launch Attempt 01.

### Design intent
This is a comprehension gate, not a transition screen.

The player should be able to answer:

- What is the task?
- What are the constraints?
- Why is this difficult?

Reconfigure layout as needed so text and character do not obstruct each other. Valenté should support the composition, not sit beneath critical copy.

---

## 2. Attempt 01 premise — Trebuchet Rental

Attempt 01 is a ridiculous but sincere delivery solution.

Valenté does not own a trebuchet. The machine is obtained through a simple **trebuchet rental** premise.

Do not build a large subplot around the rental. The purpose is only to answer the obvious story question: **why does Valenté have a trebuchet?**

Working environmental label:

**TREBUCHET RENTAL**

The exact rental environment remains open for design.

---

## 3. Required new Valenté assets

All new artwork must preserve the locked Valenté identity in `production/CANON_REGISTRY.md`.

### A. Confused / inspecting pose

**Beat:** Valenté approaches or studies the trebuchet.

**Performance:**
- visibly unsure how the machine works;
- curious/confused rather than frightened;
- supports the line: **“How do I use this thing?”**

### B. Shrug / acceptance pose

**Beat:** confusion resolves into action.

**Performance:**
- small shrug;
- “well, here goes” energy;
- understated rather than exaggerated.

### C. Trebuchet operator pose

**Beat:** launch.

**Performance:**
- Valenté is physically operating, bracing against, or holding onto the trebuchet;
- he remains in shot while the machine shakes;
- his body reacts to the vibration with the machine.

The trebuchet should not appear to fire autonomously.

### D. Determined carry-forward pose — OPEN / REPLACE

**Beat:** after Attempt 01 fails.

**Status:** No approved production asset currently exists. An earlier generated determined pose was mistakenly treated as locked and is rejected for character-style drift.

**Performance:**
- composed;
- determined;
- ready to move to the next solution;
- must preserve the locked Valenté photo-caricature face language, proportions, stick legs, glove design, sock height, shorts shape, and yellow sneaker design.

Do not use a defeated or melodramatically disappointed reaction. Do not use the rejected earlier determined asset.

---

## 4. Attempt 01 choreography

### Beat 1 — Establish
- reveal the rented trebuchet;
- Valenté enters or is already approaching it.

### Beat 2 — Inspect
Valenté studies the machine.

Dialogue:

> How do I use this thing?

Use the new confused pose.

### Beat 3 — Commit
Use the shrug/acceptance pose.

The beat may be silent. Its job is simply to communicate: **try it anyway**.

### Beat 4 — Operate
- load the selected banana;
- Valenté is physically part of the launch setup;
- retain the existing aggressive trebuchet vibration;
- Valenté shakes/reacts with the machine.

Preferred staging: Valenté remains visibly attached to the action rather than loading the machine and leaving frame.

### Beat 5 — Fire
- launch the selected banana;
- transition into the existing flight sequence.

---

## 5. Leicester failure gag

The Leicester failure should become a visual comedy beat rather than only a map result.

### Sequence

1. Banana begins descending.
2. A modest forest canopy/environment appears below.
3. Banana disappears through the treetops.
4. Play rustling leaves.
5. Play a clear **thud**.
6. Hold briefly, approximately 2 seconds.
7. A fox pokes its head out from the trees with the banana in its mouth.
8. Fox looks left.
9. Fox looks right.
10. Fox disappears back into the forest.
11. Show:
    - **FAILED ATTEMPT**
    - **RESULT: LEICESTER**

The forest does not need geographic realism. Clear narrative labeling is sufficient.

The gag should be short and readable, not a separate mini-cartoon.

---

## 6. Post-failure transition

Do not add a long disappointed-character beat.

After the failure is clear:

- preserve forward momentum;
- use the determined carry-forward pose only after a replacement asset has been generated and approved;
- proceed to the next delivery solution.

Tone: **that did not work; try the next thing.**

---

## 7. GitHub social preview

### Format
Recommended canvas: **1280 × 640**.

### Composition
Top / brand area:
- approved neon banana mark from the Banana Boutique identity;
- **BANANA.EXE** above or below the mark.

Character/story area:
- Valenté;
- Banana Boutique dealer;
- Exotic Fruits dealer;
- silhouette representing Sam.

### Rules
- reuse approved character/brand identities;
- do not invent replacement versions of existing characters;
- Sam remains a silhouette unless explicitly changed later;
- keep the composition readable at social-preview size;
- avoid overcrowding.

This image is for the GitHub repository social preview, not the browser favicon.

---

## 8. Browser favicon

Use the **neon banana mark only**.

Do not include:
- BANANA.EXE text;
- characters;
- scenery.

### Required outputs
- `favicon-32.png`
- `favicon-48.png`
- `apple-touch-icon.png`
- optional `favicon.ico`

### HTML
Add to `<head>`:

```html
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="assets/favicon-48.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
```

Optional:

```html
<link rel="icon" href="assets/favicon.ico">
```

---

## 9. Production boundaries

### LOCKED / REUSE
- Valenté identity and wardrobe;
- existing Banana Boutique dealer identity;
- existing Exotic Fruits dealer / brand identity;
- existing HOME and TFY visual authority;
- selected banana state and remaining budget carried from Part 1;
- Leicester as Attempt 01 failure location;
- player-controlled **SIZE UP THE PROBLEM → CONTINUE** flow;
- neon banana as the favicon/social-preview brand mark.

### OPEN / MAY DESIGN
- exact trebuchet-rental environment;
- exact composition of the new Valenté poses;
- exact forest treatment;
- exact fox design and animation treatment;
- exact GitHub social-preview composition;
- exact favicon rendering.

### FORBIDDEN DRIFT
- no redesigned Valenté identity;
- no replacement dealer identities;
- no new geography;
- no autonomous trebuchet presentation if Valenté can physically operate it;
- no return to auto-advancing the Part 2 analysis;
- no extra trebuchet subplot beyond what the scene needs;
- no detailed Sam portrait unless explicitly requested.

---

## 10. Production order

1. Approve this brief.
2. Create the required new visual assets.
3. Review staging/composition in Claude Design using locked assets plus the new approved assets.
4. Freeze approved compositions / asset placements.
5. Write Claude Code an implementation handoff using only approved assets and approved staging.
6. Implement.
7. Run separate:
   - dialogue/information-only review;
   - image/visual-only review;
   - combined playthrough review.
