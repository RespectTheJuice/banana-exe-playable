/* BANANA.EXE — Part 2, Attempt 01: Long-Range Launch.
   Locked production spec: production/design/BANANA_PART2_ATTEMPT01_DESIGN_DECISIONS.md + the Claude Design boards.

   Setup beats 01–03 → hard cut to rig plate 04 → press-and-hold charge. Two paths, one outcome:
     A. hold to 100 % → 250 ms at full glow → normal launch from 04;
     B. three valid early releases (c ≥ 0.12): 04→05, 04→06 (clean 800 ms power-downs), 04→07 shake → accidental WHUMP.
   Both cut to the Nottingham → Leicester flight, then the Leicester forest / fox gag, FAILED ATTEMPT, RESULT: LEICESTER
   and the locked 08 carry-forward pose.

   Built on the existing systems: window.BX for scenes, pause (BX.isPaused / bx:pause), the SFX bus (BX.sfxOut — so
   SOUND OFF keeps working), and the selected Part 1 banana (BX.getChoice). One rAF loop advances a game clock that
   stops while paused, so visuals freeze on their frame while the AudioContext is suspended with them.
   Locked art is only shown, hard-swapped, moved as a whole and lit from live layers — never edited. */
(() => {
  const { $, show, audio } = window.BX;

  // ---------- Spec constants (plate-04 space, ms) ----------
  const VIS = { w: 1624, h: 893 };                     // 1672 × 941 minus 24 px overscan per edge
  const A6 = { x: 1510, y: 118 }, SHOT = { w: 192, h: 144 }, BARREL = -17.5 * Math.PI / 180;
  const CHARGE_MS = 2400, TAP_GUARD = 0.12;
  const PD = { dur: 800, tau: 220, end: 700, thunk: 600, swap: 620, fade: 90, ticks: [680, 760] };
  const MINI = { dur: 300, tau: 90, end: 300 };
  const T3 = { stutter: 350, shake: 520, flicker: 33, arcs: 650, freeze: 1400, whump: 1650, cut: 1900 };
  const FULL = { whump: 250, cut: 500 };
  const SETUP = { fadeIn: 300, say1: 500, say1Off: 2900, p02: 3100, p03: 4500, say2: 4700, say2Off: 7000, cut04: 7200, push: 700 };
  const FLIGHT = { A: 900, B: 1050, C: 1750, cut: 2150 };
  const FOREST = { fall: 700, thud: 1300, foxIn: 3300, lookL: 3800, lookR: 4500, foxOut: 5200, failed: 5900, result: 6600, carry: 8200, carryIn: 350, done: 9000 };
  const LINES = { inspect: 'How do I use this thing?', goggles: 'Let me at least put my goggles on.' };

  // Controlled art for the Leicester gag has not been supplied yet. When it lands, set the paths here (fox: one frame
  // per beat) and, if the fox frames leave the mouth empty for the player's banana, its anchor in % of the frame.
  // Until then a labelled review placeholder carries the timing. No forest or fox art is drawn in code.
  const FOREST_ART = { forest: null, fox: { up: null, left: null, right: null }, mouth: null };

  // Map flight (re-used Nottingham → Leicester route). Map space is 0–1000, north up.
  const P = { nott: [400, 140], leic: [430, 460], tfy: [620, 860], ctrl: [120, 450] };
  const ROUTE = `M${P.nott} Q${P.ctrl} ${P.tfy}`;

  // ---------- DOM ----------
  const scene = $('#p2-attempt01'), cell = $('#a1-cell'), view = $('#a1-view'), cam = $('#a1-cam');
  const setupEl = $('#a1-setup'), rig = $('#a1-rig');
  const plates = {}, setupPoses = {};
  document.querySelectorAll('.a1-plate').forEach((el) => { plates[el.dataset.pose] = el; });
  document.querySelectorAll('.a1-setup-pose').forEach((el) => { setupPoses[el.dataset.pose] = el; });
  const coil = $('#a1-coil'), ringsG = $('#a1-rings'), rings = [...ringsG.children], hub = $('#a1-hub');
  const caps = [...document.querySelectorAll('.a1-cap')], table = $('#a1-table'), pads = $('#a1-pads'), motionG = $('#a1-motion');
  const arcsG = $('#a1-arcs'), arcLines = [...arcsG.querySelectorAll('polyline')];
  const smokeCv = $('#a1-smoke'), sctx = smokeCv.getContext('2d');
  const bloom = $('#a1-bloom'), shot = $('#a1-shot'), flashEl = $('#a1-flash');
  const say = $('#a1-say'), sayText = $('#a1-say-text');
  const map = $('#a1-map'), mapSvg = $('#a1-map-svg'), routeDone = $('#a1-route-done'), routeLeft = $('#a1-route-left');
  const trail = $('#a1-trail'), proj = $('#a1-proj'), leicRing = $('#a1-leic-ring'), leicLabel = $('#a1-leic-label'), tfyPulse = $('#a1-tfy-pulse');
  const forest = $('#a1-forest'), forestArt = $('#a1-forest-art'), pending = $('#a1-forest-pending'), pendingBeat = $('#a1-pending-beat');
  const pendingBanana = $('#a1-pending-banana'), fall = $('#a1-fall'), fox = $('#a1-fox'), foxArt = $('#a1-fox-art');
  const failedEl = $('#a1-failed'), resultEl = $('#a1-result'), carry = $('#a1-carry');
  const ctrl = $('#a1-ctrl'), btn = $('#a1-btn'), btnCap = btn.querySelector('.a1-btn-cap'), hint = $('#a1-hint');
  const meter = $('#a1-meter'), meterFill = $('#a1-meter-fill'), meterPeak = $('#a1-meter-peak'), meterPct = $('#a1-meter-pct');
  const live = $('#a1-live');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (u) => 1 - (1 - u) ** 3;
  const TAU = Math.PI * 2;

  // ---------- Preload: every plate is fetched and decoded before HOLD is enabled ----------
  const lazy = [...scene.querySelectorAll('img[data-src]')];
  let preloading = null;
  function preload() {
    if (!preloading) {
      preloading = Promise.all(lazy.map((img) => {
        if (!img.getAttribute('src')) img.src = img.dataset.src;
        return img.decode().catch(() => new Promise((ok) => (img.complete ? ok() : img.addEventListener('load', ok, { once: true }))));
      }));
    }
    return preloading;
  }

  // ---------- Layout: the plate window fits the stage cell; UI stays outside the scaled box ----------
  let K = 0.5;
  const PORTRAIT = matchMedia('(orientation: portrait), (max-width: 700px)');
  function layout() {
    const w = cell.clientWidth, h = cell.clientHeight;
    if (!w || !h) return;
    K = Math.min(w / VIS.w, h / VIS.h);
    const vw = VIS.w * K, vh = VIS.h * K;
    scene.style.setProperty('--k', K.toFixed(5));
    scene.style.setProperty('--vw', `${vw.toFixed(1)}px`);
    scene.style.setProperty('--vh', `${vh.toFixed(1)}px`);
    scene.style.setProperty('--ms', `${Math.min(w, h, 560).toFixed(1)}px`);
    // The Leicester gag is not a plate: on portrait it takes a taller frame so the verdict and 08 both read.
    scene.style.setProperty('--fh', `${(PORTRAIT.matches ? Math.min(h, vw * 1.25) : vh).toFixed(1)}px`);
  }
  new ResizeObserver(layout).observe(cell);

  // ---------- Value noise for vibration (not a sine) ----------
  const NOISE = Array.from({ length: 256 }, () => Math.random() * 2 - 1);
  const vnoise = (x) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return NOISE[i & 255] * (1 - u) + NOISE[(i + 1) & 255] * u;
  };

  // ---------- Audio: everything through the shared SFX bus (SOUND OFF + pause keep working) ----------
  let noiseBuf = null;
  const bus = () => window.BX.sfxOut();
  const muted = () => window.BX.isMuted();
  function tn(f0, f1, at, dur, vol, type = 'sine', group = null) {
    const a = audio(); if (!a || muted()) return;
    const t = a.currentTime + at, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(bus()); o.start(t); o.stop(t + dur + 0.02);
    if (group) group.push(o);
  }
  function nz(at, dur, vol, ftype = 'lowpass', ffreq = 900, group = null) {
    const a = audio(); if (!a || muted()) return;
    if (!noiseBuf) {
      noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = a.currentTime + at, src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = noiseBuf; f.type = ftype; f.frequency.value = ffreq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(bus()); src.start(t); src.stop(t + dur + 0.02);
    if (group) group.push(src);
  }
  // Charge hum: saw + triangle → lowpass, driven every frame from c.
  let hum = null;
  function humStart() {
    if (hum) return;
    const a = audio(); if (!a) return;
    const o1 = a.createOscillator(), o2 = a.createOscillator(), lp = a.createBiquadFilter(), g = a.createGain();
    o1.type = 'sawtooth'; o2.type = 'triangle'; o1.frequency.value = 110; o2.frequency.value = 111; lp.frequency.value = 700; g.gain.value = 0;
    o1.connect(lp); o2.connect(lp); lp.connect(g).connect(bus()); o1.start(); o2.start();
    hum = { a, o1, o2, lp, g };
  }
  function humSet(f, gain, lp, snap = false) {
    if (!hum) return;
    const t = hum.a.currentTime;
    const set = (p, v, tc) => { p.cancelScheduledValues(t); if (snap) p.setValueAtTime(v, t); else p.setTargetAtTime(v, t, tc); };
    set(hum.o1.frequency, Math.max(30, f), 0.015); set(hum.o2.frequency, Math.max(30, f) * 1.006, 0.015);
    set(hum.lp.frequency, lp, 0.02); set(hum.g.gain, gain, 0.025);
  }
  function humStop() {
    if (!hum) return;
    const { a, o1, o2, g } = hum, t = a.currentTime; hum = null;
    g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, 0.02);
    o1.stop(t + 0.2); o2.stop(t + 0.2);
  }
  // Power-down whine: its pitch, filter and gain are sampled from the same p(t) the visuals read every frame.
  const pCurve = (t, c0, m) => (t < m.end ? c0 * Math.exp(-t / m.tau) : 0);
  let whine = null, sched = [];
  function whineStart(c0, f0, m) {
    whineStop();
    const a = audio(); if (!a) return;
    const n = Math.ceil(m.dur / 10) + 1, fr = new Float32Array(n), gn = new Float32Array(n), lp = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1)) * m.dur, rel = c0 > 0 ? pCurve(t, c0, m) / c0 : 0;
      fr[i] = 90 + (f0 - 90) * rel; gn[i] = (0.04 + 0.06 * c0) * rel; lp[i] = 300 + 2100 * rel;
    }
    const t0 = a.currentTime, d = m.dur / 1000;
    const o1 = a.createOscillator(), o2 = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain(), out = a.createGain();
    o1.type = 'sawtooth'; o2.type = 'triangle';
    o1.frequency.setValueCurveAtTime(fr, t0, d); o2.frequency.setValueCurveAtTime(fr.map((v) => v * 1.006), t0, d);
    f.frequency.setValueCurveAtTime(lp, t0, d); g.gain.setValueCurveAtTime(gn, t0, d);
    o1.connect(f); o2.connect(f); f.connect(g).connect(out).connect(bus());
    o1.start(t0); o2.start(t0); o1.stop(t0 + d + 0.05); o2.stop(t0 + d + 0.05);
    whine = { a, o1, o2, out, t0 };
  }
  function whineCut(atMs) { // the third interruption breaks the familiar wind-down mid-way
    if (!whine) return;
    const t = whine.t0 + atMs / 1000;
    whine.out.gain.setValueAtTime(1, t); whine.out.gain.linearRampToValueAtTime(0, t + 0.012);
  }
  function whineStop() {
    if (!whine) return;
    const { a, o1, o2, out } = whine, t = a.currentTime; whine = null;
    out.gain.cancelScheduledValues(t); out.gain.setTargetAtTime(0, t, 0.008);
    try { o1.stop(t + 0.06); o2.stop(t + 0.06); } catch (_) {}
  }
  function schedStop() { sched.forEach((n) => { try { n.stop(); } catch (_) {} }); sched = []; }
  const fx = {
    chirp: () => tn(200, 620, 0, 0.09, 0.06, 'triangle'),
    cap: () => { nz(0, 0.015, 0.05, 'highpass', 3000); tn(1700, 1500, 0, 0.03, 0.025, 'square'); },
    powerDown: () => { // settle thunk + clunk at 600 ms, relay ticks at 680 / 760 ms; no buzzer, no early noise
      tn(70, 45, PD.thunk / 1000, 0.12, 0.16, 'sine', sched);
      nz(PD.thunk / 1000, 0.04, 0.12, 'lowpass', 800, sched);
      PD.ticks.forEach((ms, i) => nz(ms / 1000, 0.015, i ? 0.04 : 0.05, 'highpass', 3000, sched));
    },
    third: () => { // instability rattle at 11 Hz on the shake, then the WHUMP
      for (let ms = T3.shake; ms < T3.freeze; ms += 91) {
        const k = (ms - T3.shake) / (T3.freeze - T3.shake);
        nz(ms / 1000, 0.05, 0.05 + 0.08 * k, 'bandpass', 700 + 500 * Math.random(), sched);
        tn(140 + 60 * Math.random(), 90, ms / 1000, 0.04, 0.04 + 0.04 * k, 'square', sched);
      }
      fx.whump(T3.whump / 1000, sched);
    },
    full: () => { tn(520, 1040, 0, FULL.whump / 1000, 0.05, 'triangle', sched); fx.whump(FULL.whump / 1000, sched); },
    whump: (at, g) => {
      tn(120, 35, at, 0.28, 0.4, 'sine', g); nz(at, 0.09, 0.32, 'lowpass', 1500, g);
      tn(2000, 200, at, 0.15, 0.06, 'sawtooth', g); nz(at + 0.05, 0.6, 0.05, 'lowpass', 500, g);
    },
    whistle: () => tn(1500, 420, 0, 0.7, 0.035, 'sine'),
    rustle: (dur = 0.6, vol = 0.09) => {
      for (let i = 0; i < 9; i++) nz(Math.random() * dur, 0.05 + Math.random() * 0.08, vol * (0.5 + Math.random() * 0.5), 'bandpass', 2600 + Math.random() * 2400);
    },
    thud: () => { tn(95, 45, 0, 0.25, 0.26, 'sine'); nz(0, 0.08, 0.16, 'lowpass', 500); },
  };

  // ---------- Map geometry (re-used flight) ----------
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ROUTE); mapSvg.appendChild(path); path.style.visibility = 'hidden';
  const L = path.getTotalLength(), STALL = 0.32;
  (() => { // split the intended curve at 32 %: the part flown vs. the part the banana never reaches
    const [x0, y0] = P.nott, [cx, cy] = P.ctrl, [x1, y1] = P.tfy, target = path.getPointAtLength(L * STALL);
    let tt = 0, best = 1e9;
    for (let i = 0; i <= 2000; i++) {
      const u = i / 2000, x = (1 - u) ** 2 * x0 + 2 * u * (1 - u) * cx + u * u * x1, y = (1 - u) ** 2 * y0 + 2 * u * (1 - u) * cy + u * u * y1;
      const d = (x - target.x) ** 2 + (y - target.y) ** 2;
      if (d < best) { best = d; tt = u; }
    }
    const lerp = (a, b) => [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt];
    const q0 = lerp(P.nott, P.ctrl), q1 = lerp(P.ctrl, P.tfy), m = lerp(q0, q1);
    routeDone.setAttribute('d', `M${P.nott} Q${q0} ${m}`);
    routeLeft.setAttribute('d', `M${m} Q${q1} ${P.tfy}`);
  })();
  const stallPt = path.getPointAtLength(L * STALL);
  const tangent = (len) => { const a = path.getPointAtLength(Math.max(0, len - 2)), b = path.getPointAtLength(Math.min(L, len + 2)); return Math.atan2(b.y - a.y, b.x - a.x); };

  // ---------- State ----------
  let s = null, raf = 0, lastTs = null, onComplete = null;
  function fresh() {
    return {
      t: 0, phase: 'setup', phaseT: 0, ready: false, armed: false, fired: new Set(),
      pose: '01', prev: null, fadeAt: -1e9, fadeMs: 0,
      c: 0, c0: 0, f0: 110, peak: 0, count: 0, held: false, mini: false, abort: false, swapped: false, jolt: -1e9,
      g: 0, vph: 0, ringPh: 0, gVal: 0.5, gStep: 0, hfG: 160, arcAt: 0, smoke: [], lastCap: 0, announced: 0,
      path: null, shotT: -1, trail: [], beat: '', done: false,
    };
  }
  const once = (key) => (s.fired.has(key) ? false : (s.fired.add(key), true));
  function enter(phase) { s.phase = phase; s.phaseT = s.t; s.fired = new Set(); }

  // ---------- Input: one real button; press and hold to charge ----------
  const ACTIVE = new Set(['idle', 'charging', 'powerdown']);
  function press() {
    if (!s || !s.armed || s.held || window.BX.isPaused() || !scene.classList.contains('is-active') || !ACTIVE.has(s.phase)) return;
    s.held = true; btn.classList.add('is-held'); setLabel('CHARGING…');
    window.BX.clearGuide();
    if (s.phase === 'powerdown') { whineStop(); schedStop(); }
    if (s.pose !== '04') { setPose('04'); s.jolt = s.t; fx.chirp(); } // snap back with a spin-up jolt
    enter('charging');
    announce('Charging');
  }
  function release(fromPause = false) {
    if (!s || !s.held) return;
    s.held = false; btn.classList.remove('is-held'); setLabel('HOLD TO CHARGE');
    if (s.phase !== 'charging') return;
    s.c0 = s.c; s.f0 = 110 + 410 * s.c; s.peak = s.c; s.swapped = false; s.abort = false; s.mini = false;
    humSet(110, 0, 300); // the whine voice takes over from the hum
    if (fromPause) { // a pause is not the player letting go: power down without a pose swap or a count
      s.abort = true; enter('powerdown'); whineStart(s.c0, s.f0, PD); return;
    }
    if (s.c < TAP_GUARD) { s.mini = true; enter('powerdown'); whineStart(s.c0, s.f0, MINI); return; }
    s.count += 1;
    if (s.count < 3) {
      enter('powerdown'); whineStart(s.c0, s.f0, PD); fx.powerDown();
      announce('Powering down');
    } else {
      enter('third'); s.smoke = []; whineStart(s.c0, s.f0, PD); whineCut(T3.stutter); fx.third();
      announce('Powering down… something is wrong');
    }
  }
  btn.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    press();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btn.addEventListener(ev, () => release()));
  btn.addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (!e.repeat) press();
  });
  btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); release(); } });
  btn.addEventListener('blur', () => release());
  btn.addEventListener('click', (e) => e.preventDefault());
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  addEventListener('bx:pause', (e) => { if (e.detail.paused && s && s.held) release(true); });

  // ---------- Helpers ----------
  function announce(text) { live.textContent = ''; live.textContent = text; }
  function setLabel(text) { if (btnCap.textContent !== text) btnCap.textContent = text; }
  function sayLine(text) { if (text) sayText.textContent = text; say.classList.toggle('is-on', !!text); }
  function setPose(p, fadeMs = 0) {
    if (s.pose === p) return;
    s.prev = s.pose; s.pose = p; s.fadeAt = s.t; s.fadeMs = fadeMs;
  }
  function choiceImg() { const c = window.BX.getChoice(); return (c && c.img) || 'assets/banana_ripe_v1.png'; }

  // ---------- Frame ----------
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(ts - lastTs, 50); lastTs = ts;
    if (!s || window.BX.isPaused()) return; // frozen on the current frame
    s.t += dt;
    update(dt);
  }

  function update(dt) {
    const rm = reduced(), pt = s.t - s.phaseT;
    let x = 0, y = 0, r = 0, g = 0, motion = 0, arcOn = false, flash = 0, bloomOp = 0, tremor = 0;
    let hf = 110, hg = 0, hlp = 700, hSnap = false, ringSpeed = 0;
    const wob = (A, f) => { s.vph += dt / 1000 * f; return { x: A * vnoise(s.vph), y: 0.5 * A * vnoise(s.vph + 97.3) }; };
    // Shake must stay readable on phones: never below ~1.5 CSS px on screen once it is meant to be felt.
    const floorA = (A, min) => Math.max(A, min / K);

    switch (s.phase) {
      case 'setup': runSetup(pt); break;
      case 'idle': {
        const on = s.pose === '04';
        g = on ? 0.15 : 0; hg = on ? 0.02 : 0;
        const w = wob(on ? 0.4 : 0, 14); x = w.x; y = w.y; // keeps 04's baked motion arcs reading as live
        ringSpeed = on ? 0.3 : 0;
        break;
      }
      case 'charging': {
        const prev = s.c;
        s.c = Math.min(1, s.c + dt / CHARGE_MS);
        [0.33, 0.66, 0.9].forEach((th) => { if (prev < th && s.c >= th) fx.cap(); });
        [25, 50, 75].forEach((q) => { if (s.c * 100 >= q && s.announced < q) { s.announced = q; announce(`${q}%`); } });
        const c = s.c;
        g = 0.15 + 0.85 * c;
        const A = c > 0 ? floorA(0.4 + 3.6 * c * c, 1.5 * Math.min(1, c / 0.6)) : 0.4, f = 14 + 18 * c;
        const w = wob(A, f); x = w.x; y = w.y; r = 0.12 * c * vnoise(s.vph * 0.8 + 33);
        const j = s.t - s.jolt;
        if (j < 120) { const k = 1 - j / 120; x -= 3 * k; y += 1.5 * k; g += 0.35 * k; } // re-hold jolt + hub flash
        motion = c > 0.6 ? (c - 0.6) / 0.4 : 0;
        hf = 110 + 410 * c; hg = 0.04 + 0.06 * c; hlp = 600 + 2400 * c; ringSpeed = 0.3 + 2.2 * c;
        tremor = A * K * 0.5;
        if (s.c >= 1) { s.c = 1; s.peak = 1; s.path = 'full'; enter('full'); fx.full(); announce('Full charge'); setLabel('LAUNCHING…'); }
        break;
      }
      case 'powerdown': {
        const m = s.mini ? MINI : PD;
        const p = pCurve(pt, s.c0, m), rel = s.c0 > 0 ? p / s.c0 : 0;
        s.c = p;
        g = (0.15 + 0.85 * p) * rel;
        const A = (0.4 + 3.6 * s.c0 * s.c0) * Math.exp(-pt / 150), w = wob(A, 14 + 18 * p); x = w.x; y = w.y;
        ringSpeed = -(0.3 + 2.2 * p); // rings run back to the breech
        if (!s.mini && pt >= PD.thunk && pt <= PD.thunk + 160) y += 2 * Math.sin(Math.PI * (pt - PD.thunk) / 160); // settle
        if (!s.mini && !s.abort && !s.swapped && pt >= PD.swap) { // swap under the thunk; coil in 05/06 is baked dim
          s.swapped = true; setPose(s.count === 1 ? '05' : '06', PD.fade);
        }
        if (!s.mini && PD.ticks.some((ms) => pt >= ms && pt < ms + 40)) g *= 0.2; // hub blinks off on each relay tick
        hg = 0; // the whine voice carries the sound (same p(t))
        if (pt >= m.dur) { s.c = 0; whine = null; sched = []; enter('idle'); }
        break;
      }
      case 'third': ({ x, y, r, g, motion, arcOn, flash, bloomOp, hf, hg, hlp, hSnap, ringSpeed, tremor } = runThird(pt, wob, floorA)); break;
      case 'full': ({ x, y, r, g, motion, flash, bloomOp, hf, hg, hlp, ringSpeed, tremor } = runFull(pt, wob, floorA)); break;
      case 'flight': runFlight(pt, rm); break;
      case 'forest': runForest(pt, rm); break;
      default: break;
    }

    if (['idle', 'charging', 'powerdown', 'third', 'full'].includes(s.phase)) {
      if (rm) { // reduced motion: no physical rig movement; the energy pulses and the meter trembles instead
        if (x || y) g = clamp(g + 0.12 * Math.min(1, Math.hypot(x, y) / 4) * Math.sin(s.t / 1000 * TAU * 6));
        x = 0; y = 0; r = 0;
      } else tremor = 0;
      drawRig({ x, y, r, g: clamp(g), motion, arcOn, flash, bloomOp, ringSpeed, dt, rm });
      if (s.phase !== 'third' || hf) humSet(hf, hg, hlp, hSnap);
      drawMeter(tremor);
    }
    drawSmoke(dt, rm);
  }

  // ---------- Setup beats 01–03, then the hard cut to 04 ----------
  function runSetup(t) {
    view.style.visibility = 'visible';
    view.style.opacity = clamp(t / SETUP.fadeIn).toFixed(3);
    if (t >= SETUP.say1 && once('say1')) { sayLine(LINES.inspect); announce(`Valenté: ${LINES.inspect}`); }
    if (t >= SETUP.say1Off && once('say1Off')) sayLine('');
    if (t >= SETUP.p02 && once('p02')) showSetupPose('02');
    if (t >= SETUP.p03 && once('p03')) showSetupPose('03');
    if (t >= SETUP.say2 && once('say2')) { sayLine(LINES.goggles); announce(`Valenté: ${LINES.goggles}`); }
    if (t >= SETUP.say2Off && once('say2Off')) sayLine('');
    if (t >= SETUP.cut04 && s.ready) cutTo04();
  }
  function showSetupPose(p) { Object.entries(setupPoses).forEach(([k, el]) => { el.style.visibility = k === p ? 'visible' : 'hidden'; }); s.pose = p; }
  function cutTo04() {
    setupEl.style.visibility = 'hidden'; rig.style.visibility = 'visible';
    s.pose = null; setPose('04'); s.prev = null;
    humStart(); enter('idle');
    s.pushT = s.t;
  }

  // ---------- Third interruption: familiar, then wrong, then still, then WHUMP ----------
  function runThird(t, wob, floorA) {
    const o = { x: 0, y: 0, r: 0, g: 0, motion: 0, arcOn: false, flash: 0, bloomOp: 0, hf: 0, hg: 0, hlp: 2600, hSnap: false, ringSpeed: 0, tremor: 0 };
    if (t < T3.stutter) { // B1: identical to the clean power-down
      const p = pCurve(t, s.c0, PD), rel = s.c0 > 0 ? p / s.c0 : 0;
      s.c = p; o.g = (0.15 + 0.85 * p) * rel; o.ringSpeed = -(0.3 + 2.2 * p);
      const w = wob((0.4 + 3.6 * s.c0 * s.c0) * Math.exp(-t / 150), 14 + 18 * p); o.x = w.x; o.y = w.y;
      o.hf = 0; // the whine voice
    } else if (t < T3.shake) { // B2: stutter / pitch glitch
      if (s.t > s.gStep) { s.gVal = 0.2 + 0.8 * Math.random(); s.gStep = s.t + 40 + 30 * Math.random(); s.hfG = 160 * (Math.random() > 0.5 ? 1.5 : 0.7); }
      o.g = s.gVal; s.c = 0.15 * s.gVal;
      const w = wob(1, 20); o.x = w.x; o.y = w.y; o.tremor = 1.5;
      o.hf = s.hfG; o.hg = 0.05; o.hlp = 1600; o.hSnap = true;
    } else if (t < T3.freeze) { // B3–B4: 07 enters under a flicker frame; shake, arcs, smoke
      if (once('p07')) { setPose('07'); s.prev = null; }
      if (t < T3.shake + T3.flicker) o.flash = 0.55;
      const k = (t - T3.shake) / (T3.freeze - T3.shake), A = floorA(6 + 4 * k, 1.5), ph = TAU * 10 * t / 1000;
      o.x = A * Math.sin(ph) + (Math.random() - 0.5) * 1.5; o.y = 0.4 * A * Math.sin(ph + 1); o.r = 0.8 * Math.sin(ph + 0.5);
      if (s.t > s.gStep) { s.gVal = (0.3 + 0.7 * k) * (0.6 + 0.4 * Math.random()); s.gStep = s.t + 40 + 30 * Math.random(); }
      o.g = s.gVal; s.c = Math.min(1, 0.3 + 0.7 * k); o.ringSpeed = 0.3 + 2.2 * s.c;
      o.arcOn = t > T3.arcs; o.tremor = 2;
      o.hf = 180 + 720 * k + 25 * Math.sin(TAU * 8 * t / 1000); o.hg = 0.06 + 0.03 * k;
      if (t > 700 && once('smokeA')) { puff(500, 520, 5); puff(500, 605, 5); }
      if (t > 1000 && once('smokeB')) puff(870, 800, 6);
      if (t > 1200 && once('smokeC')) puff(500, 520, 3);
    } else if (t < T3.whump) { // B5: dead still, near silence
      o.g = 1; s.c = 1; o.hf = 3200; o.hg = 0.004; o.hlp = 6000;
    } else { // B6: WHUMP — the banana leaves
      const u = (t - T3.whump) / 1000;
      Object.assign(o, launch(u, t - T3.whump, 10, 6, 0.6, 1));
      if (once('whumpSmoke')) { puff(500, 520, 4); puff(500, 605, 4); puff(870, 800, 5); s.path = 'third'; announce('Whump!'); setLabel('LAUNCHING…'); }
      if (t >= T3.cut) cutToFlight();
    }
    return o;
  }
  function runFull(t, wob, floorA) {
    const o = { x: 0, y: 0, r: 0, g: 1, motion: 1, flash: 0, bloomOp: 0, hf: 520, hg: 0.1, hlp: 3000, ringSpeed: 2.5, tremor: 0 };
    if (t < FULL.whump) { // 250 ms at maximum glow and buzz
      s.c = 1;
      const w = wob(floorA(4, 1.5), 32); o.x = w.x; o.y = w.y; o.r = 0.12 * vnoise(s.vph + 11); o.tremor = 2;
    } else {
      Object.assign(o, launch((t - FULL.whump) / 1000, t - FULL.whump, 8, 5, 0.5, 0.9), { motion: 0 });
      if (t >= FULL.cut) cutToFlight();
    }
    return o;
  }
  // Recoil, flash, muzzle bloom over A6 (hides the baked cradle banana) and the selected banana leaving on the barrel axis.
  function launch(u, ms, rx, ry, rr, peak) {
    const damp = Math.exp(-u * 12) * Math.cos(u * 40);
    if (s.shotT < 0) {
      s.shotT = s.t; s.c = 0;
      shot.src = choiceImg(); shot.style.visibility = 'visible';
    }
    const dist = 1500 * u, rm = reduced();
    const sx = A6.x + dist * Math.cos(BARREL) - SHOT.w / 2, sy = A6.y + dist * Math.sin(BARREL) - SHOT.h / 2;
    shot.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) rotate(${rm ? 0 : (720 * u).toFixed(1)}deg) scale(${(1 - 0.4 * Math.min(1, u * 4)).toFixed(3)})`;
    return {
      x: -rx * damp, y: ry * damp, r: -rr * damp, g: Math.max(0, 1 - u * 3), motion: 0, arcOn: false,
      flash: ms < 33 ? peak : Math.max(0, peak - (ms - 33) / 220), bloomOp: 1, hf: 60, hg: 0, ringSpeed: 0, tremor: 0,
    };
  }

  // ---------- Rig render (L1 plates, L2 energy, L3 arcs, L4 motion, L6 flash, bloom) ----------
  function drawRig({ x, y, r, g, motion, arcOn, flash, bloomOp, ringSpeed, dt, rm }) {
    rig.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`;
    // Camera push-in on the cut to 04 (1.06 → 1.00 over 700 ms).
    const pu = s.pushT === undefined ? 1 : clamp((s.t - s.pushT) / SETUP.push);
    cam.style.transform = rm || pu >= 1 ? '' : `scale(${(1.06 - 0.06 * easeOut(pu)).toFixed(4)})`;
    if (!s.armed && pu >= 1 && s.ready && s.phase === 'idle') arm();
    // Plates: one visible; 90 ms crossfade only for the power-down settle.
    const fk = s.fadeMs ? clamp((s.t - s.fadeAt) / s.fadeMs) : 1;
    Object.entries(plates).forEach(([p, el]) => {
      let op = 0, z = 1;
      if (p === s.pose) { op = s.prev && fk < 1 ? fk : 1; z = 3; } else if (p === s.prev && fk < 1) { op = 1; z = 2; }
      el.style.opacity = op; el.style.zIndex = z;
    });
    // L2 energy
    const c = s.c, live04 = s.pose === '04' || s.pose === '07';
    s.ringPh += dt / 1000 * ringSpeed;
    coil.setAttribute('opacity', ((0.1 + 0.9 * g) * (live04 ? 1 : 0.4) * (g > 0.01 ? 1 : 0)).toFixed(3));
    ringsG.setAttribute('opacity', (g > 0.05 ? Math.min(1, 0.2 + g) : 0).toFixed(3));
    rings.forEach((el, i) => el.setAttribute('cx', (985 + ((((i / 6) + s.ringPh) % 1 + 1) % 1) * 290).toFixed(1)));
    const pulse = c > 0.5 ? 1 + 0.04 * Math.sin(s.t / 1000 * TAU * 4) : 1;
    hub.setAttribute('opacity', (g < 0.02 ? 0 : Math.min(1, (0.2 + 0.8 * g) * pulse)).toFixed(3));
    caps.forEach((el, i) => el.setAttribute('opacity', (c >= [0.33, 0.66, 0.9][i] ? 0.25 + 0.75 * g : 0.04 * (g > 0.02 ? 1 : 0)).toFixed(3)));
    table.setAttribute('opacity', (g > 0.02 ? 0.1 + 0.6 * g : 0).toFixed(3));
    const padFlick = c > 0.85 ? (Math.random() > 0.25 ? 1 : 0.3) : 1;
    pads.setAttribute('opacity', (g > 0.02 ? (0.1 + 0.6 * g) * padFlick : 0).toFixed(3));
    // L4 motion lines: cradle and pads only, never over 07 (its arcs around Valenté are baked).
    motionG.setAttribute('opacity', (s.pose === '04' ? motion : 0).toFixed(3));
    if (motion > 0 && !rm) motionG.setAttribute('transform', `translate(${((Math.random() - 0.5) * 3).toFixed(1)} ${((Math.random() - 0.5) * 3).toFixed(1)})`);
    // L3 arcs (third interruption only), redrawn every 50–70 ms between barrel and capacitor anchors.
    if (arcOn && s.t > s.arcAt) {
      s.arcAt = s.t + 50 + 20 * Math.random();
      const pts = [bolt(1000, 345, 1270, 258, 9, 18), bolt(450, 470, 560, 630, 7, 14), bolt(600, 470, 760, 400, 6, 12)];
      arcLines.forEach((el, i) => el.setAttribute('points', pts[i % 3]));
    }
    arcsG.setAttribute('opacity', arcOn ? '1' : '0');
    flashEl.style.opacity = flash.toFixed(3);
    bloom.style.opacity = bloomOp.toFixed(3);
  }
  function bolt(x1, y1, x2, y2, n, amp) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, pts = [];
    for (let i = 0; i <= n; i++) {
      const k = i / n, o = i === 0 || i === n ? 0 : (Math.random() - 0.5) * 2 * amp;
      pts.push(`${(x1 + dx * k + nx * o).toFixed(1)},${(y1 + dy * k + ny * o).toFixed(1)}`);
    }
    return pts.join(' ');
  }
  function drawMeter(tremor) {
    meterFill.style.transform = `scaleX(${s.c.toFixed(4)})`;
    meterPeak.style.transform = `scaleX(${(s.phase === 'powerdown' ? s.peak : s.c).toFixed(4)})`;
    meterPct.textContent = `${Math.round(s.c * 100)}%`;
    meter.style.transform = tremor ? `translate(${((Math.random() - 0.5) * 2 * tremor).toFixed(2)}px, ${((Math.random() - 0.5) * tremor).toFixed(2)}px)` : '';
  }

  // ---------- L5 smoke (third interruption only; world space, outside the shake) ----------
  function puff(x, y, n) {
    for (let i = 0; i < n; i++) {
      s.smoke.push({ x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 20, vx: -20 + Math.random() * 40, vy: -40 - Math.random() * 40, r: 18 + Math.random() * 16, o: 0.55 + Math.random() * 0.3 });
    }
    if (s.smoke.length > 40) s.smoke = s.smoke.slice(-40);
  }
  function drawSmoke(dt, rm) {
    if (!s.smoke.length && !s.smokeDrawn) return;
    const k = dt / 1000, drift = rm ? 0.35 : 1;
    s.smoke = s.smoke.map((m) => ({ ...m, x: m.x + m.vx * k * drift, y: m.y + m.vy * k * drift, r: m.r + 26 * k, o: m.o - 0.32 * k })).filter((m) => m.o > 0);
    sctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
    sctx.clearRect(0, 0, 1672, 941);
    s.smoke.forEach((m) => {
      const gr = sctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      gr.addColorStop(0, `rgba(150,166,188,${m.o.toFixed(3)})`); gr.addColorStop(0.7, 'rgba(150,166,188,0)');
      sctx.fillStyle = gr; sctx.beginPath(); sctx.arc(m.x, m.y, m.r, 0, TAU); sctx.fill();
    });
    s.smokeDrawn = s.smoke.length > 0;
  }

  // ---------- Hand over to the flight (both paths converge here) ----------
  function arm() {
    s.armed = true; btn.disabled = false; setLabel('HOLD TO CHARGE'); hint.textContent = '';
    window.BX.guide(btn, 'Press and hold HOLD TO CHARGE', 'Press and hold HOLD TO CHARGE');
    announce('Press and hold to charge the launcher');
  }
  function cutToFlight() {
    humStop(); whineStop();
    view.style.display = 'none'; shot.style.visibility = 'hidden'; // display: its layers set their own visibility
    ctrl.classList.add('is-gone'); btn.disabled = true; window.BX.clearGuide();
    s.smoke = []; drawSmoke(0, false);
    proj.src = choiceImg(); proj.dataset.pick = (window.BX.getChoice() || { key: 'ripe' }).key;
    map.style.visibility = 'visible'; map.style.opacity = '1';
    placeProjectile(P.nott[0], P.nott[1], tangent(0), 1, 0); proj.style.visibility = 'visible';
    enter('flight');
  }

  // ---------- Flight: Nottingham → (stall) → descent onto Leicester ----------
  function placeProjectile(x, y, ang, sy, dy) {
    const sc = map.clientWidth / 1000;
    proj.style.transform = `translate(${(x * sc).toFixed(1)}px, ${(y * sc + dy).toFixed(1)}px) translate(-50%, -50%) rotate(${ang.toFixed(3)}rad) scaleY(${sy.toFixed(3)})`;
  }
  function runFlight(ft, rm) {
    const pu = (s.t % 2400) / 2400;
    tfyPulse.setAttribute('r', (16 + 22 * pu).toFixed(1)); tfyPulse.style.opacity = (rm ? 0.5 : 0.8 * (1 - pu)).toFixed(3);
    const a0 = tangent(L * STALL);
    let x, y, ang;
    if (ft < FLIGHT.A) { // confident: along the intended curve to 32 %
      const len = L * STALL * easeOut(ft / FLIGHT.A), p = path.getPointAtLength(len);
      x = p.x; y = p.y; ang = tangent(len);
    } else if (ft < FLIGHT.B) { // stall
      const u = (ft - FLIGHT.A) / (FLIGHT.B - FLIGHT.A);
      x = stallPt.x + Math.cos(a0) * 6 * u; y = stallPt.y + Math.sin(a0) * 6 * u + 3 * u;
      ang = a0 + (rm ? 0 : 0.18 * Math.sin(u * TAU));
    } else if (ft < FLIGHT.C) { // descent: gravity wins, onto Leicester
      const u = (ft - FLIGHT.B) / (FLIGHT.C - FLIGHT.B);
      if (once('whistle')) { fx.whistle(); announce('Descending'); }
      const sx = stallPt.x + Math.cos(a0) * 6, sy0 = stallPt.y + Math.sin(a0) * 6 + 3;
      x = sx + (P.leic[0] - sx) * u; y = sy0 + (P.leic[1] - sy0) * u * u;
      ang = rm ? a0 : a0 + Math.PI * 3 * u * u;
    } else {
      x = P.leic[0]; y = P.leic[1]; ang = a0 + (rm ? 0 : Math.PI * 3);
      const e = clamp((ft - FLIGHT.C) / 300);
      leicRing.style.opacity = e.toFixed(3); leicLabel.classList.add('is-hit');
      routeLeft.style.opacity = (1 - 0.75 * e).toFixed(3);
      if (once('leic')) announce('Over Leicester');
    }
    placeProjectile(x, y, ang, 1, 0);
    if (ft < FLIGHT.C) { s.trail.push(`${x.toFixed(1)},${y.toFixed(1)}`); trail.setAttribute('points', s.trail.join(' ')); }
    if (ft >= FLIGHT.cut) cutToForest();
  }

  // ---------- Leicester: canopy, rustle, thud, fox, verdict, 08 ----------
  function cutToForest() {
    map.style.visibility = 'hidden'; map.style.opacity = '0'; proj.style.visibility = 'hidden';
    const img = choiceImg();
    fall.src = img; pendingBanana.src = img;
    const hasForest = !!FOREST_ART.forest;
    forestArt.hidden = !hasForest; if (hasForest) forestArt.src = FOREST_ART.forest;
    pending.hidden = hasForest && !!FOREST_ART.fox.up;
    forest.style.visibility = 'visible';
    enter('forest');
  }
  function beat(label, text) { s.beat = label; forest.dataset.beat = label; pendingBeat.textContent = text; }
  function runForest(t, rm) {
    // 1–4: the banana drops through the treetops (clipped at the canopy line).
    if (t < FOREST.fall) {
      if (once('in')) { beat('fall', 'BANANA DROPS INTO THE CANOPY'); fall.style.visibility = 'visible'; }
      const u = t / FOREST.fall, W = forest.clientWidth, H = forest.clientHeight, bw = W * 0.13;
      const x = W * 0.55 - bw / 2 + (rm ? 0 : W * 0.03 * u), y = -bw + (H * 0.74 + bw) * u * u;
      fall.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rm ? 0 : (300 * u).toFixed(1)}deg)`;
    } else if (once('rustle')) { fall.style.visibility = 'hidden'; beat('rustle', 'RUSTLE…'); fx.rustle(); announce('Rustling leaves'); }
    if (t >= FOREST.thud && once('thud')) { beat('thud', 'THUD.'); fx.thud(); announce('Thud'); }
    if (t >= FOREST.thud + 400 && once('hold')) beat('hold', '…');
    // 8–11: the fox (art pending; the placeholder shows the player's banana so the carried choice can be checked).
    if (t >= FOREST.foxIn && once('foxIn')) { beat('fox-up', 'FOX APPEARS — BANANA IN ITS MOUTH'); setFox('up'); fx.rustle(0.25, 0.06); announce('A fox appears with the banana'); }
    if (t >= FOREST.lookL && once('lookL')) { beat('fox-left', 'FOX LOOKS LEFT'); setFox('left'); }
    if (t >= FOREST.lookR && once('lookR')) { beat('fox-right', 'FOX LOOKS RIGHT'); setFox('right'); }
    if (t >= FOREST.foxOut && once('foxOut')) { beat('fox-gone', 'FOX DISAPPEARS INTO THE FOREST'); setFox(null); fx.rustle(0.25, 0.06); announce('The fox is gone'); }
    const foxRise = t >= FOREST.foxIn && t < FOREST.foxOut ? clamp((t - FOREST.foxIn) / 220) : t >= FOREST.foxOut ? 1 - clamp((t - FOREST.foxOut) / 220) : 0;
    pendingBanana.style.opacity = foxRise.toFixed(3);
    fox.style.opacity = foxRise.toFixed(3);
    fox.style.transform = rm ? '' : `translateY(${((1 - foxRise) * 30).toFixed(1)}%)`;
    // 12–13: verdict.
    if (t >= FOREST.failed && once('failed')) { beat('verdict', ''); forest.classList.add('is-verdict'); failedEl.classList.add('is-on'); window.BX.sfx.nah(); announce('Failed attempt'); }
    if (t >= FOREST.result && once('result')) { resultEl.classList.add('is-on'); announce('Result: Leicester'); }
    // 14: carry forward with the locked 08 pose (transparent; composited straight over the scene).
    if (t >= FOREST.carry) {
      const u = clamp((t - FOREST.carry) / FOREST.carryIn);
      if (once('carry')) { carry.style.visibility = 'visible'; window.BX.sfx.pop(); }
      carry.style.opacity = u.toFixed(3);
      carry.style.transform = rm ? '' : `translateX(${((1 - easeOut(u)) * 40).toFixed(1)}px)`;
    }
    if (t >= FOREST.done && !s.done) {
      s.done = true; enter('done');
      const cb = onComplete; onComplete = null;
      cb && cb({ attempt: 1, result: 'LEICESTER', path: s.path, interruptions: s.count });
    }
  }
  function setFox(frame) {
    const src = frame && FOREST_ART.fox[frame];
    fox.hidden = !src; fox.dataset.look = frame || '';
    if (src) foxArt.src = src;
  }

  // ---------- Mount / teardown ----------
  function resetDom() {
    view.style.display = ''; view.style.visibility = 'hidden'; view.style.opacity = '0'; cam.style.transform = '';
    setupEl.style.visibility = ''; rig.style.visibility = ''; rig.style.transform = '';
    Object.values(setupPoses).forEach((el) => { el.style.visibility = el.dataset.pose === '01' ? 'visible' : 'hidden'; });
    Object.values(plates).forEach((el) => { el.style.opacity = '0'; el.style.zIndex = ''; });
    [coil, ringsG, hub, table, pads, motionG, arcsG, ...caps].forEach((el) => el.setAttribute('opacity', '0'));
    flashEl.style.opacity = '0'; bloom.style.opacity = '0'; shot.style.visibility = 'hidden';
    sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.clearRect(0, 0, smokeCv.width, smokeCv.height);
    sayLine('');
    map.style.opacity = '0'; map.style.visibility = 'hidden'; proj.style.visibility = 'hidden'; trail.setAttribute('points', '');
    leicRing.style.opacity = '0'; leicLabel.classList.remove('is-hit'); routeLeft.style.opacity = '1';
    forest.style.visibility = 'hidden'; forest.classList.remove('is-verdict'); forest.dataset.beat = '';
    fall.style.visibility = 'hidden'; fox.hidden = true; pendingBanana.style.opacity = '0'; pendingBeat.textContent = '';
    failedEl.classList.remove('is-on'); resultEl.classList.remove('is-on');
    carry.style.visibility = 'hidden'; carry.style.opacity = '0'; carry.style.transform = '';
    ctrl.classList.remove('is-gone'); btn.disabled = true; btn.classList.remove('is-held'); setLabel('HOLD TO CHARGE'); hint.textContent = '';
    meterFill.style.transform = 'scaleX(0)'; meterPeak.style.transform = 'scaleX(0)'; meterPct.textContent = '0%'; meter.style.transform = '';
    live.textContent = '';
  }
  function teardown() {
    cancelAnimationFrame(raf); raf = 0; lastTs = null;
    humStop(); whineStop(); schedStop();
    s = null; onComplete = null;
  }
  function start(opts = {}) {
    teardown();
    resetDom();
    onComplete = opts.onComplete || null;
    s = fresh();
    const st = s;
    show('p2-attempt01', 'PART 2 // ATTEMPT 01');
    layout();
    preload().then(() => { if (s === st) s.ready = true; });
    // Plate 01 must be on screen before the setup clock starts.
    setupPoses['01'].decode().catch(() => {}).then(() => { if (s === st) raf = requestAnimationFrame(frame); });
  }

  window.BX.startAttempt01 = start;
  window.BX.preloadAttempt01 = preload;
  window.BX.resetAttempt01 = () => { teardown(); resetDom(); };
  // Read-only state for development checks.
  window.BX.attempt01State = () => s && {
    phase: s.phase, pose: s.pose, c: s.c, count: s.count, held: s.held, t: s.t, phaseT: s.phaseT, ready: s.ready, armed: s.armed,
    path: s.path, beat: s.beat, done: s.done, smoke: s.smoke.length, shot: shot.style.visibility === 'visible' ? shot.getAttribute('src') : null,
  };
})();
