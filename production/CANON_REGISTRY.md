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
- Runtime authority: `assets/locations/S02_HOME_3D_LOCKED.png` (original standalone render; use as-is, do not convert to WebP or crop)
- Library source: `/BANANA.EXE/05 Maps/S02_HOME_3D_LOCKED.png`
- Superseded: `assets/home_canon.webp` (old low-resolution runtime derivative; do not use)

Rule:
- When a map represents the delivery problem from home, HOME is a building, not merely a generic dot.
- Label clearly as HOME / NOTTINGHAM.

### TFY / Northampton

LOCKED visual authority:
- Runtime authority: `assets/locations/S02_TFY_BUILDING_LOCKED.png` (original standalone render; use as-is, do not convert to WebP or crop)
- Superseded: `assets/tfy_canon.webp` (old runtime crop with baked-in compression damage; do not use or revert to it)
- The Northampton fulfilment map (`/BANANA.EXE/07 Future Northampton/S02_MAP_02B_NORTHAMPTON_FULFILLMENT_LOCKED.png`) remains the map authority for the later local-partner reveal, not the building's runtime source.

Rule:
- Blue facade / blue door surround.
- Neutral/light TFY lettering, not gold.
- When the delivery map represents the destination, TFY is a recognizable building, not merely a generic dot.
- Label clearly as TFY / NORTHAMPTON.

### TFY rooftop receiving basket

STATUS: PENDING REPLACEMENT — do not implement.
- `assets/part2/TFY_ROOFTOP_RECEIVING_BASKET_LOCKED.png` was marked locked prematurely; it is too detailed for the map scale and will be replaced by a simpler, chunkier map-scale version before implementation.

Rule (for the replacement):
- This is the receiving target for the explanatory HOME → TFY banana micro-animation.
- Composite it onto the canonical TFY building (`assets/locations/S02_TFY_BUILDING_LOCKED.png`); do not redraw or replace the TFY building.
- The banana should visibly drop inside the basket.

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

## Vehicles and delivery props

### Valenté yellow car

LOCKED runtime authority:
- `assets/VALENTE_YELLOW_CAR_LOCKED.png`

Rule:
- This is the canonical vehicle Valenté drives.
- Preserve the simplified cubed/boxy 3D asset language used by the buildings and map objects.
- Do not substitute a more realistic or more detailed vehicle.

### Trebutech delivery truck

LOCKED runtime authority:
- `assets/part2/TREBUTECH_DELIVERY_TRUCK_LOCKED.png`

LOCKED brand treatment:
- Brand name: **TREBUTECH**.
- Tagline: **Your Medieval Needs Modernized**.
- Trebuchet outline/logo is derived from the locked launcher silhouette.
- Highly silver/chrome body with restrained blue/cyan accents.
- Simplified cubed 3D form consistent with the other world assets.

Rule:
- This truck communicates the rented trebuchet delivery to HOME.
- Do not show a newly invented trebuchet on or inside the truck.
- Do not redraw the truck into a realistic conventional lorry/van.

### DenorD drone-delivery box — Part 3

LOCKED future runtime authority:
- `assets/part3/DENORD_DRONE_BOX_LOCKED.png`

LOCKED brand treatment:
- Brand name: **DenorD**.
- Tagline: **Just Drone it**.

Rule:
- This is the branded package to be carried/delivered by the Part 3 drone delivery method.
- Preserve the exact locked box design when Part 3 is built.

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
