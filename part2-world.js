/* BANANA.EXE — Part 2 shared world authority (boards 10–12).
   One source of truth used by the Delivery Problem map and the Attempt 01 flight map:
   - the locked Board 10 flight-region package (eight SVG layers + the review manifest), mounted exactly as supplied;
   - MAP 02A's isometric ground projection;
   - the HOME launch cluster (board 11 scale rule, locked cutouts, cradle = exact launch origin);
   - the TFY rooftop basket hook (placeholder only — no basket art until one is designed, reviewed and locked);
   - Royal Snail's swappable neighbourhood slot on MAP 02A.
   Locked art is only placed, scaled and lit; never edited, regenerated or mirrored. */
(() => {
  const BX = window.BX;

  // ---------- Board 10 flight-region package (assets/part2/attempt01/flight-region/) ----------
  // The eight SVG layers are LOCKED production artwork. The manifest is NOT locked (camera timing is reviewable).
  const MANIFEST_SRC = 'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_MANIFEST.json';
  const LAYER_FILES = [
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L01_GROUND_LOCKED.svg',
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L02_FIELDS_HEDGEROWS_LOCKED.svg',
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L03_RIVERS_LOCKED.svg',
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L04_TOWN_GLOW_LOCKED.svg',
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L05_ROADS_MOTORWAY_LOCKED.svg',
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L06_STREETLIGHTS_LOCKED.svg',
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L07_PARKS_WOODS_LOCKED.svg',
    'assets/part2/attempt01/flight-region/A01_FLIGHT_REGION_L08_TOWN_BLOCKS_WINDOWS_LOCKED.svg',
  ];

  // ---------- World: MAP 02A sheet pixels are world units (manifest → coordinates) ----------
  // Ground (u, v) uses MAP 02A's isometric axes: +u up-right (0.916, −0.4), +v up-left (−0.916, −0.4); origin sheet (240, 430).
  const OX = 240, OY = 430;
  const P = (u, v) => [OX + 0.916 * (u - v), OY - 0.4 * (u + v)];
  const G = (x, y) => { const a = (x - OX) / 0.916, b = (OY - y) / 0.4; return [(a + b) / 2, (b - a) / 2]; };

  // ---------- HOME launch cluster (board 11) ----------
  // Scale rule: Valenté 1 : trebuchet ≈ 1.45 (plate 04) : HOME ≈ 3 Valenté tall (map convention, intentionally compressed).
  // Order left → right: HOME → Valenté (operator side, rear-left, never over the barrel or cradle) → trebuchet → launch direction.
  const CLUSTER = {
    scale: { valente: 1, launcher: 1.45, home: 3 },
    launcher: { src: 'assets/launcher.png', img: [1536, 1024], bbox: [26, 12, 1510, 1000], cradle: [1452, 92] },
    poses: { // locked cutouts, never mirrored
      flight: { src: 'assets/part2/03_goggles_on_ready_LOCKED.png', img: [1024, 1536], bbox: [0, 19, 1016, 1505] }, // just fired it
      problem: { src: 'assets/skeptical_locked.png', img: [414, 767], bbox: [0, 0, 414, 767] },              // sizing up the problem
    },
  };
  // Place the cluster from two ground contact points and Valenté's height (vu) in the target map's units.
  function placeCluster({ launcherGround: lg, valenteGround: vg, vu, pose }) {
    const L = CLUSTER.launcher, V = CLUSTER.poses[pose];
    const ls = (CLUSTER.scale.launcher * vu) / (L.bbox[3] - L.bbox[1]);
    const launcher = { x: lg[0] - ((L.bbox[0] + L.bbox[2]) / 2) * ls, y: lg[1] - L.bbox[3] * ls, w: L.img[0] * ls, h: L.img[1] * ls, src: L.src };
    const vs = vu / (V.bbox[3] - V.bbox[1]);
    const valente = { x: vg[0] - ((V.bbox[0] + V.bbox[2]) / 2) * vs, y: vg[1] - V.bbox[3] * vs, w: V.img[0] * vs, h: V.img[1] * vs, src: V.src };
    return {
      launcher, valente, cradle: [launcher.x + L.cradle[0] * ls, launcher.y + L.cradle[1] * ls],
      shadows: { launcher: { cx: lg[0], cy: lg[1] - 1, rx: (L.bbox[2] - L.bbox[0]) * ls * 0.42 }, valente: { cx: vg[0], cy: vg[1] - 0.5, rx: valente.w * 0.42 } },
      ls, vs,
    };
  }

  // ---------- TFY rooftop basket hook: ONE position authority for both maps ----------
  // Fraction of the locked TFY render (1254²): the flat roof, left of the vent unit. Placeholder only — the earlier
  // assets/part2/TFY_ROOFTOP_RECEIVING_BASKET_LOCKED.png was rejected as too detailed for map scale and is NOT used.
  const TFY = { src: 'assets/locations/S02_TFY_BUILDING_LOCKED.png', img: 1254, roofHook: [0.447, 0.27], basket: null /* future locked basket asset */ };
  const tfyHook = (box) => [box.x + TFY.roofHook[0] * box.s, box.y + TFY.roofHook[1] * box.s];

  // ---------- Royal Snail neighbourhood presence on MAP 02A: ONE swappable slot ----------
  // The drop box is INTERIM. When the self-serve kiosk / micro-depot (board 13 direction) is rendered and LOCKED,
  // point `src` at it and give its approved sheet-pixel placement here; both MAP 02A uses pick it up.
  const ROYAL_SNAIL_NEIGHBOURHOOD = { status: 'interim', src: 'assets/locations/ROYAL_SNAIL_DROP_BOX_LOCKED.png', x: 298.86, y: 294.92, w: 33.36, h: 33.36 };
  const ROYAL_SNAIL_STORE = { src: 'assets/locations/ROYAL_SNAIL_POST_OFFICE_LOCKED.png', x: 529.93, y: 118.27, w: 138.55, h: 138.55 };

  // ---------- Manifest + layer loading ----------
  let manifest = null;
  const layerText = {};
  const ready = (async () => {
    try { manifest = await (await fetch(MANIFEST_SRC)).json(); } catch (e) { manifest = null; }
    await Promise.all(LAYER_FILES.map(async (f) => { try { layerText[f] = await (await fetch(f)).text(); } catch (e) { layerText[f] = null; } }));
    return manifest;
  })();
  // Layers in the manifest's order, each placed at its declared world rectangle. The SVG text is inserted as supplied;
  // only its element ids are namespaced per mount so two maps can show the region at once.
  let mounts = 0;
  function mountRegion(holder) {
    if (!manifest) return false;
    const at = manifest.coordinates.place_each_layer_at, pfx = `rg${++mounts}-`;
    holder.textContent = '';
    for (const L of manifest.layer_order_bottom_to_top) {
      const path = LAYER_FILES.find((f) => f.endsWith('/' + L.file)), txt = path && layerText[path];
      if (!txt) continue;
      const ids = [...txt.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
      let t = txt;
      for (const id of ids) t = t.split(`id="${id}"`).join(`id="${pfx}${id}"`).split(`url(#${id})`).join(`url(#${pfx}${id})`);
      const wrap = document.createElement('div');
      wrap.innerHTML = t;
      const svg = wrap.querySelector('svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.dataset.layer = L.file; svg.dataset.order = L.order;
      Object.assign(svg.style, { position: 'absolute', left: `${at.x}px`, top: `${at.y}px`, width: `${at.width}px`, height: `${at.height}px`, overflow: 'visible', pointerEvents: 'none' });
      holder.appendChild(svg);
    }
    return true;
  }

  // Runtime rasterisation for a MOVING camera (the manifest allows it: "rasterise at runtime scale if needed"). The unchanged
  // layer files are drawn once, in manifest order, into canvas tiles covering the declared world rectangle at `rs` backing
  // pixels per world unit, so a zooming camera samples a texture instead of re-rasterising eight vector layers every frame.
  // Nothing is edited: each tile is the browser's own rendering of the supplied SVG files, stacked as the manifest says.
  async function rasterRegion(holder, rs) {
    if (!manifest) return false;
    const at = manifest.coordinates.place_each_layer_at, W = Math.round(at.width * rs), H = Math.round(at.height * rs), TILE = 2048, OV = 2;
    const layers = [];
    for (const L of manifest.layer_order_bottom_to_top) {
      const path = LAYER_FILES.find((f) => f.endsWith('/' + L.file)), txt = path && layerText[path];
      if (!txt) continue;
      const url = URL.createObjectURL(new Blob([txt], { type: 'image/svg+xml' })), im = new Image();
      im.src = url;
      try { await im.decode(); } catch (e) { URL.revokeObjectURL(url); continue; }
      layers.push({ L, im, url });
    }
    const tiles = [];
    for (let ty = 0; ty < H; ty += TILE) for (let tx = 0; tx < W; tx += TILE) {
      const cw = Math.min(TILE + OV, W - tx), ch = Math.min(TILE + OV, H - ty), c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      const ctx = c.getContext('2d');
      for (const { im } of layers) ctx.drawImage(im, -tx, -ty, W, H);
      Object.assign(c.style, { position: 'absolute', left: `${at.x + tx / rs}px`, top: `${at.y + ty / rs}px`, width: `${cw / rs}px`, height: `${ch / rs}px`, pointerEvents: 'none' });
      tiles.push(c);
      await new Promise((ok) => setTimeout(ok, 0)); // keep the setup beats responsive between tiles
    }
    layers.forEach(({ url }) => URL.revokeObjectURL(url));
    holder.textContent = '';
    tiles.forEach((c) => holder.appendChild(c));
    holder.dataset.layers = layers.map(({ L }) => L.order).join();
    holder.dataset.files = layers.map(({ L }) => L.file).join(' ');
    holder.dataset.rs = rs;
    return layers.length === manifest.layer_order_bottom_to_top.length;
  }

  BX.p2World = {
    P, G, CLUSTER, placeCluster, TFY, tfyHook, ROYAL_SNAIL_NEIGHBOURHOOD, ROYAL_SNAIL_STORE,
    LAYER_FILES, MANIFEST_SRC, ready, manifest: () => manifest, mountRegion, rasterRegion,
  };
})();
