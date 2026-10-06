/* BANANA.EXE — Part 2 opening: delivery-method selector → Trebutech origin + base-exit portal → regional journey →
   MAP 02A → HOME → rental charge → Delivery Problem.
   Authority: product.md (Current Part 2 flow, Vehicle portal system), production/PART2_TRANSITION_ASSET_CHECKPOINT.md,
   production/CANON_REGISTRY.md, and the approved "Part 2 UI Refinement" boards 01 / 05 / 08 / 09.
     selector: ROYAL SNAIL (unavailable) · TREBUCHET · ? ? ?  → deterministic 17-step cycle → TREBUCHET LOCKED IN →
     Trebutech Rental & Dispatch (regional origin, no city) → the truck pulls out of the bay → the locked base-exit portal
     forms, the truck crosses it, it closes → camera pulls back onto the regional journey → push into Nottingham →
     the same truck continues on MAP 02A → HOME (ring + glow, no portal) → TREBUCHET RENTAL − £15.00 → live budget.
   Locked art (facility, truck, HOME, MAP 02A, Royal Snail, portal SVG) is only placed, moved, scaled, masked and lit —
   never edited. The truck render has a black field: a runtime silhouette matte sits under it and the render composites
   with `lighten`, so its own pixels show unchanged. The portal is the exact locked SVG, animated through its groups.
   One rAF loop on a game clock that stops while paused, like Attempt 01. */
(() => {
  const { $, show, tone, noise, audio } = window.BX;
  const TRUCK_SRC = 'assets/part2/vehicles/source/TREBUTECH_DELIVERY_TRUCK_LOCKED.png';
  const PORTAL_SRC = 'assets/systems/vehicle-portal/VEHICLE_BASE_PORTAL_OPEN_LOCKED.svg';

  // ---------- Configuration ----------
  const SNAIL_ICON = '<svg viewBox="0 0 140 96" aria-hidden="true"><path d="M14 80 C14 72 30 68 46 68 L104 68 C116 68 121 60 123 50 L125 41 C126 37 130 37 131 41 C133 50 132 62 126 71 C120 79 110 84 96 84 L24 84 C18 84 14 83 14 80 Z" fill="#c8323a"/><path d="M121 45 L116 22 M128 43 L134 21" stroke="#c8323a" stroke-width="4" stroke-linecap="round"/><circle cx="116" cy="20" r="4.5" fill="#c8323a"/><circle cx="134" cy="19" r="4.5" fill="#c8323a"/><circle cx="70" cy="50" r="29" fill="#13284a" stroke="#e2b04a" stroke-width="3"/><path d="M70 50 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 0 1 8 -8 a12 12 0 0 1 12 12 a16 16 0 0 1 -16 16 a20 20 0 0 1 -20 -20" fill="none" stroke="#e2b04a" stroke-width="3" stroke-linecap="round"/><path d="M57 22 L58.5 9 L65 15 L70 5 L75 15 L81.5 9 L83 22 Z" fill="#e2b04a"/><rect x="57" y="20" width="26" height="4" rx="1" fill="#e2b04a"/></svg>';
  // Slots left → right. Royal Snail is shown but unavailable; the third slot stays unrevealed (no hint of what it is).
  const DELIVERY_OPTIONS = [
    { key: 'royal-snail', label: 'ROYAL SNAIL', sub: 'TOO SLOW', stamp: 'UNAVAILABLE', available: false },
    { key: 'trebuchet', label: 'TREBUCHET', icon: 'assets/launcher.png', available: true },
    { key: null, label: null },
  ];
  const RESULT = 'trebuchet';
  const RENTAL = { label: 'TREBUCHET RENTAL', cost: 15 };
  const T = { fadeIn: 300, cycleAt: 700, steps: 17, firstGap: 70, lastGap: 470, lockHold: 1400 }; // selector (ms)
  // orientation beat (review correction): the wider regional map first, then a push from the map into the facility (ms)
  const OR = { fadeIn: 300, hold: 1900, push: 1700 };
  const DEP = 5600; // origin beat: pull away → portal forms → crossing → portal closes → pull-back (ms)
  // origin beat cues, as fractions of DEP (board 09): 0.7 s seed · 1.0 s edges meet · 1.4 s open · 2.4–3.4 s crossing ·
  // 3.9 s contracting · 4.4 s gone · 5.6 s on the regional journey
  const DT = { go: 0.04, seed0: 0.10, seed1: 0.14, edge0: 0.13, edge1: 0.20, mem0: 0.18, mem1: 0.24, through: 0.62, close0: 0.64, close1: 0.76, pull0: 0.78 };
  // journey → MAP 02A → HOME → receipt (ms from the end of the origin beat; board 05)
  const TR = { RDRIVE: 7000, ACC: 500, PUSH0: 2500, PUSH1: 3400, DIS0: 3100, DIS1: 3500, M0: 3000, M1: 5600, C0: 3400, C1: 5600,
    H0: 3000, H1: 3600, ARRIVE: 600, HOLD: 700, chargeIn: 380, budgetAt: 450, CUT: 8900 };

  // Royal Snail's neighbourhood presence on MAP 02A: ONE swappable slot. The drop box is INTERIM; when the locked
  // self-serve kiosk / micro-depot exists, point `src` at it and give its approved sheet-pixel placement here.
  const ROYAL_SNAIL_NEIGHBOURHOOD = { status: 'interim', src: 'assets/locations/ROYAL_SNAIL_DROP_BOX_LOCKED.png', x: 298.86, y: 294.92, w: 33.36, h: 33.36 };

  // ---------- DOM ----------
  const status = $('#dl-status'), select = $('#dl-select'), options = $('#dl-options'), pointer = $('#dl-pointer');
  const stage = $('#dl-stage');
  const receipt = $('#dl-receipt'), remaining = $('#dl-remaining'), live = $('#dl-live');
  const el = (id) => document.getElementById(id);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const ramp = (t, a, b) => clamp((t - a) / (b - a));
  const sine = (k) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(k));
  const outCubic = (k) => 1 - Math.pow(1 - clamp(k), 3);
  const money = (n) => `${n < 0 ? '−' : ''}£${Math.abs(n).toFixed(2)}`;
  const announce = (text) => { live.textContent = ''; live.textContent = text; };
  const f1 = (v) => v.toFixed(1), f3 = (v) => v.toFixed(3);

  // Cards are built from the configuration.
  const cards = DELIVERY_OPTIONS.map((o, i) => {
    const c = document.createElement('div');
    c.className = 'dl-card' + (o.key === 'royal-snail' ? ' is-royal' : o.label ? '' : ' is-unknown');
    c.dataset.index = i; if (o.key) c.dataset.key = o.key;
    if (o.key === 'royal-snail') {
      c.innerHTML = `<span class="dl-royal-stripe" aria-hidden="true"></span><span class="dl-royal-icon">${SNAIL_ICON}</span>`
        + `<b class="dl-card-label">${o.label}</b><span class="dl-card-sub">${o.sub}</span><span class="dl-stamp">${o.stamp}</span>`;
    } else if (o.label) {
      c.innerHTML = `<span class="dl-card-icon"><img src="${o.icon}" alt="" /></span><b class="dl-card-label">${o.label}</b>`
        + '<span class="dl-chip"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5 L5 9.2 L10 3" /></svg>LOCKED IN</span>';
    } else {
      c.innerHTML = '<span class="dl-unknown-mark" aria-hidden="true">?</span><b class="dl-card-label" aria-label="Option not yet revealed">? ? ?</b>';
    }
    options.appendChild(c);
    return c;
  });
  const resultIndex = DELIVERY_OPTIONS.findIndex((o) => o.key === RESULT);
  // Part 1's ending shows the same three slots (nothing selected), so it hands straight into this selector.
  const teaserOptions = document.getElementById('t-options');
  if (teaserOptions) cards.forEach((c) => { const t = c.cloneNode(true); t.querySelector('.dl-chip')?.remove(); t.setAttribute('aria-hidden', 'true'); teaserOptions.appendChild(t); });
  (() => {
    const rs = document.getElementById('dl-rs-local'), n = ROYAL_SNAIL_NEIGHBOURHOOD;
    rs.src = n.src; rs.dataset.status = n.status;
    Object.assign(rs.style, { left: `${n.x}px`, top: `${n.y}px`, width: `${n.w}px`, height: `${n.h}px` });
  })();

  // Deterministic schedule: `steps` highlights with gaps growing fast → slow, ending on the RESULT card.
  const schedule = (() => {
    const out = []; let t = T.cycleAt;
    const start = ((resultIndex - (T.steps - 1)) % cards.length + cards.length) % cards.length;
    for (let i = 0; i < T.steps; i++) {
      const u = i / (T.steps - 1), gap = T.firstGap + (T.lastGap - T.firstGap) * u * u * u;
      out.push({ t, index: (start + i) % cards.length }); t += gap;
    }
    return out;
  })();
  const lockAt = schedule[schedule.length - 1].t + T.lastGap * 0.6;
  function placePointer(i, locked) {
    const c = cards[i];
    pointer.style.left = `${f1(c.offsetLeft + c.offsetWidth / 2 - 14)}px`;
    pointer.style.top = `${f1(c.offsetTop - 33)}px`;
    pointer.style.opacity = '1';
    pointer.classList.toggle('is-locked', !!locked);
  }

  // ---------- Runtime truck matte: border-connected near-black → transparent, everything else opaque (file untouched) ----------
  let matteURL = '';
  const mattes = ['dl-reg-matte', 'dl-map-matte', 'dl-back-matte', 'dl-front-matte', 'dl-hand-matte'].map(el);
  (() => {
    const im = new Image();
    im.onload = () => {
      try {
        const W = im.naturalWidth, H = im.naturalHeight, cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, W, H), px = d.data, N = W * H, bg = new Uint8Array(N), stack = new Int32Array(N);
        const dark = (i) => Math.max(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) <= 6;
        let sp = 0;
        const push = (i) => { if (!bg[i] && dark(i)) { bg[i] = 1; stack[sp++] = i; } };
        for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
        for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
        while (sp) {
          const i = stack[--sp], x = i % W;
          if (x > 0) push(i - 1);
          if (x < W - 1) push(i + 1);
          if (i >= W) push(i - W);
          if (i < N - W) push(i + W);
        }
        for (let i = 0; i < N; i++) { const o = i * 4; px[o] = px[o + 1] = px[o + 2] = 0; px[o + 3] = bg[i] ? 0 : 255; }
        g.putImageData(d, 0, 0);
        cv.toBlob((b) => {
          if (!b) return;
          matteURL = URL.createObjectURL(b);
          mattes.forEach((m) => { m.src = matteURL; });
          ['dl-band', 'dl-band-glow'].forEach((id) => { const e = el(id); e.style.webkitMaskImage = e.style.maskImage = `url(${matteURL})`; });
        });
      } catch (e) { /* no matte: the truck still composites with lighten */ }
    };
    im.src = TRUCK_SRC;
  })();

  // ---------- Base-exit portal: the exact locked SVG, inlined twice (road spill under the truck, aperture between its parts) ----------
  const portal = { spill: null, main: null };
  (async () => {
    try {
      const txt = await (await fetch(PORTAL_SRC)).text();
      const mount = (holder, prefix) => {
        holder.innerHTML = txt.replace(/id="(pglow|pmem|pspill)"/g, `id="${prefix}$1"`).replace(/url\(#(pglow|pmem|pspill)\)/g, `url(#${prefix}$1)`);
        const svg = holder.querySelector('svg'); svg.removeAttribute('width'); svg.removeAttribute('height');
        svg.setAttribute('aria-hidden', 'true');
        const q = (sel) => svg.querySelector(sel);
        return { svg, root: q('#portal'), base: q('#portal').getAttribute('transform'), spill: q('#portal-spill'), seed: q('#portal-threshold'),
          mem: q('#portal-membrane'), rings: q('#portal-rings'), collar: q('#portal-collar'), anchors: q('#portal-anchors'),
          scaled: ['#portal-membrane', '#portal-rings', '#portal-collar', '#portal-glow', '#portal-edge', '#portal-anchors'].map(q),
          strokes: [...svg.querySelectorAll('#portal-glow path, #portal-edge path')], lips: [...svg.querySelectorAll('#portal-edge path[stroke="#eaffff"]')] };
      };
      portal.spill = mount(el('dl-portal-spill'), 'dls-'); portal.spill.root.style.display = 'none';
      portal.main = mount(el('dl-portal-main'), 'dlm-'); portal.main.spill.style.display = 'none';
      [portal.spill, portal.main].forEach((p) => { p.svg.style.opacity = '0'; });
    } catch (e) { /* portal unavailable: the truck still drives out */ }
  })();

  // ---------- Origin geometry (board 09): building render camera, per-unit ground axes and height ----------
  const G = (() => {
    const O = [619.668, 936.331], DA = [-7.2458, -3.1700], DB = [7.2458, -3.1700], UP = 7.9013;
    const BS = 560, BX = -30, BY = -58, KB = BS / 1254;
    const img = (a, b, h = 0) => [O[0] + a * DA[0] + b * DB[0], O[1] + a * DA[1] + b * DB[1] - h * UP];
    const F = (a, b, h = 0) => { const p = img(a, b, h); return [BX + p[0] * KB, BY + p[1] * KB]; };
    // base boundary: the threshold plane sits across the exit road past the apron edge (−27) and bollards
    const AP = -50, TL = 30, BN = 22.5, HT = 21;
    const REAR = [272, 672], TS = 1254 * 0.2863 * KB; // truck sprite rear-centre ground point; drawn size
    return { KB, F, AP, TL, BN, HT, REAR, TS, J0: [12, 244.8], J0S: 106.4 };
  })();
  // static origin layout
  (() => {
    const P = (pts) => pts.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' '), F = G.F;
    el('dl-dep-road').setAttribute('points', P([F(-25, 12.5), F(-25, 52), F(-300, 52), F(-300, 12.5)]));
    const l0 = F(-27, 32), l1 = F(-300, 32);
    el('dl-dep-lane').setAttribute('d', `M${f1(l0[0])} ${f1(l0[1])} L${f1(l1[0])} ${f1(l1[1])}`);
    const pm = F(G.AP, 0, 0);
    ['dl-portal-spill', 'dl-portal-main'].forEach((id) => Object.assign(el(id).style, {
      left: `${f1(pm[0] - 68 * G.KB)}px`, top: `${f1(pm[1] - 415 * G.KB)}px`, width: `${f1(600 * G.KB)}px`, height: `${f1(450 * G.KB)}px` }));
  })();
  // rear-centre distance out of the bay (building units): eases away, accelerates through the threshold, eases in the pull-back
  const UR = -G.AP, UV = 2 * (UR - 1) / (DT.through - DT.go);
  function uAtDep(t) {
    if (t <= DT.go) return 1;
    if (t <= DT.through) { const x = (t - DT.go) / (DT.through - DT.go); return 1 + (UR - 1) * x * x; }
    if (t <= DT.pull0) return UR + UV * (t - DT.through);
    const D = 1 - DT.pull0, x = (t - DT.pull0) / D;
    return UR + UV * (DT.pull0 - DT.through) + UV * D * (x - x * x / 2);
  }
  const hull = (pts) => {
    pts = pts.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of pts.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  };

  // ---------- Journey path (board 05): Trebutech dispatch (map edge) → approach road → beside HOME ----------
  const J = (() => {
    const P = [[-1230, 150], [-900, 150], [-560, 271], [-203, 329]], pts = [];
    for (let i = 0; i <= 64; i++) {
      const t = i / 64, m = 1 - t;
      pts.push([m * m * m * P[0][0] + 3 * m * m * t * P[1][0] + 3 * m * t * t * P[2][0] + t * t * t * P[3][0], m * m * m * P[0][1] + 3 * m * m * t * P[1][1] + 3 * m * t * t * P[2][1] + t * t * t * P[3][1]]);
    }
    for (let i = 1; i <= 16; i++) pts.push([-203 + 703 * i / 16, 329 + 114 * i / 16]);
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, cum, L: cum[cum.length - 1] };
  })();
  function atJ(sv) {
    sv = clamp(sv, 0, J.L);
    let i = 1; while (i < J.cum.length - 1 && J.cum[i] < sv) i++;
    const a = J.cum[i - 1], b = J.cum[i], q = b > a ? (sv - a) / (b - a) : 0;
    return { x: J.pts[i - 1][0] + (J.pts[i][0] - J.pts[i - 1][0]) * q, y: J.pts[i - 1][1] + (J.pts[i][1] - J.pts[i - 1][1]) * q, i };
  }
  function trailFrom(sv) {
    if (sv + 127 >= J.L) return 'M500 443 L500 443';
    const n = atJ(sv + 127);
    let d = `M${f1(n.x)} ${f1(n.y)}`;
    for (let i = n.i; i < J.pts.length; i++) d += ` L${f1(J.pts[i][0])} ${f1(J.pts[i][1])}`;
    return d;
  }
  const JV = J.L / (TR.RDRIVE - TR.ACC / 2 - 450);
  const jDist = (t) => (t <= 0 ? 0 : t < TR.ACC ? JV * t * t / (2 * TR.ACC) : Math.min(J.L, JV * (t - TR.ACC / 2)));
  // MAP 02A (sheet px): the existing diagonal street past HOME's block; the truck enters at the map frame's left edge
  // HOME_DELIVERY_STOP — the canonical delivery stop for HOME on MAP 02A (sheet px, truck wheel-contact point): the road
  // along HOME's lit side, immediately beside the HOME building and its HOME marker (CANON_REGISTRY → MAP 02A). Every
  // delivery to HOME reuses it. The truck enters from the map frame's left edge along that road; its heading
  // (atan 0.4375 ≈ 23.6°) matches the locked render's own, so no rotation or mirroring is needed.
  const HOME_DELIVERY_STOP = { x: 120, y: 480 };
  const MPATH = [[0, HOME_DELIVERY_STOP.y - HOME_DELIVERY_STOP.x * 0.4375], [HOME_DELIVERY_STOP.x, HOME_DELIVERY_STOP.y]], SPR = 86, CXF = 0.45, CYF = 0.86;
  const MSEG = MPATH.slice(1).map((p, i) => Math.hypot(p[0] - MPATH[i][0], p[1] - MPATH[i][1])), ML = MSEG.reduce((a, b) => a + b, 0);
  function mapAt(d) { // point + heading (deg) at distance d along MPATH (extends past the end along the last segment)
    let i = 0; while (i < MSEG.length - 1 && d > MSEG[i]) { d -= MSEG[i]; i++; }
    const a = MPATH[i], b = MPATH[i + 1], q = d / MSEG[i];
    return { x: a[0] + (b[0] - a[0]) * q, y: a[1] + (b[1] - a[1]) * q, deg: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI };
  }
  // camera: opens wide on MAP 02A at the street entry, then pushes to a HOME framing (HOME, the stop and the HOME marker)
  function mapCam(c) { const k0 = 0.75, k1 = 1.35, k = k0 * Math.pow(k1 / k0, c), w = (k - k0) / (k1 - k0); return { k, tx: 253 + (216 - 253) * w - 200 * k, ty: 317.5 + (230 - 317.5) * w - 330 * k }; }
  const uAtMap = (t) => outCubic((t - TR.M0) / (TR.M1 - TR.M0)), camAt = (t) => sine((t - TR.C0) / (TR.C1 - TR.C0)), zAt = (t) => sine((t - TR.PUSH0) / (TR.PUSH1 - TR.PUSH0));
  function mapPose(t) { const { k, tx, ty } = mapCam(camAt(t)); const m = mapAt(ML * uAtMap(t)); return { x: (m.x - CXF * SPR) * k + tx, y: (m.y - CYF * SPR) * k + ty, s: SPR * k }; }
  const TGT = (t) => { const m = mapPose(t); return { x: m.x + m.s / 2, y: m.y + m.s / 2 }; }; // the push delivers the truck onto the map truck
  function regCam(t) {
    const z = zAt(t), c = atJ(jDist(t)), k = 0.4 * Math.pow(1.25, z);
    const wx = c.x * 0.4 + 504, wy = c.y * 0.4 + 184.8, g = TGT(t);
    return { z, c, k, tx: wx + (g.x - wx) * z - c.x * k, ty: wy + (g.y - wy) * z - c.y * k };
  }
  function regPose(t) { const r = regCam(t); return { x: (r.c.x - 133) * r.k + r.tx, y: (r.c.y - 133) * r.k + r.ty, s: 266 * r.k }; }

  // ---------- Audio (shared SFX bus via BX.tone / BX.noise / BX.sfxOut, so SOUND OFF and pause apply) ----------
  const fx = {
    tick: (i) => tone(1500 + (i % 2) * 180, 0, 0.03, { type: 'square', vol: 0.05 }),
    lock: () => { tone(660, 0, 0.12, { type: 'triangle', vol: 0.1 }); tone(990, 0.09, 0.28, { type: 'triangle', vol: 0.1 }); },
    push: () => { noise(0, 0.6, 0.05); tone(180, 0, 0.7, { type: 'sine', slideTo: 320, vol: 0.05 }); },
    brake: () => { noise(0, 0.25, 0.12); tone(110, 0, 0.18, { type: 'sine', slideTo: 60, vol: 0.18 }); },
    kaching: () => { noise(0, 0.06, 0.3); [1319, 1568, 2093].forEach((f, i) => tone(f, 0.05 + i * 0.07, 0.3, { type: 'triangle', vol: 0.1 })); tone(2637, 0.32, 0.35, { type: 'triangle', vol: 0.08 }); },
  };
  let engine = null; // truck engine: low saw + road noise, speed-driven, through the SFX bus
  function engineStart() {
    if (engine || window.BX.isMuted()) return;
    const a = audio(); if (!a) return;
    const out = a.createGain(), lp = a.createBiquadFilter(), o = a.createOscillator(), o2 = a.createOscillator();
    o.type = 'sawtooth'; o2.type = 'square'; o.frequency.value = 38; o2.frequency.value = 76; lp.frequency.value = 320;
    out.gain.value = 0;
    o.connect(lp); o2.connect(lp); lp.connect(out).connect(window.BX.sfxOut());
    o.start(); o2.start();
    engine = { a, out, o, o2 };
  }
  function engineSet(speed) {
    if (!engine) return;
    const t = engine.a.currentTime;
    engine.o.frequency.setTargetAtTime(38 + 26 * speed, t, 0.08); engine.o2.frequency.setTargetAtTime(76 + 52 * speed, t, 0.08);
    engine.out.gain.setTargetAtTime(0.05 + 0.07 * speed, t, 0.1);
  }
  function engineStop() {
    if (!engine) return;
    const { a, out, o, o2 } = engine, t = a.currentTime; engine = null;
    out.gain.cancelScheduledValues(t); out.gain.setTargetAtTime(0, t, 0.12); o.stop(t + 0.6); o2.stop(t + 0.6);
  }

  // ---------- Placement helpers ----------
  // A truck = runtime matte + locked render, positioned with left/top/size only (field px), optionally clipped.
  const trucks = {
    reg: [el('dl-reg-matte'), el('dl-reg-truck')], map: [el('dl-map-matte'), el('dl-map-truck')],
    back: [el('dl-back-matte'), el('dl-back-truck')], front: [el('dl-front-matte'), el('dl-front-truck')], hand: [el('dl-hand-matte'), el('dl-hand-truck')],
  };
  function placeTruck(key, x, y, size, clip = 'none', on = true) {
    trucks[key].forEach((e) => {
      if (!on) { e.style.visibility = 'hidden'; return; }
      Object.assign(e.style, { left: `${f1(x)}px`, top: `${f1(y)}px`, width: `${f1(size)}px`, height: `${f1(size)}px`, clipPath: clip, visibility: 'visible' });
      if (e.classList.contains('dl-matte') && !matteURL) e.style.visibility = 'hidden';
    });
  }
  const setK = () => { const k = stage.clientWidth / 1013 || 1; stage.style.setProperty('--k', k.toFixed(4)); stage.style.setProperty('--rk', Math.max(k, 0.6).toFixed(4)); };

  // ---------- Origin beat frame (t = 0–1 over DEP) ----------
  function departFrame(t, camOv = null) {
    const { F, AP, TL, BN, HT, REAR, TS, J0, J0S } = G;
    const u = uAtDep(t), rear = F(-u, 30.5, 0);
    const tX = rear[0] - REAR[0] * TS / 1254, tY = rear[1] - REAR[1] * TS / 1254, ctr = [tX + TS / 2, tY + TS / 2];
    // pull-back: scale the whole origin about the truck so it lands on the journey's opening truck pose
    const z = ease(ramp(t, DT.pull0, 1));
    let f = 1 + (J0S / TS - 1) * z;
    const goal = [ctr[0] + (J0[0] - ctr[0]) * z, ctr[1] + (J0[1] - ctr[1]) * z];
    let tx = goal[0] - ctr[0] * f, ty = goal[1] - ctr[1] * f;
    if (camOv) ({ f, tx, ty } = camOv); // the orientation push drives the camera instead
    const cam = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${f.toFixed(4)})`;
    el('dl-dep-under').style.transform = cam; el('dl-dep-over').style.transform = cam;
    if (!camOv) {
      el('dl-site').style.opacity = f3(clamp(1 - (z - 0.35) / 0.55)); el('dl-site-road').style.opacity = '1';
      const regOp = clamp((z - 0.3) / 0.6);
      el('dl-reg').style.opacity = f3(regOp); el('dl-labels').style.opacity = f3(regOp);
    }
    // exit route ahead of the truck + contact shadow
    const front = F(-u - TL, 30.5), far = F(-300, 30.5), sh = F(-u - TL / 2, 30.5);
    const route = el('dl-dep-route');
    route.setAttribute('d', `M${f1(front[0])} ${f1(front[1])} L${f1(far[0])} ${f1(far[1])}`);
    route.setAttribute('stroke-opacity', f3(0.6 * ramp(t, DT.close1, DT.pull0 + 0.04) * (1 - ramp(t, DT.pull0 + 0.06, 0.95))));
    const shadow = el('dl-dep-shadow');
    shadow.setAttribute('transform', `translate(${f1(sh[0])} ${f1(sh[1])}) rotate(23.6)`); shadow.setAttribute('rx', f1(TS * 0.36)); shadow.setAttribute('ry', f1(TS * 0.1));
    // portal state — opening and closing mirror each other: small compressed aperture at road level → grows up and out
    // to the full gateway → (crossing) → shrinks down and in to the road line → gone. The whole outline moves as one shape.
    const seed = ramp(t, DT.seed0, DT.seed0 + 0.025), g = ease(ramp(t, DT.seed0, DT.mem1)), mem = g;
    const c = ease(ramp(t, DT.close0, DT.close1)), liveP = t >= DT.seed0 && t < DT.close1, open = g * (1 - c);
    const sx = (0.2 + 0.8 * g) * (1 - 0.8 * c), sy = (0.06 + 0.94 * g) * (1 - c);
    if (portal.main) {
      const m = portal.main, sc = (x, y) => `translate(32 0) scale(${x.toFixed(4)} ${y.toFixed(4)}) translate(-32 0)`;
      m.svg.style.opacity = liveP ? f3(seed * (1 - c * c)) : '0';
      m.root.setAttribute('transform', m.base);
      m.scaled.forEach((e) => e.setAttribute('transform', sc(sx, sy)));
      m.seed.setAttribute('transform', sc(sx, 1)); m.seed.setAttribute('opacity', f3(seed)); // the road line keeps its thickness
      m.mem.setAttribute('opacity', f3(mem)); m.rings.setAttribute('opacity', f3(mem)); m.collar.setAttribute('opacity', f3(mem));
      m.strokes.forEach((p) => p.setAttribute('stroke-dashoffset', '0'));
      const lip = f3(0.55 + 0.45 * Math.max(1 - g, c));
      m.lips.forEach((p) => p.setAttribute('opacity', lip));
    }
    if (portal.spill) portal.spill.svg.style.opacity = liveP ? f3(seed * Math.max(0.35 * g, open)) : '0';
    // threshold plane split: the part of the truck already past the plane is drawn in front of the portal (its projected hull);
    // everything else stays behind the membrane. The light band at the plane is overlay light only.
    const BF = BN + 16, aF = -u - TL, aR = -u, split = liveP && mem > 0, crossing = aF < AP && aR > AP;
    let fh = [];
    if (aF < AP) {
      const a1 = Math.min(AP, aR), c8 = [];
      for (const aa of [aF - 6, a1]) for (const bb of [BN - 4, BF + 4]) for (const hh of [-6, HT + 4]) c8.push(F(aa, bb, hh));
      fh = hull(c8);
    }
    const X = [tx + tX * f, ty + tY * f], size = TS * f;   // origin space → field px
    const loc = (p) => `${f1((p[0] - tX) * f)}px ${f1((p[1] - tY) * f)}px`;
    const poly = (pts) => `polygon(${pts.map(loc).join(', ')})`;
    const BIG = 3000, box4 = [[-BIG, -BIG], [BIG, -BIG], [BIG, BIG], [-BIG, BIG]].map((q) => [q[0] + tX, q[1] + tY]);
    const useSplit = split && fh.length > 0;
    placeTruck('back', X[0], X[1], size, useSplit ? `polygon(evenodd, ${box4.concat([box4[0]], fh, [fh[0]]).map(loc).join(', ')})` : 'none');
    placeTruck('front', X[0], X[1], size, useSplit ? poly(fh) : 'none', useSplit);
    const q1 = F(AP, BN, -2), q2 = F(AP, BN, HT), q3 = F(AP, BF, HT);
    const band = (w) => [[q1[0] - w, q1[1]], [q2[0] - w, q2[1] - w * 0.44], [q3[0] - w, q3[1] - w * 0.44], [q3[0] + w, q3[1] + w * 0.44], [q2[0] + w, q2[1] + w * 0.44], [q1[0] + w, q1[1]]];
    [['dl-band', band(1.1), 0.9], ['dl-band-glow', band(5), 0.35]].forEach(([id, pts, op]) => {
      Object.assign(el(id).style, { left: `${f1(X[0])}px`, top: `${f1(X[1])}px`, width: `${f1(size)}px`, height: `${f1(size)}px`, clipPath: poly(pts),
        opacity: split && crossing && matteURL ? f3(op * open) : '0' });
    });
  }

  // ---------- Orientation beat (t = ms): the wider world first, then world → facility ----------
  // The regional map is framed wide (Trebutech at its edge of the world, the route, HOME / Nottingham). The facility sits at
  // the Trebutech end at map scale; the push grows it to full size while the map scales with it and falls away.
  const OK0 = 0.36, OPOS = [150, 236], OF0 = 0.22;
  const ORIGIN_ANCHOR = (() => { const r = G.F(-1, 30.5, 0); return [r[0] - G.REAR[0] * G.TS / 1254 + G.TS / 2, r[1] - G.REAR[1] * G.TS / 1254 + G.TS / 2]; })();
  function orientFrame(t) {
    const p = ease(ramp(t, OR.fadeIn + OR.hold, OR.fadeIn + OR.hold + OR.push));
    const f = OF0 * Math.pow(1 / OF0, p), A = ORIGIN_ANCHOR;
    const P = [OPOS[0] + (A[0] - OPOS[0]) * p, OPOS[1] + (A[1] - OPOS[1]) * p];   // where the anchor sits on screen
    departFrame(0, { f, tx: P[0] - A[0] * f, ty: P[1] - A[1] * f });
    // the regional map is locked to the same move: its Trebutech end stays under the facility
    const k = OK0 * f / OF0, rtx = P[0] + 1230 * k, rty = P[1] - 150 * k;
    el('dl-reg-cam').style.transform = `translate(${rtx.toFixed(2)}px, ${rty.toFixed(2)}px) scale(${k.toFixed(4)})`;
    const fade = clamp(t / OR.fadeIn);
    el('dl-reg').style.opacity = f3(fade * (1 - ramp(p, 0.45, 0.9)));
    el('dl-site').style.opacity = f3(fade); el('dl-site-road').style.opacity = f3(ramp(p, 0.25, 0.75));
    const h = [786 * k + rtx, 459 * k + rty];
    Object.assign(el('dl-label-origin').style, { left: `${f1(Math.max(10, P[0] - 62))}px`, top: `${f1(P[1] + 48)}px` });
    Object.assign(el('dl-label-home').style, { left: `${f1(h[0] - 70)}px`, top: `${f1(h[1] + 2)}px` });
    el('dl-labels').style.opacity = f3(fade * (1 - ramp(p, 0, 0.35)));
    return p;
  }

  // ---------- Journey + MAP 02A frame (t = ms after the origin beat) ----------
  function travelFrame(t) {
    // regional layer (the push carries the truck onto the map truck's live screen point)
    const r = regCam(t), z = r.z;
    el('dl-reg-cam').style.transform = `translate(${r.tx.toFixed(2)}px, ${r.ty.toFixed(2)}px) scale(${r.k.toFixed(4)})`;
    el('dl-reg-trail').setAttribute('d', trailFrom(jDist(t)));
    el('dl-reg-ctx').setAttribute('opacity', f3(Math.max(0, 1 - z * 1.4)));
    el('dl-reg-home').style.opacity = f3(Math.max(0, 1 - z * 1.25));
    placeTruck('reg', r.c.x - 133, r.c.y - 133, 266, 'none', t < TR.H0);
    const o = [-1230 * r.k + r.tx, 150 * r.k + r.ty], h = [786 * r.k + r.tx, 459 * r.k + r.ty];
    Object.assign(el('dl-label-origin').style, { left: `${f1(Math.max(10, o[0] - 2))}px`, top: `${f1(o[1] + 46)}px` });
    Object.assign(el('dl-label-home').style, { left: `${f1(h[0] - 70)}px`, top: `${f1(h[1] + 2)}px` });
    el('dl-labels').style.opacity = f3(Math.max(0, 1 - z * 1.8));
    // dissolve into MAP 02A
    const aOp = sine((t - TR.DIS0) / (TR.DIS1 - TR.DIS0));
    el('dl-reg').style.opacity = f3(1 - aOp); el('dl-local').style.opacity = f3(aOp);
    const mc = mapCam(camAt(t));
    el('dl-local-cam').style.transform = `translate(${mc.tx.toFixed(2)}px, ${mc.ty.toFixed(2)}px) scale(${mc.k.toFixed(4)})`;
    const u = uAtMap(t), mp = mapAt(ML * u), cx = mp.x, cy = mp.y;
    const nose = mapAt(ML * u + 40), end = mapAt(ML + 40);
    let trail = `M${f1(nose.x)} ${f1(nose.y)}`;
    if (u < 1) { for (let i = 1; i < MPATH.length; i++) if (MSEG.slice(0, i).reduce((a, b) => a + b, 0) > ML * u + 40) trail += ` L${MPATH[i][0]} ${MPATH[i][1]}`; trail += ` L${f1(end.x)} ${f1(end.y)}`; }
    el('dl-map-trail').setAttribute('d', trail);
    el('dl-map-shadow').setAttribute('transform', `translate(${f1(cx + 2)} ${f1(cy - 2)}) rotate(${mp.deg.toFixed(1)})`);
    el('dl-map-shadow').setAttribute('opacity', t >= TR.H1 ? '1' : '0');
    placeTruck('map', cx - CXF * SPR - 52, cy - CYF * SPR - 140, SPR, 'none', t >= TR.H1);
    // handoff: one truck layer carries the regional pose onto the map pose across the dissolve (no teleport, no reverse)
    if (t >= TR.H0 && t < TR.H1) {
      const a = regPose(t), b = mapPose(t), q = sine((t - TR.H0) / (TR.H1 - TR.H0));
      const hx = a.x + (b.x - a.x) * q, hy = a.y + (b.y - a.y) * q, hs = a.s + (b.s - a.s) * q;
      placeTruck('hand', hx, hy, hs);
      Object.assign(el('dl-hand-shadow').style, { left: `${f1(hx + hs * 0.12)}px`, top: `${f1(hy + hs * 0.74)}px`, width: `${f1(hs * 0.8)}px`, height: `${f1(hs * 0.22)}px`,
        transform: `rotate(${mapAt(0).deg.toFixed(1)}deg)`, visibility: 'visible' });
    } else { placeTruck('hand', 0, 0, 0, 'none', false); el('dl-hand-shadow').style.visibility = 'hidden'; }
    // HOME arrival: one gold ring pulse + restrained glow (the map never moves)
    const arrive = t < TR.M1 ? 0 : Math.min(1, (t - TR.M1) / TR.ARRIVE), pulse = arrive > 0 && arrive < 1 ? Math.sin(Math.PI * arrive) : 0;
    el('dl-map-homeglow').style.opacity = f3(0.35 + 0.65 * pulse);
    el('dl-map-ring').setAttribute('r', f1(32 + 26 * arrive)); el('dl-map-ring').setAttribute('opacity', f3(0.9 * pulse));
  }

  // ---------- State + loop ----------
  let s = null, raf = 0, last = null, onDone = null;
  function fresh() { return { t: 0, phase: 'select', phaseT: 0, hi: -1, step: -1, fired: new Set(), method: null, charged: false, done: false }; }
  const once = (k) => (s.fired.has(k) ? false : (s.fired.add(k), true));
  function enter(p) { s.phase = p; s.phaseT = s.t; }
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (last === null) last = ts;
    const dt = Math.min(ts - last, 50); last = ts;
    if (!s || window.BX.isPaused()) return;
    s.t += dt; update();
  }

  function update() {
    const t = s.t, pt = t - s.phaseT, rm = reduced();
    if (s.phase === 'select') {
      select.style.opacity = clamp(t / T.fadeIn).toFixed(3);
      // Rapid cycling with ticks, slowing deterministically onto TREBUCHET.
      while (s.step + 1 < schedule.length && t >= schedule[s.step + 1].t) {
        s.step += 1; s.hi = schedule[s.step].index; fx.tick(s.step);
        cards.forEach((c, i) => c.classList.toggle('is-hi', i === s.hi));
        placePointer(s.hi, false);
      }
      if (t >= lockAt && once('lock')) {
        s.method = DELIVERY_OPTIONS[resultIndex].label; s.lockT = t;
        cards.forEach((c, i) => { c.classList.remove('is-hi'); c.classList.toggle('is-out', i !== resultIndex); });
        cards[resultIndex].classList.add('is-locked'); placePointer(resultIndex, true);
        status.textContent = s.method; fx.lock(); announce(`Delivery method: ${s.method}. Locked in.`);
      }
      if (s.lockT !== undefined) { // restrained bounce + one glow pulse, then hold
        const u = (t - s.lockT) / 600, c = cards[resultIndex];
        const bounce = rm ? 1 : 1 + 0.1 * Math.exp(-u * 5) * Math.cos(u * 14);
        c.style.transform = `scale(${bounce.toFixed(4)})`;
        c.style.setProperty('--pulse', (u < 1 ? Math.sin(Math.PI * clamp(u)) : 0).toFixed(3));
        if (t - s.lockT >= T.lockHold) startOrigin();
      }
    } else if (s.phase === 'orient') {
      setK();
      orientFrame(pt);
      if (pt >= OR.fadeIn + OR.hold && once('push')) { fx.push(); announce('Trebutech Rental and Dispatch'); }
      if (pt >= OR.fadeIn + OR.hold + OR.push) { enter('depart'); parkRegional(); departFrame(0); }
    } else if (s.phase === 'depart') {
      setK();
      const u01 = clamp(pt / DEP);
      departFrame(u01);
      if (u01 >= DT.go && once('engine')) { engineStart(); announce('The Trebutech truck pulls out of Rental and Dispatch'); }
      engineSet(u01 < DT.through ? 0.3 + 0.7 * ramp(u01, DT.go, DT.through) : 1);
      // base-portal system sound (shared BX.portalSfx): open with the growth, shimmer as the cab meets the plane, close with the shrink
      if (u01 >= DT.seed0 && once('portal-open')) window.BX.portalSfx.open();
      if (-uAtDep(u01) - G.TL < G.AP && once('portal-cross')) window.BX.portalSfx.cross();
      if (u01 >= DT.close0 && once('portal-close')) window.BX.portalSfx.close();
      if (pt >= DEP) startTravel();
    } else if (s.phase === 'travel') {
      setK();
      travelFrame(pt);
      if (pt < TR.M1) engineSet(pt < TR.M0 ? 1 : 1 - 0.8 * uAtMap(pt));
      if (pt >= TR.PUSH0 && once('nottingham')) announce('Into Nottingham');
      if (pt >= TR.M1 && once('arrive')) { engineStop(); fx.brake(); s.arriveT = t; announce('The Trebutech truck arrives at HOME'); }
      const rt = pt - (TR.M1 + TR.HOLD);
      if (rt >= 0) { // TREBUCHET RENTAL − £15.00, ching-ching, then the visible budget updates. Hold, then the Delivery Problem.
        const u = clamp(rt / TR.chargeIn);
        receipt.style.visibility = 'visible'; receipt.style.opacity = u.toFixed(3);
        receipt.style.setProperty('--ry', rm ? '0px' : `${((1 - u) * -16).toFixed(1)}px`);
        if (once('ching')) { fx.kaching(); announce(`${RENTAL.label}: minus ${RENTAL.cost} pounds`); }
        if (rt >= TR.budgetAt && once('budget')) {
          const before = window.BX.getBudget();
          window.BX.spendBudget(RENTAL.cost); s.charged = true;
          remaining.textContent = `BUDGET ${money(before)} → ${money(window.BX.getBudget())}`;
          receipt.classList.add('is-charged'); $('#budget')?.classList.add('is-spending');
          setTimeout(() => $('#budget')?.classList.remove('is-spending'), 900);
          announce(`Budget left: ${money(window.BX.getBudget())}`);
        }
      }
      if (pt >= TR.CUT && !s.done) {
        s.done = true; engineStop(); cancelAnimationFrame(raf); raf = 0;
        const cb = onDone; onDone = null; cb && cb({ method: s.method, rental: RENTAL.cost });
      }
    }
  }

  function startOrigin() {
    enter('orient');
    select.style.visibility = 'hidden';
    stage.style.visibility = 'visible';
    el('dl-local').style.opacity = '0';
    el('dl-reg-trail').setAttribute('d', trailFrom(0)); el('dl-reg-ctx').setAttribute('opacity', '1'); el('dl-reg-home').style.opacity = '1';
    placeTruck('reg', 0, 0, 0, 'none', false);
    ['dl-dep-under', 'dl-dep-over'].forEach((id) => { el(id).style.visibility = 'visible'; });
    setK(); orientFrame(0);
  }
  // after the push the regional layer waits under the origin, parked on the journey's opening frame (no truck);
  // it fades back in on the pull-back
  function parkRegional() {
    el('dl-reg-cam').style.transform = 'translate(504px, 184.8px) scale(0.4)';
    Object.assign(el('dl-label-origin').style, { left: '10px', top: '290.8px' });
    Object.assign(el('dl-label-home').style, { left: '748.4px', top: '370.4px' });
  }
  function startTravel() {
    enter('travel');
    ['dl-dep-under', 'dl-dep-over'].forEach((id) => { el(id).style.visibility = 'hidden'; });
    placeTruck('back', 0, 0, 0, 'none', false); placeTruck('front', 0, 0, 0, 'none', false);
    ['dl-band', 'dl-band-glow'].forEach((id) => { el(id).style.opacity = '0'; });
    travelFrame(0);
  }

  // ---------- Mount / teardown ----------
  function resetDom() {
    select.style.visibility = ''; select.style.opacity = '0';
    cards.forEach((c) => { c.classList.remove('is-hi', 'is-locked', 'is-out'); c.style.transform = ''; c.style.removeProperty('--pulse'); });
    pointer.style.opacity = '0'; pointer.classList.remove('is-locked');
    status.textContent = 'SELECTING…';
    stage.style.visibility = 'hidden';
    Object.keys(trucks).forEach((k) => placeTruck(k, 0, 0, 0, 'none', false));
    ['dl-band', 'dl-band-glow'].forEach((id) => { el(id).style.opacity = '0'; });
    el('dl-hand-shadow').style.visibility = 'hidden';
    el('dl-reg').style.opacity = '0'; el('dl-local').style.opacity = '0'; el('dl-labels').style.opacity = '0';
    if (portal.main) portal.main.svg.style.opacity = '0';
    if (portal.spill) portal.spill.svg.style.opacity = '0';
    receipt.style.visibility = 'hidden'; receipt.style.opacity = '0'; receipt.style.setProperty('--ry', '0px'); receipt.classList.remove('is-charged'); remaining.textContent = '';
    live.textContent = '';
  }
  function teardown() { cancelAnimationFrame(raf); raf = 0; last = null; engineStop(); s = null; onDone = null; }
  function start(opts = {}) {
    teardown(); resetDom();
    onDone = opts.onDone || null;
    s = fresh(); method = null;
    show('p2-delivery', 'PART 2 // DELIVERY METHOD');
    window.BX.clearGuide();
    raf = requestAnimationFrame(frame);
  }
  let method = null;
  addEventListener('resize', () => {
    if (!s) return;
    if (s.phase !== 'select') setK();
    else if (s.hi >= 0) placePointer(s.lockT !== undefined ? resultIndex : s.hi, s.lockT !== undefined);
  });

  window.BX.startDeliveryTransition = start;
  window.BX.resetDeliveryTransition = () => { teardown(); resetDom(); };
  window.BX.getDeliveryMethod = () => (s && s.method) || method;
  window.BX.setDeliveryMethod = (m) => { method = m; }; // for debug jumps that skip the transition
  window.BX.deliveryOptions = () => DELIVERY_OPTIONS.map((o) => ({ ...o }));
  window.BX.deliveryTiming = () => ({ select: { ...T, lockAt }, orient: { ...OR }, dep: DEP, depCues: { ...DT }, travel: { ...TR } });
  window.BX.deliveryTransitionState = () => s && { phase: s.phase, t: s.t, phaseT: s.phaseT, hi: s.hi, step: s.step, method: s.method, charged: s.charged, done: s.done, lockT: s.lockT, arriveT: s.arriveT, matte: !!matteURL, portal: !!portal.main,
    // world-space progress (origin units out of the bay, journey distance, MAP 02A street fraction): only ever increases
    progress: s.phase === 'orient' ? { dep: 1 } : s.phase === 'depart' ? { dep: uAtDep(clamp((s.t - s.phaseT) / DEP)) } : s.phase === 'travel' ? { journey: jDist(s.t - s.phaseT), street: uAtMap(s.t - s.phaseT) } : null };
})();
