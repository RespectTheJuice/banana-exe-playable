# BANANA.EXE — Part 2 Transition & Asset Checkpoint

**Status:** Active production checkpoint  
**Purpose:** Capture approved Part 2 transition, problem-page, and asset-priority decisions before new asset generation or implementation.  
**Rule:** Save decisions first, then build. This checkpoint supplements `production/PART2_ACTING_STAGING_BRIEF.md` and `production/design/BANANA_PART2_ATTEMPT01_DESIGN_DECISIONS.md`.

---

## 1. Part 2 transition — locked direction

Part 2 should not begin by simply spawning the trebuchet or dropping straight into the problem screen.

The transition now earns the trebuchet narratively and mechanically.

### Sequence

1. End on the **three delivery-method options**.
2. Run a rapid selector through the three options with sound.
3. The selector should **look random**, but the outcome is deterministic for this build.
4. It slows and stops on **TREBUCHET**.
5. TREBUCHET locks in with a small settle/bounce and **glow pulse**.
6. Cut to a map-based delivery beat.
7. A rental/delivery truck travels toward **HOME** carrying the trebuchet.
8. The truck should make the cargo readable. Preferred treatment:
   - visible trebuchet on/in the vehicle; and/or
   - a trebuchet graphic/silhouette on the side of the vehicle;
   - optional simple `TREBUCHET RENTAL` branding.
9. The rental origin does not need a detailed building or geographically accurate depot. It only needs to communicate that the machine is being delivered from somewhere else.
10. Truck arrives at HOME.
11. HOME receives a small arrival settle/bounce and **glow pulse**.
12. Show the budget transaction clearly:
    - **TREBUCHET RENTAL**
    - **− £15.00**
    - cash/register `ching-ching` sound.
13. Update the visible remaining budget immediately after the hit.
14. Only then reveal the **Part 2 problem screen**.

### Design intent

This sequence answers the obvious story question: **why does Valenté have a trebuchet?**

It also makes the budget mechanic visible rather than silently changing a number. The comedy comes from committing money to an absurd delivery method before confronting the full delivery problem.

Do not build a large rental subplot or rental-depot scene unless later required.

---

## 2. Selector behavior

The three-option selector should feel playful and game-like without introducing actual branching for Attempt 01.

### Behavior

- Rapid cycle through all three options.
- Short repeated selector/tick sound.
- Slow-down phase before selection.
- Deterministic landing on **TREBUCHET**.
- Selected option settles into position.
- One restrained glow pulse confirms the lock.

Do not present this as genuine random branching if the game is not supporting all three outcomes yet.

---

## 3. Glow-pulse visual language

Use a small glow pulse when a major element **lands, locks, or is successfully received**.

Approved uses include:

- TREBUCHET selection locking in;
- rental truck arriving at HOME;
- important problem-page elements dropping into their final positions;
- explanatory banana landing in the TFY roof basket;
- TFY roof basket/receiver confirming the catch.

The pulse should be restrained: one confirmation beat, not a looping effect.

---

## 4. Problem page — current direction

The problem page remains a comprehension gate, but the transition above now happens first.

### Journey naming

Use:

**HOME → TFY**

for the compact journey information.

Put **NOTTINGHAM** and **NORTHAMPTON** on the map itself rather than repeating both city names inside the compact info card.

### Map

- Keep the map **frameless / without a heavy container**.
- Let the map breathe rather than boxing it into another panel.
- HOME and TFY should become more visually prominent on the sized-up state.
- The second state should be more map/goal-centric than the first.
- Valenté may appear as a small circular face/avatar marker at HOME rather than a large character competing with the information.
- At phone widths, controls and information cards must stack/space cleanly with no button-card overlap.

### Locked TFY receiving interaction

The explanatory route should have a **specific physical target**, not a generic destination dot.

- Place a **basket/receiving basket on top of the TFY building**.
- The basket should be visible enough to understand at the problem-page map scale.
- The explanatory banana travels from HOME toward TFY.
- The banana **lands inside the basket on top of the TFY building**.
- Play a short, satisfying **`swish`** as it drops into the basket.
- The basket/TFY endpoint gives a small settle/bounce or glow confirmation after the catch.
- HOME/Valenté may answer with a small jump/bounce/glow response so both ends of the route acknowledge success.

This basket-on-TFY interaction is part of the problem-page explanatory animation. It is not the real Attempt 01 outcome.

### Explanatory route feedback — sequence

1. Valenté circular face marker sits at HOME.
2. A banana icon appears beside/at HOME.
3. Banana departs HOME.
4. Banana follows the route toward TFY.
5. The TFY rooftop basket is already visible as the receiving target.
6. Banana drops into the basket.
7. Play the **swish**.
8. Basket/TFY gives a small receive reaction and glow pulse.
9. HOME/Valenté marker gives a small feedback bounce/pulse.

Keep this journey short, clear, and satisfying. It is an explanatory micro-animation, not the full Attempt 01 flight sequence.

### Delivery Method

Use a **neutral icon** while the delivery method is undecided.

Preferred semantic direction:
- parcel/crate;
- route/transport symbol;
- similarly neutral delivery graphic.

Do not use a trebuchet icon while the state still says **UNDECIDED**.

Once a method is actually selected later, the icon may evolve to represent that method.

### Budget

Use clear copy such as:

**BUDGET / REMAINING BUDGET**

Do not use explanatory filler such as “You still only have one budget.”

The visible value must reflect the £15 trebuchet rental hit before the problem screen appears.

### Information-entry animation

Important problem-defining elements may drop down from above, settle, and glow once.

Reserve this behavior for high-value information only, such as:
- route/map area;
- distance;
- condition;
- budget;
- delivery method.

Do not animate every decorative label or object this way. The effect should communicate **assembly of the problem**, not become background spectacle.

---

## 5. Asset priority — build order

Prioritize assets by production dependency rather than by visual novelty.

### Priority 1 — Buildings / locations

Create or prepare location authority needed for readable map/scene staging first.

Current priority:
- HOME;
- TFY;
- **TFY rooftop receiving basket** as a separate overlay or clean building variant, whichever preserves the locked TFY building best.

HOME and TFY should support larger presentation on the sized-up problem state.

The TFY receiving basket must be positioned so the explanatory banana can visibly land in it with the swish/glow feedback.

Do not create unnecessary rental-depot architecture solely to explain the trebuchet delivery.

### Priority 2 — People

Create people only when their scene/function is known.

Current people/character needs:
- Valenté avatar treatment for HOME map marker, derived from locked Valenté authority;
- Banana Boutique dealer, using existing approved identity;
- Exotic Fruits dealer, using existing approved identity;
- Sam represented as a silhouette unless explicitly changed later.

Do not generate replacement identities for already approved characters.

### Priority 3 — Delivery-method assets where necessary

Current delivery-method needs:
- neutral **DELIVERY METHOD** icon;
- trebuchet rental/delivery truck;
- readable trebuchet cargo treatment and/or truck-side trebuchet graphic;
- optional minimal TREBUCHET RENTAL branding.

### Downstream payoff assets

After the transition/problem dependencies are covered:
- forest/canopy treatment;
- fox;
- reusable neon Banana Boutique banana sign/mark.

---

## 6. Trebuchet rental vehicle — asset brief seed

The first new delivery-method asset to design from this checkpoint should be the **rental delivery truck**, because the new Part 2 transition depends on it.

### Must communicate

- this vehicle is transporting the already-approved futuristic banana launcher / trebuchet;
- it is a rental/delivery vehicle, not Valenté's personal vehicle;
- the trebuchet cargo is immediately readable at map scale;
- a side graphic/silhouette of the trebuchet may be used to make the joke legible;
- optional `TREBUCHET RENTAL` branding may be used if it improves clarity.

### Should avoid

- inventing a complicated rental-company subplot;
- replacing or redesigning the locked futuristic launcher;
- making the vehicle so detailed that it stops reading clearly on the map;
- implying a new geographic requirement for the rental origin.

Exact truck style/composition remains open for asset design.

---

## 7. Other approved visual/world assets to preserve in the queue

These ideas are approved enough to remain in the production queue even though they are not all immediate dependencies:

- reusable **neon Banana Boutique banana** sign/mark extracted from the locked building identity;
- Banana Boutique dealer, using the already approved dealer identity;
- Exotic Fruits dealer, using the already approved identity/brand direction;
- Sam as a silhouette rather than a detailed portrait;
- forest/canopy asset for the Leicester miss;
- fox asset and fox look-left / look-right / exit treatment.

Do not let immediate transition work cause these approved concepts to disappear from the record.

---

## 8. Existing Claude review — preserve unless superseded here

The recent implementation review remains useful for:

- grounded setup poses;
- longer discharge and power-down readability;
- full-charge sustain before launch;
- anger-first third-release causality;
- left-to-right flight;
- slower Leicester forest/fox pacing;
- readable pause state;
- 05/06 registration and 07 lock.

This checkpoint supersedes any review detail that conflicts with the following:

- Part 2 begins with the three-option selector/rental-delivery transition before the problem screen;
- compact route wording is **HOME → TFY**;
- the TFY building carries the rooftop receiving basket for the explanatory banana journey;
- the banana lands in that basket with a **swish** and endpoint feedback;
- Delivery Method uses a neutral icon while undecided;
- rental cost is visibly charged before the problem page;
- asset work is prioritized **buildings → people → delivery-method assets where necessary**, while the rental truck remains the immediate delivery-method dependency.

---

## 9. Workflow rule

Before generating or implementing a new idea:

1. Record the decision in the production system.
2. Identify whether it changes canon, staging, design, or implementation.
3. Create only the assets required by the next dependency.
4. Review and lock those assets.
5. Then hand the locked assets/spec to Claude Design or Claude Code.

Do not jump from a conversational idea directly into implementation if the production record has not been updated.
