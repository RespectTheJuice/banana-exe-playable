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
  // Clean power-down (review pass 02: 1700 ms). Release impact → strong early drop (fast term) → long descending whine →
  // slow mechanical spin-down (slow term) → settle thunk. Power reaches zero at `end`; the pose swaps under the thunk.
  const PD = { dur: 1700, fast: 150, slow: 620, share: 0.5, taper: 1260, end: 1540, vibTau: 450, thunk: 1440, swap: 1460, fade: 90, ticks: [1560, 1640] };
  const MINI = { dur: 300, fast: 90, slow: 90, share: 1, taper: 300, end: 300, vibTau: 150 };
  const REACT_HOLD = 3000; // 05 / 06 hold after the swap before the rig returns to 04 by itself
  // Third release (review pass 02): HE loses his temper → HE shakes it → HE breaks it.
  // Familiar wind-down, something feels off, 07 angry face held still, THEN the shake, the machine reacts, escalates,
  // peaks, goes dead with a flatline tone, silence, WHUMP.
  const T3 = { wrong: 600, anger: 1000, shake: 1450, react: 1650, arcsSparse: 2000, grow: 2300, peak: 2650, dead: 2850, flat: 650, whump: 3800, cut: 4050 };
  const FULL = { whump: 700, cut: 950 }; // full-charge plateau: 700 ms at maximum, then launch
  const SETUP = { fadeIn: 300, say1: 500, say1Off: 2900, p02: 3100, p03: 4500, say2: 4700, say2Off: 7000, cut04: 7200, push: 700 };
  const FOREST = { fall: 1300, thud: 2700, pause: 3150, foxIn: 5650, foxMove: 350, lookL: 6950, lookR: 8400, foxOut: 9800, failed: 11300, result: 12850, carry: 14850, carryIn: 550, done: 16750 };
  const LINES = { inspect: 'How do I use this thing?', goggles: 'Let me at least put my goggles on.' };

  // Controlled art for the Leicester gag has not been supplied yet. When it lands, set the paths here (fox: one frame
  // per beat) and, if the fox frames leave the mouth empty for the player's banana, its anchor in % of the frame.
  // Until then a labelled review placeholder carries the timing. No forest or fox art is drawn in code.
  const FOREST_ART = { forest: null, fox: { up: null, left: null, right: null }, mouth: null };

  // Flight (board 10). Beat ORDER is the rule: HOME close → launch → rise → low aerial → TFY destination read → stall →
  // falls short into woodland → only then LEICESTER → forest / fox. The milliseconds are REVIEW timing: they come from the
  // flight-region manifest (sequence_reference_for_review.beats_ms) — tune them there; these are only the fallback.
  const FLIGHT_FALLBACK = { launch: 300, rise: 1500, cruise: 3000, reveal: 4200, stall: 5000, fall: 6000, end: 6600 };
  const FIELD = { w: 1232, h: 652 }; // the board's camera field (manifest camera_rule)

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
  const map = $('#a1-map'), field = $('#a1-field'), wcam = $('#a1-wcam');
  const trail = $('#a1-trail'), proj = $('#a1-proj'), leicLabel = $('#a1-leic-label'), projShadow = $('#a1-proj-shadow');
  const forest = $('#a1-forest'), forestArt = $('#a1-forest-art'), pending = $('#a1-forest-pending'), pendingBeat = $('#a1-pending-beat');
  const pendingBanana = $('#a1-pending-banana'), fall = $('#a1-fall'), fox = $('#a1-fox'), foxArt = $('#a1-fox-art');
  const failedEl = $('#a1-failed'), resultEl = $('#a1-result'), carry = $('#a1-carry');
  const ctrl = $('#a1-ctrl'), btn = $('#a1-btn'), btnCap = btn.querySelector('.a1-btn-cap'), hint = $('#a1-hint');
  const meter = $('#a1-meter'), meterLabel = meter.querySelector('.a1-meter-label'), meterFill = $('#a1-meter-fill'), meterPeak = $('#a1-meter-peak'), meterPct = $('#a1-meter-pct');
  const live = $('#a1-live');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (u) => 1 - (1 - u) ** 3;
  const TAU = Math.PI * 2;

  // ---------- Preload: every plate is fetched and decoded before HOLD is enabled ----------
  const lazy = [...scene.querySelectorAll('img[data-src]')];
  let preloading = null;
  // The flight region is rasterised once here too (part2-world.js rasterRegion), so the launch never waits on it.
  let regionRaster = null;
  function rasterFlightRegion() {
    if (!regionRaster) {
      regionRaster = PW.ready.then(() => {
        const m = Math.max(innerWidth / FIELD.w, 0.25), need = 0.5 * m * (devicePixelRatio || 1); // px per world unit at the rise (z 0.5)
        return PW.rasterRegion($('#a1-region'), need >= 0.3 ? 0.5 : 0.25);
      }).catch(() => false);
    }
    return regionRaster;
  }
  function preload() {
    if (!preloading) {
      preloading = Promise.all([...lazy.map((img) => {
        if (!img.getAttribute('src')) img.src = img.dataset.src;
        return img.decode().catch(() => new Promise((ok) => (img.complete ? ok() : img.addEventListener('load', ok, { once: true }))));
      }), rasterFlightRegion()]);
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
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  const pCurve = (t, c0, m) => (t < m.end ? c0 * (m.share * Math.exp(-t / m.fast) + (1 - m.share) * Math.exp(-t / m.slow)) * (1 - smooth(m.taper, m.end, t)) : 0);
  let whine = null, sched = [];
  function whineStart(c0, f0, m) {
    whineStop();
    const a = audio(); if (!a) return;
    const n = Math.ceil(m.dur / 10) + 1, fr = new Float32Array(n), gn = new Float32Array(n), lp = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1)) * m.dur, rel = c0 > 0 ? pCurve(t, c0, m) / c0 : 0;
      // Louder at the start so the release itself is heard; the same rel drives the glow.
      fr[i] = 55 + (f0 - 55) * Math.pow(rel, 0.6); gn[i] = (0.05 + 0.07 * c0) * rel * (1 + 0.9 * Math.exp(-t / 160)); lp[i] = 300 + 2600 * rel;
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
    impact: () => { // the release itself: contactor drop + a short spark of discharge (no buzzer)
      nz(0, 0.06, 0.24, 'lowpass', 1600, sched); tn(190, 70, 0, 0.11, 0.13, 'triangle', sched);
      nz(0.01, 0.12, 0.06, 'highpass', 2800, sched);
    },
    powerDown: (c0) => { // impact, slow mechanical spin-down under the whine, settle thunk, two relay ticks
      fx.impact();
      tn(36 + 44 * c0, 20, 0.15, 1.3, 0.08, 'triangle', sched);
      tn(70, 42, PD.thunk / 1000, 0.16, 0.18, 'sine', sched);
      nz(PD.thunk / 1000, 0.05, 0.13, 'lowpass', 700, sched);
      PD.ticks.forEach((ms, i) => nz(ms / 1000, 0.015, i ? 0.04 : 0.05, 'highpass', 3000, sched));
    },
    third: () => { // familiar impact; his shaking makes the knocks, then the rattle builds; dead → flatline; WHUMP
      fx.impact();
      for (let ms = T3.shake; ms < T3.grow; ms += 166) { // deliberate shakes (6 Hz): the machine knocks on each one
        const k = (ms - T3.shake) / (T3.grow - T3.shake);
        nz(ms / 1000, 0.07, 0.07 + 0.06 * k, 'bandpass', 420 + 160 * Math.random(), sched); tn(80, 52, ms / 1000, 0.07, 0.06 + 0.04 * k, 'triangle', sched);
      }
      for (let ms = T3.react + 100; ms < T3.dead; ms += 91) { // the machine's own instability, building to the peak
        const k = (ms - T3.react) / (T3.dead - T3.react);
        nz(ms / 1000, 0.05, 0.03 + 0.12 * k, 'bandpass', 700 + 500 * Math.random(), sched);
        tn(140 + 60 * Math.random(), 90, ms / 1000, 0.04, 0.02 + 0.07 * k, 'square', sched);
      }
      fx.hold(1000, T3.dead / 1000, T3.flat / 1000, 0.06, 'sine', sched);   // flatline: alive → chaos → DEAD
      fx.hold(2000, T3.dead / 1000, T3.flat / 1000, 0.012, 'triangle', sched);
      fx.whump(T3.whump / 1000, sched);
    },
    full: () => { // reaches 100 %: a rising lock-in, then the fully charged tone sustains through the plateau
      tn(520, 1040, 0, 0.2, 0.05, 'triangle', sched);
      fx.hold(1040, 0.18, FULL.whump / 1000 - 0.18, 0.04, 'triangle', sched, 7);
      fx.whump(FULL.whump / 1000, sched);
    },
    hold: (f, at, dur, vol, type = 'sine', group = null, vib = 0) => { // a flat, sustained tone (optional vibrato)
      const a = audio(); if (!a || muted()) return;
      const t = a.currentTime + at, o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (vib) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = vib; lg.gain.value = f * 0.006; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + 0.05); if (group) group.push(l); }
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.setValueAtTime(vol, t + dur - 0.03); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(bus()); o.start(t); o.stop(t + dur + 0.02);
      if (group) group.push(o);
    },
    whump: (at, g) => {
      tn(120, 35, at, 0.28, 0.4, 'sine', g); nz(at, 0.09, 0.32, 'lowpass', 1500, g);
      tn(2000, 200, at, 0.15, 0.06, 'sawtooth', g); nz(at + 0.05, 0.6, 0.05, 'lowpass', 500, g);
    },
    whistle: (dur = 0.7) => tn(1500, 420, 0, dur, 0.035, 'sine'),
    // Foliage: continuous filtered noise with slow, irregular envelopes (no clusters of short hard transients).
    foliage: ({ dur, vol, bands, atk = 0.06, rel = 0.3, sweep = 1, gust = 0.45, branch = null }) => {
      const a = audio(); if (!a || muted()) return;
      if (!noiseBuf) nz(0, 0.001, 0.0001); // creates the shared noise buffer
      const t0 = a.currentTime + 0.01, n = Math.ceil(dur * 60) + 2, env = new Float32Array(n);
      let w = 0.6, target = 0.6;
      for (let i = 0; i < n; i++) {
        const t = (i / (n - 1)) * dur;
        if (i % 6 === 0) target = 1 - gust + gust * Math.random(); // a new gust every ~100 ms, glided to
        w += (target - w) * 0.18;
        env[i] = vol * w * smooth(0, atk, t) * (1 - smooth(dur - rel, dur, t)) + 0.0001;
      }
      const eg = a.createGain(); eg.gain.setValueCurveAtTime(env, t0, dur); eg.connect(bus());
      bands.forEach(([f, q, g]) => {
        const src = a.createBufferSource(), bp = a.createBiquadFilter(), bg = a.createGain();
        src.buffer = noiseBuf; src.loop = true; src.playbackRate.value = 0.85 + 0.3 * Math.random();
        bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f, t0);
        if (sweep !== 1) bp.frequency.exponentialRampToValueAtTime(f * sweep, t0 + dur);
        bg.gain.value = g; src.connect(bp).connect(bg).connect(eg);
        src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
      });
      if (branch) { // one soft branch movement: a low swish, not a click
        const [at, d, v] = branch, src = a.createBufferSource(), lp = a.createBiquadFilter(), g = a.createGain(), t = t0 + at;
        src.buffer = noiseBuf; lp.type = 'bandpass'; lp.Q.value = 1.4; lp.frequency.setValueAtTime(700, t); lp.frequency.exponentialRampToValueAtTime(320, t + d);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + d * 0.35); g.gain.linearRampToValueAtTime(0.0001, t + d);
        src.connect(lp).connect(g).connect(bus()); src.start(t, 0.3); src.stop(t + d + 0.05);
      }
    },
    canopy: () => fx.foliage({ dur: 1.1, vol: 0.32, atk: 0.07, rel: 0.45, gust: 0.5, bands: [[3800, 0.7, 1], [1500, 0.9, 0.55], [7000, 0.8, 0.3]], branch: [0.34, 0.2, 0.16] }),
    foxIn: () => fx.foliage({ dur: 0.4, vol: 0.24, atk: 0.05, rel: 0.18, gust: 0.35, bands: [[2400, 1.1, 1], [850, 1.0, 0.5]] }),
    foxOut: () => fx.foliage({ dur: 0.55, vol: 0.15, atk: 0.04, rel: 0.35, gust: 0.4, sweep: 0.55, bands: [[3200, 0.9, 1], [1200, 1.0, 0.35]] }),
    thud: () => { tn(95, 45, 0, 0.25, 0.26, 'sine'); nz(0, 0.08, 0.16, 'lowpass', 500); },
  };

  // ---------- Flight world geometry (board 10, from the shared Part 2 world + the region manifest) ----------
  const PW = window.BX.p2World;
  const sm = (k) => { k = clamp(k); return k * k * (3 - 2 * k); }, eo = (k) => 1 - Math.pow(1 - clamp(k), 3), lerp = (a, b, k) => a + (b - a) * k;
  let FG = null;
  function flightGeo() {
    if (FG && FG.fromManifest) return FG;
    const m = PW.manifest(), run = m ? m.runtime_assets_above_the_region_not_included : null;
    const cl = run ? run.find((r) => r.order === 10).placement : { launcher_ground: [314, 427], valente_ground: [271, 432], valente_height: 35 };
    const tf = run ? run.find((r) => r.order === 11).placement : { tfy_ground_centre: [6102.4, -1810], tfy_box: [5952.4, -2044, 300, 300] };
    const seq = m ? m.sequence_reference_for_review : null;
    const C = PW.placeCluster({ launcherGround: cl.launcher_ground, valenteGround: cl.valente_ground, vu: cl.valente_height, pose: 'flight' });
    const TFYP = tf.tfy_ground_centre, box = { x: tf.tfy_box[0], y: tf.tfy_box[1], s: tf.tfy_box[2] };
    FG = {
      T: { ...FLIGHT_FALLBACK, ...(seq ? seq.beats_ms : {}) }, C, LG: cl.launcher_ground,
      HOMEG: PW.G(cl.launcher_ground[0], cl.launcher_ground[1]), TFYP, TFYG: PW.G(TFYP[0], TFYP[1]), box, hook: PW.tfyHook(box),
      LANDP: seq ? seq.landing_point_world : [2612.44, -510], keys: seq ? seq.camera_keys : null, fromManifest: !!m,
    };
    FG.LAND = PW.G(FG.LANDP[0], FG.LANDP[1]);
    FG.NOTT = PW.P(380, -140);
    return FG;
  }
  // banana: ground position along HOME → TFY and altitude (world px); the shot leaves the cradle, never the launcher centre
  function bananaAt(ms) {
    const { T, C, LG, HOMEG: g0, TFYG, LAND } = flightGeo();
    const along = (k) => [g0[0] + (TFYG[0] - g0[0]) * k, g0[1] + (TFYG[1] - g0[1]) * k];
    const dx0 = C.cradle[0] - LG[0], a0 = LG[1] - C.cradle[1];
    if (ms < T.launch) return { g: g0, alt: a0, pre: true, dx: dx0 };
    if (ms < T.rise) { const k = (ms - T.launch) / (T.rise - T.launch); return { g: along(0.12 * eo(k)), alt: lerp(a0, 700, eo(k)), dx: dx0 * (1 - eo(k)) }; }
    if (ms < T.reveal) { const k = (ms - T.rise) / (T.reveal - T.rise); return { g: along(0.12 + 0.26 * k), alt: 700 + 150 * Math.sin(k * Math.PI / 2) }; }
    if (ms < T.stall) { const k = (ms - T.reveal) / (T.stall - T.reveal); return { g: along(0.38 + 0.025 * eo(k)), alt: 850 - 30 * k * k, wob: Math.sin(k * Math.PI * 3) }; }
    const k = clamp((ms - T.stall) / (T.fall - T.stall)), a = along(0.405);
    return { g: [lerp(a[0], LAND[0], k), lerp(a[1], LAND[1], k)], alt: 820 * (1 - k * k), falling: true, k };
  }
  // camera: world point at the field centre + zoom. Reduced motion keeps every beat but cuts the large camera travel.
  function cameraAt(ms, rm) {
    const { T, TFYP, LANDP } = flightGeo();
    const K0 = { c: [282, 405], z: 2.4 };
    const lp = LANDP, F = { c: [lp[0] + 40, lp[1] - 160], z: 0.42 };
    if (rm) {
      if (ms < T.rise) return K0;                                   // HOME close (through the launch)
      if (ms < T.fall) { const r = cameraAt(T.reveal, false); return r; } // one wide hold: the journey and the TFY target
      return F;                                                     // down in the woods
    }
    const b = bananaAt(ms), bp = PW.P(b.g[0], b.g[1]), by = [bp[0], bp[1] - b.alt];
    if (ms < T.launch) return K0;
    if (ms < T.rise) { const r = (ms - T.launch) / (T.rise - T.launch), kc = eo(Math.min(1, r * 1.8)); return { c: [lerp(K0.c[0], by[0] + 120, kc), lerp(K0.c[1], (by[1] + bp[1]) / 2, kc)], z: K0.z * Math.pow(0.5 / K0.z, eo(r)) }; }
    if (ms < T.cruise) { const k = sm((ms - T.rise) / (T.cruise - T.rise)); return { c: [by[0] + lerp(120, 260, k), (by[1] + bp[1]) / 2], z: lerp(0.5, 0.36, k) }; }
    const R = { c: [(by[0] + TFYP[0]) / 2 + 80, (by[1] + TFYP[1]) / 2 + 60], z: 0.165 };
    if (ms < T.reveal) { const k = sm((ms - T.cruise) / (T.reveal - T.cruise)); const a = { c: [by[0] + 260, (by[1] + bp[1]) / 2], z: 0.36 }; return { c: [lerp(a.c[0], R.c[0], k), lerp(a.c[1], R.c[1], k)], z: a.z * Math.pow(R.z / a.z, k) }; }
    const k = sm((ms - T.reveal) / (T.fall - T.reveal));
    return { c: [lerp(R.c[0], F.c[0], k), lerp(R.c[1], F.c[1], k)], z: R.z * Math.pow(F.z / R.z, k) };
  }
  const beatAt = (ms) => { const T = flightGeo().T; return ms < T.launch ? 'home' : ms < T.rise ? 'launch' : ms < T.cruise ? 'rise' : ms < T.reveal ? 'aerial' : ms < T.stall ? 'destination' : ms < T.fall ? 'fall' : 'down'; };
  let flightBuilt = false;
  function buildFlight() { // static placement (once): region layers, MAP 02A overlays, the cluster, TFY
    if (flightBuilt) return;
    const g = flightGeo(), px = (e, b) => Object.assign(e.style, { left: `${b.x.toFixed(2)}px`, top: `${b.y.toFixed(2)}px`, width: `${b.w.toFixed(2)}px`, height: `${b.h.toFixed(2)}px` });
    flightBuilt = !!PW.manifest();
    if (!$('#a1-region').childElementCount) PW.mountRegion($('#a1-region')); // raster not ready: the inline layers instead
    const st = PW.ROYAL_SNAIL_STORE, nb = PW.ROYAL_SNAIL_NEIGHBOURHOOD, rs = (e, o) => { e.src = o.src; px(e, { x: o.x - 60, y: o.y - 148, w: o.w, h: o.h }); };
    rs($('#a1-rs-store'), st); rs($('#a1-rs-local'), nb); $('#a1-rs-local').dataset.status = nb.status;
    px($('#a1-launcher'), g.C.launcher); px($('#a1-valente'), g.C.valente);
    const sh = (id, o, ry) => { const e = $(id); e.setAttribute('cx', o.cx); e.setAttribute('cy', o.cy); e.setAttribute('rx', o.rx.toFixed(2)); e.setAttribute('ry', ry); };
    sh('#a1-lshadow', g.C.shadows.launcher, 4.5); sh('#a1-vshadow', g.C.shadows.valente, 3.2);
    px($('#a1-tfy'), { x: g.box.x, y: g.box.y, w: g.box.s, h: g.box.s });
    px($('#a1-tfy-glow'), { x: g.TFYP[0] - 520, y: g.TFYP[1] - 230, w: 1040, h: 460 });
    px($('#a1-tfy-beam'), { x: g.TFYP[0] - 22, y: g.TFYP[1] - 1400, w: 44, h: 1250 });
    const fl = $('#a1-launchflash'); fl.setAttribute('cx', g.C.cradle[0].toFixed(2)); fl.setAttribute('cy', g.C.cradle[1].toFixed(2));
  }

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
    s.held = true; btn.classList.add('is-held'); btn.classList.remove('is-ready'); setLabel('CHARGING…');
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
      s.abort = true; enter('powerdown'); whineStart(s.c0, s.f0, PD); fx.impact(); return;
    }
    if (s.c < TAP_GUARD) { s.mini = true; enter('powerdown'); whineStart(s.c0, s.f0, MINI); return; }
    s.count += 1;
    if (s.count < 3) {
      enter('powerdown'); whineStart(s.c0, s.f0, PD); fx.powerDown(s.c0);
      announce('Powering down');
    } else {
      enter('third'); s.smoke = []; whineStart(s.c0, s.f0, PD); whineCut(T3.wrong); fx.third();
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
    let x = 0, y = 0, r = 0, g = 0, motion = 0, arcOn = 0, flash = 0, bloomOp = 0, tremor = 0;
    let hf = 110, hg = 0, hlp = 700, hSnap = false, ringSpeed = 0;
    const wob = (A, f) => { s.vph += dt / 1000 * f; return { x: A * vnoise(s.vph), y: 0.5 * A * vnoise(s.vph + 97.3) }; };
    // Shake must stay readable on phones: never below ~1.5 CSS px on screen once it is meant to be felt.
    const floorA = (A, min) => Math.max(A, min / K);

    switch (s.phase) {
      case 'setup': runSetup(pt); break;
      case 'idle': {
        // Reaction hold: 05 / 06 stay up for REACT_HOLD after the swap, then the rig returns to 04, ready.
        if ((s.pose === '05' || s.pose === '06') && s.t - s.swapT >= REACT_HOLD) {
          setPose('04'); s.prev = null; s.jolt = s.t; fx.chirp(); announce('Ready');
        }
        const on = s.pose === '04';
        g = on ? 0.15 : 0; hg = on ? 0.02 : 0;
        const w = wob(on ? 0.4 : 0, 14); x = w.x; y = w.y; // keeps 04's baked motion arcs reading as live
        const j = s.t - s.jolt;
        if (on && j < 160) { const k = 1 - j / 160; x -= 2 * k; y += 1 * k; g += 0.25 * k; } // settles back onto the grips
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
        if (s.c >= 1) { s.c = 1; s.peak = 1; s.path = 'full'; enter('full'); fx.full(); announce('Full charge'); setLabel('LAUNCHING…'); setFull(true); }
        break;
      }
      case 'powerdown': {
        const m = s.mini ? MINI : PD;
        const p = pCurve(pt, s.c0, m), rel = s.c0 > 0 ? p / s.c0 : 0;
        s.c = p;
        g = (0.15 + 0.85 * p) * rel;
        const imp = !s.mini && pt < 90 ? (1 - pt / 90) : 0; // release impact: a kick, then the drain
        const A = (0.4 + 3.6 * s.c0 * s.c0) * Math.exp(-pt / m.vibTau) + 3 * imp, w = wob(A, 14 + 18 * p); x = w.x - 2 * imp; y = w.y + 1.5 * imp;
        g = Math.min(1, g + 0.3 * imp);
        ringSpeed = -(0.3 + 2.2 * p); // rings run back to the breech
        if (!s.mini && pt >= PD.thunk && pt <= PD.thunk + 160) y += 2 * Math.sin(Math.PI * (pt - PD.thunk) / 160); // settle
        if (!s.mini && !s.abort && !s.swapped && pt >= PD.swap) { // swap under the thunk; coil in 05/06 is baked dim
          s.swapped = true; s.swapT = s.t; setPose(s.count === 1 ? '05' : '06', PD.fade);
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
    const o = { x: 0, y: 0, r: 0, g: 0, motion: 0, arcOn: 0, flash: 0, bloomOp: 0, hf: 0, hg: 0, hlp: 2600, hSnap: false, ringSpeed: 0, tremor: 0 };
    const flick = (lo, hi) => { if (s.t > s.gStep) { s.gVal = lo + (hi - lo) * Math.random(); s.gStep = s.t + 40 + 30 * Math.random(); } return s.gVal; };
    if (t < T3.wrong) { // 1. the familiar clean power-down (same curve, same impact) on 04
      const p = pCurve(t, s.c0, PD), rel = s.c0 > 0 ? p / s.c0 : 0, imp = t < 90 ? 1 - t / 90 : 0;
      s.c = p; o.g = Math.min(1, (0.15 + 0.85 * p) * rel + 0.3 * imp); o.ringSpeed = -(0.3 + 2.2 * p);
      const w = wob((0.4 + 3.6 * s.c0 * s.c0) * Math.exp(-t / PD.vibTau) + 3 * imp, 14 + 18 * p); o.x = w.x - 2 * imp; o.y = w.y + 1.5 * imp;
      o.hf = 0; // the whine voice
    } else if (t < T3.anger) { // 2. something feels off: the wind-down stalls and hiccups. The machine does NOT move.
      const k = (t - T3.wrong) / (T3.anger - T3.wrong);
      o.g = 0.18 + 0.08 * Math.sin(TAU * 3 * t / 1000); s.c = 0.12 * (1 - k);
      o.hf = 95 + 18 * Math.sin(TAU * 2.5 * t / 1000); o.hg = 0.03 * (1 - 0.5 * k); o.hlp = 900;
      if (once('wrong')) announce('The launcher stalls');
    } else if (t < T3.shake) { // 3–4. 07: his face turns angry — held completely still so it reads first
      if (once('p07')) { setPose('07'); s.prev = null; announce('Valenté loses his temper'); }
      o.g = 0.18; s.c = 0.06; o.hf = 90; o.hg = 0.015; o.hlp = 700;
    } else if (t < T3.dead) { // 5–9. HE shakes it; the machine reacts a beat later and escalates to a peak
      const k = (t - T3.shake) / (T3.dead - T3.shake), react = clamp((t - T3.react) / (T3.dead - T3.react));
      let A, f;
      if (t < T3.grow) { const u = (t - T3.shake) / (T3.grow - T3.shake); A = 3 + 3.5 * u; f = 6; }                 // deliberate shoves
      else if (t < T3.peak) { const u = (t - T3.grow) / (T3.peak - T3.grow); A = 6.5 + 3.5 * u; f = 6 + 4 * u; }     // escalation
      else { A = 10.5; f = 11; o.flash = Math.random() < 0.12 ? 0.3 : 0; }                                           // peak
      A = floorA(A, 1.5);
      const ph = TAU * f * (t - T3.shake) / 1000;
      o.x = A * Math.sin(ph) + (Math.random() - 0.5) * (t >= T3.peak ? 3 : 1); o.y = 0.4 * A * Math.sin(ph + 1); o.r = 0.8 * (A / 10) * Math.sin(ph + 0.5);
      o.g = t < T3.react ? 0.18 : flick(0.2 + 0.6 * react, 0.5 + 0.5 * react);
      s.c = t < T3.react ? 0.06 : Math.min(1, 0.1 + 0.9 * react); o.ringSpeed = t < T3.react ? 0 : 0.3 + 2.2 * s.c;
      o.arcOn = t < T3.arcsSparse ? 0 : t < T3.grow ? 1 : 3; o.tremor = 1 + 2 * k;
      o.hf = t < T3.react ? 90 : 180 + 720 * react + 25 * Math.sin(TAU * 8 * t / 1000); o.hg = t < T3.react ? 0.015 : 0.04 + 0.06 * react;
      if (once('shaking')) announce('He shakes the launcher');
      if (t > T3.arcsSparse + 100 && once('smokeA')) { puff(500, 520, 4); puff(500, 605, 4); }
      if (t > T3.grow + 50 && once('smokeB')) puff(870, 800, 6);
      if (t > T3.grow + 250 && once('smokeC')) { puff(500, 520, 4); puff(500, 605, 3); }
      if (t > T3.peak && once('smokeD')) { puff(500, 520, 4); puff(870, 800, 4); }
    } else if (t < T3.whump) { // 10. DEAD: everything stops; flatline tone (scheduled), then silence
      o.g = 0; s.c = 0; o.hf = 60; o.hg = 0; o.hSnap = true;
      if (once('dead')) announce('Dead.');
    } else { // WHUMP — the banana leaves anyway
      const u = (t - T3.whump) / 1000;
      Object.assign(o, launch(u, t - T3.whump, 10, 6, 0.6, 1));
      if (once('whumpSmoke')) { puff(500, 520, 4); puff(500, 605, 4); puff(870, 800, 5); s.path = 'third'; announce('Whump!'); setLabel('LAUNCHING…'); }
      if (t >= T3.cut) cutToFlight();
    }
    return o;
  }
  function runFull(t, wob, floorA) {
    const o = { x: 0, y: 0, r: 0, g: 1, motion: 1, flash: 0, bloomOp: 0, hf: 520, hg: 0.1, hlp: 3000, ringSpeed: 2.5, tremor: 0 };
    if (t < FULL.whump) { // the full-charge plateau: maximum glow, buzz and sound
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
      x: -rx * damp, y: ry * damp, r: -rr * damp, g: Math.max(0, 1 - u * 3), motion: 0, arcOn: 0,
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
    if (arcOn && s.t > s.arcAt) { // arcOn = how many arcs (1 = sparse, 3 = dense)
      s.arcAt = s.t + (arcOn > 1 ? 50 + 20 * Math.random() : 110 + 60 * Math.random());
      const pts = [bolt(1000, 345, 1270, 258, 9, 18), bolt(450, 470, 560, 630, 7, 14), bolt(600, 470, 760, 400, 6, 12)];
      arcLines.forEach((el, i) => el.setAttribute('points', i % 3 < arcOn && Math.random() > (arcOn > 1 ? 0 : 0.3) ? pts[i % 3] : ''));
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
  // 100 %: bar, percentage and label turn gold (CHARGE · FULL) for the full-charge sustain. Positions never change.
  function setFull(on) { ctrl.classList.toggle('is-full', on); meterLabel.textContent = on ? 'CHARGE · FULL' : 'CHARGE'; }
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
    window.BX.clearGuide(); btn.classList.add('is-ready'); // the glowing button is the instruction (no extra prompt)
    announce('Press and hold to charge the launcher');
  }
  function cutToFlight() {
    humStop(); whineStop();
    view.style.display = 'none'; shot.style.visibility = 'hidden'; // display: its layers set their own visibility
    ctrl.classList.add('is-gone'); btn.disabled = true; window.BX.clearGuide();
    s.smoke = []; drawSmoke(0, false);
    proj.src = choiceImg(); proj.dataset.pick = (window.BX.getChoice() || { key: 'ripe' }).key;
    buildFlight();
    map.style.visibility = 'visible'; map.style.opacity = '1'; proj.style.visibility = 'visible';
    enter('flight');
    runFlight(0, reduced());
  }

  // ---------- Flight: board 10 camera sequence through one world ----------
  function fitField() { // the board's 1232 × 652 camera field, covering the flight window
    const W = map.clientWidth, H = map.clientHeight, m = Math.max(W / FIELD.w, H / FIELD.h);
    field.style.transform = `translate(${((W - FIELD.w * m) / 2).toFixed(1)}px, ${((H - FIELD.h * m) / 2).toFixed(1)}px) scale(${m.toFixed(4)})`;
    field.style.setProperty('--lf', Math.max(1, 0.85 / m).toFixed(3)); // labels stay readable on small screens
    const x0 = (FIELD.w * m - W) / (2 * m), y0 = (FIELD.h * m - H) / (2 * m);
    return { x0, x1: x0 + W / m, y0, y1: y0 + H / m }; // the part of the field the window actually shows
  }
  function runFlight(ms, rm) {
    const g = flightGeo(), T = g.T;
    const vis = fitField();
    const cam = cameraAt(ms, rm), z = cam.z;
    let tx = FIELD.w / 2 - cam.c[0] * z, ty = FIELD.h / 2 - cam.c[1] * z;
    // The window crops the board's field to its own aspect, so through the destination read the camera pans (never zooms)
    // just enough to keep the whole TFY box inside what is visible; the nudge fades out after the stall.
    const keep = 1 - clamp((ms - T.stall) / 400);
    if (ms >= T.cruise && keep > 0) {
      const M = 14, bx = g.box.x * z + tx, by0 = g.box.y * z + ty, bs = g.box.s * z;
      let dx = 0, dy = 0;
      if (bx + bs > vis.x1 - M) dx = vis.x1 - M - (bx + bs); if (bx + dx < vis.x0 + M) dx = vis.x0 + M - bx;
      if (by0 + bs > vis.y1 - M) dy = vis.y1 - M - (by0 + bs); if (by0 + dy < vis.y0 + M) dy = vis.y0 + M - by0;
      tx += dx * keep; ty += dy * keep;
    }
    wcam.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${z.toFixed(4)})`;
    const scr = (p) => [p[0] * z + tx, p[1] * z + ty];
    const b = bananaAt(ms), bp = PW.P(b.g[0], b.g[1]), bx = bp[0] + (b.dx || 0), by = bp[1] - b.alt;
    // the selected banana: readable at every altitude (≈ 34–46 px on the field)
    const bwPx = Math.max(34, Math.min(46, 9 * z)), bw = bwPx / z, bh = bw * 0.75;
    let rot = -25;
    if (!b.pre && ms < T.reveal) rot = -25 + 15 * clamp((ms - T.rise) / 1500);
    if (ms >= T.reveal && ms < T.stall) rot = -10 + 18 * (b.wob || 0);
    if (b.falling) rot = 20 + 140 * b.k;
    if (rm) rot = b.falling ? 40 : -15;
    const imp = ms > T.fall ? clamp((ms - T.fall) / 450) : 0;
    Object.assign(proj.style, { left: `${(bx - bw / 2).toFixed(1)}px`, top: `${(by - bh / 2).toFixed(1)}px`, width: `${bw.toFixed(1)}px`, height: `${bh.toFixed(1)}px`,
      transform: `rotate(${rot.toFixed(1)}deg)`, opacity: b.pre ? '0' : imp > 0 ? (1 - imp).toFixed(3) : '1' });
    // trail: sampled history up to now, ending exactly at the banana (stops at impact)
    const pts = [];
    for (let t = T.launch; t <= Math.min(ms, T.fall); t += 60) { const q = bananaAt(t), p = PW.P(q.g[0], q.g[1]); pts.push(`${(p[0] + (q.dx || 0)).toFixed(1)},${(p[1] - q.alt).toFixed(1)}`); }
    if (ms > T.launch && ms <= T.fall) pts.push(`${bx.toFixed(1)},${by.toFixed(1)}`);
    trail.setAttribute('points', pts.join(' ')); trail.setAttribute('stroke-width', (3 / z).toFixed(2));
    const sz = Math.max(0.2, 1 - b.alt / 1100);
    Object.entries({ cx: bx, cy: bp[1], rx: bw * 0.4 * sz, ry: bw * 0.12 * sz }).forEach(([k, v]) => projShadow.setAttribute(k, v.toFixed(1)));
    projShadow.setAttribute('opacity', (b.pre ? 0 : 0.45 * sz).toFixed(3));
    const flash = clamp(1 - Math.abs(ms - T.launch - 60) / 260), fl = $('#a1-launchflash');
    fl.setAttribute('r', (8 + 16 * (1 - flash)).toFixed(1)); fl.setAttribute('opacity', (0.85 * flash).toFixed(3));
    const lp = g.LANDP, im = $('#a1-impact');
    im.setAttribute('cx', lp[0]); im.setAttribute('cy', lp[1]); im.setAttribute('r', (30 + 220 * imp).toFixed(1)); im.setAttribute('stroke-width', (4 / z).toFixed(2));
    im.setAttribute('opacity', (0.8 * (1 - imp) * (imp > 0 ? 1 : 0)).toFixed(3));
    $('#a1-homeglow').style.opacity = (0.5 + 0.5 * clamp(1 - (ms - T.rise) / 800)).toFixed(3);
    const reveal = clamp((ms - T.cruise) / 700);
    $('#a1-tfy-glow').style.opacity = (0.35 + 0.65 * reveal).toFixed(3); $('#a1-tfy-beam').style.opacity = (0.9 * reveal).toFixed(3);
    // labels (screen space): NOTTINGHAM / HOME early; TFY + rooftop hook once the destination opens; LEICESTER only after landing
    const lab = (id, p, op) => { const e = $(id); e.style.left = `${p[0].toFixed(1)}px`; e.style.top = `${p[1].toFixed(1)}px`; e.style.opacity = op.toFixed(3); };
    lab('#a1-fl-nott', scr([g.NOTT[0], g.NOTT[1] + 210]), clamp((1.1 - z) / 0.5));
    lab('#a1-leic-label', scr([lp[0], lp[1] + 150]), 0.9 * clamp((ms - T.fall) / 250));
    lab('#a1-tfy-basket', scr(g.hook), 0.9 * reveal);
    lab('#a1-fl-tfy', scr([g.TFYP[0], g.TFYP[1] + 40]), reveal);
    $('#a1-fcut').style.opacity = clamp((ms - T.fall - 250) / 350).toFixed(3);
    // story beats + sound
    s.flightBeat = beatAt(ms); s.flightX = bx; s.flightAlt = b.alt; s.flightU = b.g[0]; s.flightCam = { c: cam.c, z };
    if (ms >= T.stall && once('whistle')) { fx.whistle((T.fall - T.stall) / 1000); announce('Losing height'); }
    if (ms >= T.fall && once('leic')) { leicLabel.classList.add('is-hit'); announce('Down at Leicester'); }
    if (ms >= T.end) cutToForest();
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
    } else if (once('rustle')) { fall.style.visibility = 'hidden'; beat('rustle', 'RUSTLE…'); fx.canopy(); announce('Leaves thrash in the canopy'); }
    if (t >= FOREST.thud && once('thud')) { beat('thud', 'THUD.'); fx.thud(); announce('Thud'); }
    if (t >= FOREST.pause && once('hold')) beat('hold', '…');
    // 8–11: the fox (art pending; the placeholder shows the player's banana so the carried choice can be checked).
    if (t >= FOREST.foxIn && once('foxIn')) { beat('fox-up', 'FOX APPEARS — BANANA IN ITS MOUTH'); setFox('up'); fx.foxIn(); announce('A fox appears with the banana'); }
    if (t >= FOREST.lookL && once('lookL')) { beat('fox-left', 'FOX LOOKS LEFT'); setFox('left'); }
    if (t >= FOREST.lookR && once('lookR')) { beat('fox-right', 'FOX LOOKS RIGHT'); setFox('right'); }
    if (t >= FOREST.foxOut && once('foxOut')) { beat('fox-gone', 'FOX DISAPPEARS INTO THE FOREST'); setFox(null); fx.foxOut(); announce('The fox is gone'); }
    const foxRise = t >= FOREST.foxIn && t < FOREST.foxOut ? clamp((t - FOREST.foxIn) / FOREST.foxMove) : t >= FOREST.foxOut ? 1 - clamp((t - FOREST.foxOut) / FOREST.foxMove) : 0;
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
    map.style.opacity = '0'; map.style.visibility = 'hidden'; proj.style.visibility = 'hidden'; trail.setAttribute('points', ''); projShadow.setAttribute('opacity', '0');
    leicLabel.classList.remove('is-hit'); leicLabel.style.opacity = '0'; $('#a1-fcut').style.opacity = '0';
    forest.style.visibility = 'hidden'; forest.classList.remove('is-verdict'); forest.dataset.beat = '';
    fall.style.visibility = 'hidden'; fox.hidden = true; pendingBanana.style.opacity = '0'; pendingBeat.textContent = '';
    failedEl.classList.remove('is-on'); resultEl.classList.remove('is-on');
    carry.style.visibility = 'hidden'; carry.style.opacity = '0'; carry.style.transform = '';
    ctrl.classList.remove('is-gone'); btn.disabled = true; btn.classList.remove('is-held', 'is-ready'); setLabel('HOLD TO CHARGE'); hint.textContent = '';
    meterFill.style.transform = 'scaleX(0)'; meterPeak.style.transform = 'scaleX(0)'; meterPct.textContent = '0%'; meter.style.transform = '';
    setFull(false);
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
    path: s.path, beat: s.beat, done: s.done, flightX: s.flightX, flightAlt: s.flightAlt, flightBeat: s.flightBeat, flightU: s.flightU, flightCam: s.flightCam, smoke: s.smoke.length, shot: shot.style.visibility === 'visible' ? shot.getAttribute('src') : null,
  };
})();
