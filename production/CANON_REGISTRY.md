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

STATUS: PENDING REPLACEMENT — do not implement. Runtime keeps empty basket hooks on the TFY roof (Delivery Problem map and Attempt 01 flight map) ready for the corrected asset.
- `assets/part2/TFY_ROOFTOP_RECEIVING_BASKET_LOCKED.png` was marked locked prematurely; it is too detailed for the map scale and will be replaced by a simpler, chunkier map-scale version before implementation.

Rule (for the replacement):
- This is the receiving target for the explanatory HOME → TFY banana micro-animation.
- Composite it onto the canonical TFY building (`assets/locations/S02_TFY_BUILDING_LOCKED.png`); do not redraw or replace the TFY building.
- The banana should visibly drop inside the basket.

### MAP 02A — local Nottingham

LOCKED map authority:
- `assets/MAP_02A_NOTTINGHAM_PROCUREMENT_LOCKED.png` (1448 × 1086 sheet)

World rule:
- MAP 02A is canonical local Nottingham. Never redraw, rebuild, recolour or re-route it; HOME and Banana Boutique never move and the roads are never redrawn.
- The Part 2 Nottingham world is HOME, Banana Boutique, the Royal Snail post office and the Royal Snail drop box.
- New services are added only as overlays at approved positions, sharing the map's dimming.
- The Trebutech truck reaches the actual HOME: down the existing street past the junction onto the road beside HOME's block (sheet ≈ x 296, y 351), not the neighbouring block.
- The baked Part 1 cyan route may be recessed in Part 2 by a non-destructive overlay; the file stays untouched.
- Trebutech is **not** on MAP 02A and not in Nottingham.

### Royal Snail (postal service) — Nottingham

Runtime assets:
- `assets/locations/ROYAL_SNAIL_POST_OFFICE_LOCKED.png` — SHA-256 `a5c36c9baf7426e94f69f3aa8fe1f17313eb10a6b88bc26712773eb4418cc55f`
- `assets/locations/ROYAL_SNAIL_DROP_BOX_LOCKED.png` — SHA-256 `d02d22bd23c269931430123a709b82dad3ea33ff97d9d5a470258f917e92e21e`

LOCKED brand treatment:
- Deep red, navy and restrained gold; crowned snail mark.

Approved MAP 02A placement (sheet pixels):
- Post office: `x 529.93, y 118.27, 138.55 × 138.55` — fully covers the map's generic corner building.
- Drop box: `x 298.86, y 294.92, 33.36 × 33.36` — at the junction. **INTERIM ONLY** (review decision 2026-10-06): the simple drop box is not strong enough as Royal Snail's neighbourhood presence and is not the final world treatment.

PENDING DESIGN — neighbourhood presence: a small **self-serve postal kiosk / micro-depot** — more than a box, self-service, suitable for small/basic postal requests, still obviously not where you would confidently put a banana you care about, compact enough to stay a neighbourhood service. Optional later cues: a tiny postal bike or a tiny Royal Snail vehicle. Same brand rules (deep red, navy, restrained gold, crowned snail). Do not invent it in code; runtime keeps one swappable slot (`ROYAL_SNAIL_NEIGHBOURHOOD` in `transition.js`) that takes the locked kiosk file and its MAP 02A placement when it exists. The post office/store remains valid.
- Secondary during the Trebutech arrival; may be modestly dimmed with the map.

Selector card: `ROYAL SNAIL` / `UNAVAILABLE` stamp / `TOO SLOW` (greyed; never the result).

### Trebutech Rental & Dispatch — regional origin

LOCKED runtime authority:
- `assets/locations/TREBUTECH_RENTAL_DISPATCH_BUILDING_LOCKED.png` (1254 × 1254 RGBA) — SHA-256 `ad830e9f0385ef4d5b9044d04b2066ec2890a07ec552da24a64dbc4977ca0c09`

Rule:
- A regional origin somewhere in the wider world; **no named city**; never on MAP 02A or in Nottingham; not placed permanently on the regional map (only the journey edge label `TREBUTECH` / `RENTAL & DISPATCH`).
- Do not raise the shutter, redraw signage, add cargo, add a trebuchet or add a city name.
- The base-exit portal is a separate system layer; it is never baked into this render.

### Leicester

Current role:
- Attempt 01 failure/landing location.

Rule:
- Leicester never appears (map label, pin or copy) before Attempt 01 fails there.
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
- `assets/vehicles/source/VALENTE_YELLOW_CAR_LOCKED.png`

Rule:
- This is the canonical vehicle Valenté drives.
- Preserve the simplified cubed/boxy 3D asset language used by the buildings and map objects.
- Do not substitute a more realistic or more detailed vehicle.

### Trebutech delivery truck

LOCKED runtime authority:
- `assets/part2/vehicles/source/TREBUTECH_DELIVERY_TRUCK_LOCKED.png`

LOCKED brand treatment:
- Brand name: **TREBUTECH**.
- Tagline: **Your Medieval Needs Modernized**.
- Trebuchet outline/logo is derived from the locked launcher silhouette.
- Highly silver/chrome body with restrained blue/cyan accents.
- Simplified cubed 3D form consistent with the other world assets.

Rule:
- This truck communicates the rented trebuchet delivery to HOME.
- Do not show a newly invented trebuchet on or inside the truck; no cargo.
- Never mirror or recolour it. Runtime-only matte, mask, contact shadow and a separate threshold-light band are allowed; its pixels are never altered.
- Do not redraw the truck into a realistic conventional lorry/van.

### Banana Boutique delivery truck

LOCKED runtime authority:
- `assets/vehicles/source/BANANA_BOUTIQUE_DELIVERY_TRUCK_LOCKED.png`

Role:
- Shared world / brand logistics asset for Banana Boutique.
- Black, gold and restrained olive luxury treatment.
- May appear in travel, map and world-building beats where Banana Boutique logistics are appropriate.

Rule:
- Not a player delivery-method option.
- Must not replace the Trebutech truck in the Part 2 rental/delivery sequence.
- Use the exact locked asset; do not redraw or restyle it.

## Systems

### Vehicle base portal

LOCKED system visual (see `product.md` → Vehicle portal system for the rule and timing):
- `assets/systems/vehicle-portal/VEHICLE_BASE_PORTAL_OPEN_LOCKED.svg` (SHA-256 `0be68b885b0d10034c32ae870a76590c3b1981ade8b2269d71e118a903b6fdd2`) — implementation source, animated through its named groups at runtime.
- `assets/systems/vehicle-portal/VEHICLE_BASE_PORTAL_OPEN_REFERENCE_LOCKED.png` (SHA-256 `d6000479b74d80a0805bbe84fbed45e76c5fe800397007b5d3f767353a20decf`) — reference only.

Rule:
- System cyan/aqua only; never brand-coloured, never redrawn in CSS/canvas, never baked into a building render.
- Base exit/return only. No portal at a destination (no HOME portal on the Trebutech delivery).

## Vehicles and delivery props (Part 3)

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
