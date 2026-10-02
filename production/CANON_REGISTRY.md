# BANANA.EXE — Canon Registry

Status: ACTIVE PRODUCTION AUTHORITY

Purpose: prevent context drift. Before changing a scene, retrieve the relevant entries here and use the exact approved asset where one exists. A generative model may propose composition, timing or missing assets; it must not redraw an approved asset unless Valenté explicitly requests a redesign.

## Production rule

For every scene:
1. Retrieve this registry.
2. Retrieve the scene's current code and any referenced approved assets.
3. Separate **LOCKED / REUSE** from **OPEN / MAY DESIGN**.
4. If a locked asset exists: compose, crop, position, animate or light it. Do not regenerate "something like it."
5. New generated images are CANDIDATES until Valenté approves the exact file.
6. If canon is missing or contradictory, stop and ask rather than filling the gap.

## Character: Valenté

LOCKED identity:
- Black man, medium-brown skin.
- Dense curled black hair.
- Bright red hoodie.
- Black shorts.
- Black gloves.
- White ankle socks.
- Very thin legs.
- Yellow mid-top sneakers.
- Existing white sticker outline is acceptable for the current build.
- Do not substitute jackets, trousers, different footwear, different hair or a different facial design.

Current runtime authority:
- `assets/skeptical_locked.png`

Approved pose families exist in the production/library character system. Retrieve them before generating a new Valenté pose.

## Banana Boutique

LOCKED:
- Premium normal bananas, differentiated by ordinary ripeness only.
- Black/navy + warm gold visual language.
- Assistant remains the speaking character in Part 1.
- No literal floating banana or handoff.
- Purchase values:
  - GREEN — £4.50 — Bold choice
  - RIPE — £5.00 — The safe bet
  - EXTRA RIPE — £3.00 — Living dangerously
- Starting application budget: £50.00.

Runtime authority:
- `assets/BANANA_BOUTIQUE_BUILDING_LOCKED.png`
- `assets/boutique_interior_v1.png`
- `assets/assistant_idle_v1.png`
- approved banana assets in `assets/banana_*_v1.png`

## Maps and buildings

### HOME / Nottingham

LOCKED building authority:
- Library source: `/BANANA.EXE/05 Maps/S02_HOME_3D_LOCKED.png`
- Runtime derivative: `assets/home_canon.webp`

Rule:
- When a map represents the delivery problem from home, HOME is a building, not merely a generic dot.
- Label clearly as HOME / NOTTINGHAM.

### TFY / Northampton

LOCKED visual authority:
- Library source: `/BANANA.EXE/07 Future Northampton/S02_MAP_02B_NORTHAMPTON_FULFILLMENT_LOCKED.png`
- Runtime crop: `assets/tfy_canon.webp`

Rule:
- Blue facade / blue door surround.
- Neutral/light TFY lettering, not gold.
- When the delivery map represents the destination, TFY is a recognizable building, not merely a generic dot.
- Label clearly as TFY / NORTHAMPTON.

### Leicester

Current role:
- Attempt 01 failure/landing location.

Rule:
- The environment does not need to be visually unique to Leicester.
- The UI must make the location unmistakable with a strong **LEICESTER** label when the banana lands.
- Do not rely on abstract map geometry alone to communicate the location.

### Northampton local fulfillment

LOCKED future map:
- `/BANANA.EXE/07 Future Northampton/S02_MAP_02B_NORTHAMPTON_FULFILLMENT_LOCKED.png`
- Exotic Fruits is a distinct local partner near TFY.
- Deep green + rose-gold visual language.
- This local-partner reveal belongs later in the delivery story, not at the opening of Part 2.

## Dialogue / story facts currently locked

Part 1:
- "Right. Let’s see what’s out there…"
- "Synergy? Hard pass."
- "Exposure doesn’t pay rent."
- "Head Geek… okay, this is actually interesting."
- "Wait…"
- "BANANA?"
- "You want a banana?"
- "YOU GOT IT"
- Boutique assistant: "Here are our premium bananas. Which one would you like?"
- Valenté: "£5… for one?!"
- Assistant: "Good choice."
- "How am I getting this banana to TFY?"
- "Can I just post it?"
- PACKAGE IT / SEAL IT / LABEL: PERISHABLE / USE A FAST SERVICE
- LOOSE BANANA: NOT READY FOR POST
- "Probably a bad idea anyway. It’ll get bruised."

Part 2 opening:
- DELIVERY PROBLEM
- GET THE BANANA TO TFY.
- Payload, remaining budget and destination must persist from Part 1.
- SIZE UP THE PROBLEM is player-controlled.
- After analysis, the player explicitly chooses CONTINUE. Do not auto-launch Attempt 01.

## Event-weight rule

Important information follows this rhythm:

**SETUP → ACTION → CONSEQUENCE → HOLD → CONTINUE**

An event is not complete merely because the information appeared on screen. The player needs enough visual hierarchy and time to encode the consequence.

Current example:
- Purchase setup: available budget.
- Action: choose banana.
- Consequence: PURCHASE COMPLETE + chosen banana + spend + before/after budget.
- Hold: do not drive away immediately.
- Continue: return journey begins only after the consequence has settled.

## Generation contract

For any future image request, state explicitly:

**LOCKED / REUSE**
- exact approved subjects/assets that must not change.

**OPEN / MAY DESIGN**
- only the missing visual problem.

**FORBIDDEN DRIFT**
- no new wardrobe, face, building identity, price, geography, logo treatment or character unless requested.

Large all-in-one scene generations should be treated as concept/composition references unless every locked identity is supplied and preserved.
