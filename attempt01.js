/* BANANA.EXE — Part 2, Attempt 01: Long-Range Launch.
   Charge the locked launcher (press and hold), fire, and watch the selected banana fall short at Leicester.
   Built on the existing systems: window.BX for scenes, pause (BX.isPaused / bx:pause), SFX bus (BX.sfxOut,
   BX.tone / BX.noise), SOUND OFF and the selected banana (BX.getChoice). One animation loop drives every visual and
   audio parameter; it stops advancing while the game is paused, so the scene freezes on its current frame.
   The locked launcher art is only moved, squashed (≤ 0.7 %) and lit from separate derived layers — never edited. */
(() => {
  const { $, show, tone, noise, audio } = window.BX;
  const IMG_W = 1536, IMG_H = 1024;
  const CLAW = { x: 1378, y: 120 }, BASE_Y = 975, RECOIL = { x: -0.83, y: 0.56 };
  const COIL = { x0: 560, y0: 470, x1: 1290, y1: 170 };
  const T = { fadeIn: 300, charge: 2800, drain: 900, armDelay: 250, flicker: 80, holdLabel: 1200,
    recoil: 60, shake: 220, flashIn: 50, flashHold: 130, flashOut: 380, swap: 60, crossfade: 200,
    phaseA: 900, phaseB: 1050, phaseC: 1750, settle: 360, result: 1800, bandTravel: 650 };
  // Map space is 0–1000 (north up). Points per spec.
  const P = { nott: [400, 140], leic: [430, 460], tfy: [620, 860], ctrl: [120, 450] };
  const ROUTE = `M${P.nott} Q${P.ctrl} ${P.tfy}`;

  const scene = $('#p2-attempt01'), stage = $('#a1-stage'), rig = $('#a1-rig');
  const cyan = $('#a1-cyan'), coil = $('#a1-coil'), glowA = $('#a1-glow-a'), glowB = $('#a1-glow-b');
  const bands = [...document.querySelectorAll('.a1-band')];
  const btn = $('#a1-btn'), hint = $('#a1-hint'), meterFill = $('#a1-meter-fill'), meterPct = $('#a1-meter-pct'), meter = $('#a1-meter');
  const live = $('#a1-live'), result = $('#a1-result'), flashRadial = $('#a1-flash-radial'), flashWhite = $('#a1-flash-white');
  const map = $('#a1-map'), mapSvg = $('#a1-map-svg'), routeDone = $('#a1-route-done'), routeLeft = $('#a1-route-left');
  const trail = $('#a1-trail'), proj = $('#a1-proj'), leicRing = $('#a1-leic-ring'), leicLabel = $('#a1-leic-label'), tfyPulse = $('#a1-tfy-pulse');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- State ----------
  let s = null, raf = 0, lastTs = null, onComplete = null;
  function fresh() {
    return { state: 'intro', t: 0, c: 0, held: false, lockT: -1, releaseT: -1, fireT: -1, flightT: -1, landT: -1,
      phase: 0, pulseF: 0.5, vib: { x: 0, y: 0, tx: 0, ty: 0, next: 0 }, shake: { x: 0, y: 0 }, swapped: false,
      bands: bands.map(() => ({ t0: -1 })), nextBand: 0, tick: 0, announced: 0, done: false, trail: [], resultShown: false };
  }

  // ---------- Audio (all through the shared SFX bus; pause = existing AudioContext suspend) ----------
  let hum = null;
  function humStart() {
    if (hum) return;
    const a = audio(), bus = window.BX.sfxOut(); if (!a || !bus) return;
    const t = a.currentTime, out = a.createGain();
    out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(1, t + 0.12);
    const o1 = a.createOscillator(), g1 = a.createGain(); o1.type = 'sawtooth'; o1.frequency.value = 55; g1.gain.value = 0.035;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    const o2 = a.createOscillator(), g2 = a.createGain(); o2.type = 'sine'; o2.frequency.value = 400; g2.gain.value = 0.006;
    o1.connect(lp).connect(g1).connect(out); o2.connect(g2).connect(out); out.connect(bus);
    o1.start(t); o2.start(t);
    hum = { a, out, o1, o2, g1, g2 };
  }
  function humSet(c) {
    if (!hum) return;
    const t = hum.a.currentTime;
    hum.o1.frequency.setTargetAtTime(55 + 55 * c, t, 0.03);
    hum.o2.frequency.setTargetAtTime(400 + 1200 * c, t, 0.03);
    hum.g1.gain.setTargetAtTime(0.03 + 0.03 * c, t, 0.05);
    hum.g2.gain.setTargetAtTime(0.004 + 0.016 * c, t, 0.05);
  }
  function humStop(fade = 0.12) {
    if (!hum) return;
    const { a, out, o1, o2 } = hum, t = a.currentTime; hum = null;
    out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
    out.gain.exponentialRampToValueAtTime(0.0001, t + fade);
    [o1, o2].forEach((o) => o.stop(t + fade + 0.05));
  }
  const fx = {
    tick: () => tone(2400, 0, 0.012, { type: 'square', vol: 0.018 }),
    powerDown: () => tone(520, 0, 0.3, { type: 'sawtooth', slideTo: 80, vol: 0.06 }),
    clack: () => { noise(0, 0.05, 0.45); tone(180, 0, 0.09, { type: 'square', slideTo: 90, vol: 0.12 }); tone(1400, 0.012, 0.03, { vol: 0.05 }); },
    fire: () => { noise(0, 0.06, 0.55); tone(60, 0, 0.3, { type: 'sine', slideTo: 38, vol: 0.3 }); noise(0.02, 0.35, 0.32); },
    whistle: () => tone(1500, 0, 0.7, { type: 'sine', slideTo: 420, vol: 0.035 }),
    thud: () => { tone(95, 0, 0.22, { type: 'sine', slideTo: 50, vol: 0.22 }); noise(0, 0.08, 0.14); },
  };

  // ---------- Map geometry ----------
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ROUTE); mapSvg.appendChild(path); path.style.visibility = 'hidden';
  const L = path.getTotalLength(), STALL = 0.32;
  // Split the intended curve at 32 % of its length: flown part vs. the part the banana never reaches.
  (() => {
    const [x0, y0] = P.nott, [cx, cy] = P.ctrl, [x1, y1] = P.tfy;
    let tt = 0, best = 1e9;
    for (let i = 0; i <= 2000; i++) {
      const u = i / 2000, x = (1 - u) ** 2 * x0 + 2 * u * (1 - u) * cx + u * u * x1, y = (1 - u) ** 2 * y0 + 2 * u * (1 - u) * cy + u * u * y1;
      const p = path.getPointAtLength(L * STALL), d = (x - p.x) ** 2 + (y - p.y) ** 2;
      if (d < best) { best = d; tt = u; }
    }
    const lerp = (a, b) => [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt];
    const q0 = lerp(P.nott, P.ctrl), q1 = lerp(P.ctrl, P.tfy), m = lerp(q0, q1);
    routeDone.setAttribute('d', `M${P.nott} Q${q0} ${m}`);
    routeLeft.setAttribute('d', `M${m} Q${q1} ${P.tfy}`);
  })();
  const stallPt = path.getPointAtLength(L * STALL);
  const tangent = (len) => { const a = path.getPointAtLength(Math.max(0, len - 2)), b = path.getPointAtLength(Math.min(L, len + 2)); return Math.atan2(b.y - a.y, b.x - a.x); };

  // ---------- Helpers ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (u) => 1 - (1 - u) ** 3;
  function announce(text) { live.textContent = ''; live.textContent = text; }
  function setLabel(text) { if (btn.dataset.label !== text) { btn.dataset.label = text; btn.querySelector('.a1-btn-cap').textContent = text; } }
  function setHint(text) { hint.textContent = text; hint.hidden = !text; }

  // ---------- Input: one real button; press-and-hold to charge, fresh press to fire ----------
  function press() {
    if (!s || s.done || window.BX.isPaused() || !scene.classList.contains('is-active')) return;
    if (s.state === 'locked') {
      if (!s.held && s.t - s.lockT >= T.armDelay) fire();
      return;
    }
    if (!['intro', 'idle', 'charging', 'draining'].includes(s.state)) return;
    s.held = true;
    if (s.state !== 'charging') { s.state = 'charging'; humStart(); }
  }
  function release(quiet = false) {
    if (!s || !s.held) return;
    s.held = false;
    if (s.state === 'charging' && s.c < 1) {
      s.state = 'draining'; s.releaseT = s.t;
      if (!quiet) { fx.powerDown(); announce('Charge lost'); }
      setLabel('HOLD TO CHARGE');
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
    if (e.repeat) return;
    press();
  });
  btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); release(); } });
  btn.addEventListener('blur', () => release());
  btn.addEventListener('click', (e) => e.preventDefault());
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  // Pause (button, hidden tab or lost focus) clears any active hold; the charge drains after RESUME unless re-held.
  addEventListener('bx:pause', (e) => {
    if (!e.detail.paused || !s) return;
    release(true);
    if (s.state === 'draining') { fx.powerDown(); announce('Charge lost'); }
  });

  // ---------- Fire ----------
  function fire() {
    s.state = 'firing'; s.fireT = s.t; s.held = false;
    btn.disabled = true; setHint('');
    humStop(0.08); fx.fire();
    const r = rig.getBoundingClientRect(), k = r.width / IMG_W;
    flashRadial.style.setProperty('--fx', `${r.left + CLAW.x * k}px`);
    flashRadial.style.setProperty('--fy', `${r.top + CLAW.y * k}px`);
  }

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
    const rm = reduced(), t = s.t;
    // Charge
    if (s.state === 'intro' && t >= T.fadeIn) s.state = 'idle';
    if (s.state === 'charging') {
      s.c = Math.min(1, s.c + dt / T.charge);
      s.tick += dt;
      const every = 1000 / (4 + 16 * s.c);
      if (s.tick >= every) { s.tick = 0; fx.tick(); }
      [25, 50, 75].forEach((q) => { if (s.c * 100 >= q && s.announced < q) { s.announced = q; announce(`${q}%`); } });
      if (s.c >= 1) lock();
    } else if (s.state === 'draining') {
      s.c = Math.max(0, s.c - dt / T.drain);
      s.announced = Math.min(s.announced, Math.floor(s.c * 4) * 25);
      if (s.c === 0) { s.state = 'idle'; humStop(); setLabel('CHARGE LAUNCHER'); }
    }
    if (s.state === 'draining' && t - s.releaseT > T.holdLabel && btn.dataset.label === 'HOLD TO CHARGE') setLabel('CHARGE LAUNCHER');
    humSet(s.c);

    const firing = s.fireT >= 0, ft = t - s.fireT;
    if (!firing) drawLauncher(dt, rm);
    else drawFire(dt, ft, rm);

    // Meter
    meterFill.style.transform = `scaleX(${s.c.toFixed(4)})`;
    meterPct.textContent = `${Math.round(s.c * 100)}%`;
    meter.classList.toggle('is-flash', s.lockT >= 0 && t - s.lockT < 120);

    if (s.flightT >= 0) drawFlight(t - s.flightT, rm);
  }

  function lock() {
    s.c = 1; s.state = 'locked'; s.lockT = s.t;
    fx.clack(); setLabel('FIRE BANANA'); setHint('');
    announce('Charged. Fire banana.');
  }

  function drawLauncher(dt, rm) {
    const t = s.t, c = s.c, k = rig.clientWidth / IMG_W;
    // Cyan pulse: phase-accumulated so the frequency can glide without jumps.
    const idle = s.state === 'intro' || s.state === 'idle';
    s.pulseF = idle ? 0.5 : s.state === 'locked' ? 6 : 1.2 + 4.8 * c;
    s.phase += 2 * Math.PI * s.pulseF * dt / 1000;
    const wave = rm ? 0 : Math.sin(s.phase);
    let op = idle ? 0.15 + 0.05 * wave : s.state === 'locked' ? 0.9 + 0.1 * wave : 0.25 + 0.65 * c + 0.1 * wave;
    if (s.releaseT >= 0 && t - s.releaseT < T.flicker) op = 0.3;
    cyan.style.opacity = clamp(op).toFixed(3);
    // Glow (cyan, behind the art): 0→18 px, 0→0.55 opacity, cross-fading a 6 px and an 18 px layer.
    const blur = 18 * c, o = 0.55 * c, wB = clamp((blur - 6) / 12);
    glowA.style.opacity = (o * (1 - wB)).toFixed(3); glowB.style.opacity = (o * wB).toFixed(3);
    // Coil light bands, breech → claw.
    const active = !idle && !rm;
    if (active && t >= s.nextBand) {
      const free = s.bands.findIndex((b) => b.t0 < 0 || t - b.t0 > T.bandTravel);
      if (free >= 0) s.bands[free].t0 = t;
      s.nextBand = t + (900 - 600 * c);
    }
    coil.style.opacity = (active ? 0.35 + 0.65 * c : 0).toFixed(3);
    const len = Math.hypot(COIL.x1 - COIL.x0, COIL.y1 - COIL.y0), bw = 0.14 * len;
    s.bands.forEach((b, i) => {
      const u = b.t0 < 0 ? -1 : (t - b.t0) / T.bandTravel;
      if (u < 0 || u > 1) { bands[i].style.opacity = '0'; return; }
      const d = -bw / 2 + u * (len + bw), x = COIL.x0 + (COIL.x1 - COIL.x0) * d / len, y = COIL.y0 + (COIL.y1 - COIL.y0) * d / len;
      bands[i].style.opacity = '1';
      bands[i].style.transform = `translate(${(x * k).toFixed(1)}px, ${(y * k).toFixed(1)}px) rotate(${Math.atan2(COIL.y1 - COIL.y0, COIL.x1 - COIL.x0)}rad) translate(-50%, -50%)`;
    });
    // Vibration (whole machine; new random direction about every 30 ms, smoothed), squash from the base line.
    const A = rm ? 0 : s.state === 'locked' ? 2 : (idle ? 0 : (1.5 + 1.5 * c) * clamp(c / 0.08));
    if (t >= s.vib.next) { const a = Math.random() * Math.PI * 2; s.vib.tx = Math.cos(a) * A; s.vib.ty = Math.sin(a) * A; s.vib.next = t + 30; }
    const f = 1 - Math.exp(-dt / 15);
    s.vib.x += (s.vib.tx - s.vib.x) * f; s.vib.y += (s.vib.ty - s.vib.y) * f;
    const sy = s.state === 'locked' ? 0.993 : 1 - 0.007 * c;
    rig.style.opacity = clamp(t / T.fadeIn).toFixed(3);
    rig.style.transform = `translate(${(s.vib.x * k).toFixed(2)}px, ${(s.vib.y * k).toFixed(2)}px) scaleY(${sy.toFixed(4)})`;
  }

  function drawFire(dt, ft, rm) {
    const k = rig.clientWidth / IMG_W;
    if (rm) {
      // Reduced motion: 200 ms crossfade, no recoil, shake or flash.
      const u = clamp(ft / T.crossfade);
      rig.style.opacity = (1 - u).toFixed(3); map.style.opacity = u.toFixed(3); map.style.visibility = 'visible';
      if (!s.swapped) { s.swapped = true; spawnProjectile(); }
      if (u >= 1 && s.flightT < 0) { rig.style.visibility = 'hidden'; s.flightT = s.t; }
      return;
    }
    // Recoil: 14 image px down-left along the barrel in 60 ms (ease-out); squash and glow hold.
    const r = 14 * easeOut(clamp(ft / T.recoil));
    rig.style.transform = `translate(${(RECOIL.x * r * k).toFixed(2)}px, ${(RECOIL.y * r * k).toFixed(2)}px) scaleY(0.993)`;
    // Stage shake: 220 ms, up to 10 px, dying away (layers 0–4 only).
    const sk = ft < T.shake ? 10 * (1 - ft / T.shake) ** 2 : 0;
    const a = Math.random() * Math.PI * 2;
    stage.style.transform = sk ? `translate(${(Math.cos(a) * sk).toFixed(2)}px, ${(Math.sin(a) * sk).toFixed(2)}px)` : '';
    // Flash: 0–50 ms bloom from the claw, 50–130 ms full white, 130–380 ms fade.
    const up = clamp(ft / T.flashIn), down = 1 - clamp((ft - T.flashHold) / (T.flashOut - T.flashHold));
    flashRadial.style.opacity = (ft < T.flashHold ? up : down).toFixed(3);
    flashWhite.style.opacity = (ft < T.flashIn ? up * up : ft < T.flashHold ? 1 : down).toFixed(3);
    // Hidden swap under full white: launcher out (for good), map in, projectile = the player's banana.
    if (ft >= T.swap && !s.swapped) {
      s.swapped = true;
      rig.style.visibility = 'hidden';
      map.style.opacity = '1'; map.style.visibility = 'visible';
      spawnProjectile();
    }
    if (ft >= T.flashHold && s.flightT < 0) s.flightT = s.t;
  }

  function spawnProjectile() {
    const choice = window.BX.getChoice();
    proj.src = choice ? choice.img : 'assets/banana_ripe_v1.png';
    proj.dataset.pick = choice ? choice.key : 'ripe';
    placeProjectile(P.nott[0], P.nott[1], tangent(0), 1, 0);
    proj.style.visibility = 'visible';
  }

  function placeProjectile(x, y, ang, sy, dy) {
    const W = map.clientWidth, sc = W / 1000;
    proj.style.transform = `translate(${(x * sc).toFixed(1)}px, ${(y * sc + dy).toFixed(1)}px) translate(-50%, -50%) rotate(${ang.toFixed(3)}rad) scaleY(${sy.toFixed(3)})`;
  }

  function drawFlight(ft, rm) {
    // Target pulse (slow) runs from the same clock.
    const pu = (s.t % 2400) / 2400;
    tfyPulse.setAttribute('r', (16 + 22 * pu).toFixed(1)); tfyPulse.style.opacity = (rm ? 0.5 : 0.8 * (1 - pu)).toFixed(3);
    let x, y, ang;
    if (ft < T.phaseA) {
      // Phase A — confident: along the intended curve to 32 %, easing out.
      const len = L * STALL * easeOut(ft / T.phaseA), p = path.getPointAtLength(len);
      x = p.x; y = p.y; ang = tangent(len);
    } else if (ft < T.phaseB) {
      // Phase B — stall: forward travel dies; small drift and wobble only.
      const u = (ft - T.phaseA) / (T.phaseB - T.phaseA), a0 = tangent(L * STALL);
      x = stallPt.x + Math.cos(a0) * 6 * u; y = stallPt.y + Math.sin(a0) * 6 * u + 3 * u;
      ang = a0 + (rm ? 0 : 0.18 * Math.sin(u * Math.PI * 2));
    } else if (ft < T.phaseC) {
      // Phase C — gravity takes over: steep drop onto Leicester, ~1.5 tumbles.
      const u = (ft - T.phaseB) / (T.phaseC - T.phaseB), a0 = tangent(L * STALL);
      if (!s.whistled) { s.whistled = true; fx.whistle(); }
      const sx = stallPt.x + Math.cos(a0) * 6, sy0 = stallPt.y + Math.sin(a0) * 6 + 3;
      x = sx + (P.leic[0] - sx) * u; y = sy0 + (P.leic[1] - sy0) * u * u;
      ang = rm ? a0 : a0 + Math.PI * 3 * u * u; // reduced motion: keep the heading, no tumble
    } else {
      x = P.leic[0]; y = P.leic[1];
      ang = tangent(L * STALL) + (rm ? 0 : Math.PI * 3);
      if (s.landT < 0) land();
    }
    if (s.landT < 0) {
      placeProjectile(x, y, ang, 1, 0);
      s.trail.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      trail.setAttribute('points', s.trail.join(' '));
    } else drawLanding(rm, ang);
  }

  function land() {
    s.landT = s.t; fx.thud();
  }

  function drawLanding(rm, ang) {
    const lt = s.t - s.landT;
    let sy = 1, dy = 0;
    if (rm) dy = lt < T.settle ? -4 * Math.sin(Math.PI * lt / T.settle) : 0;
    else if (lt < 60) sy = 1 - 0.15 * Math.sin(Math.PI * lt / 60);
    else if (lt < 220) dy = -8 * Math.sin(Math.PI * (lt - 60) / 160);
    else if (lt < 330) dy = -3 * Math.sin(Math.PI * (lt - 220) / 110);
    placeProjectile(P.leic[0], P.leic[1], ang, sy, dy);
    // Leicester emphasis; the unreached route to TFY recedes to 25 %.
    const e = clamp(lt / 300);
    leicRing.style.opacity = e.toFixed(3); leicLabel.classList.toggle('is-hit', e > 0);
    routeLeft.style.opacity = (1 - 0.75 * clamp(lt / 400)).toFixed(3);
    if (lt >= T.settle && !s.resultShown) {
      s.resultShown = true; result.hidden = false; announce('Result: Leicester');
    }
    if (lt >= T.settle + T.result && !s.done) {
      s.done = true;
      const cb = onComplete; onComplete = null;
      cb && cb({ attempt: 1, result: 'LEICESTER' });
    }
  }

  // ---------- Mount / teardown ----------
  function resetDom() {
    rig.style.cssText = ''; rig.style.opacity = '0'; stage.style.transform = '';
    [cyan, coil, glowA, glowB].forEach((el) => { el.style.opacity = '0'; });
    bands.forEach((b) => { b.style.opacity = '0'; });
    flashRadial.style.opacity = '0'; flashWhite.style.opacity = '0';
    map.style.opacity = '0'; map.style.visibility = 'hidden';
    proj.style.visibility = 'hidden'; trail.setAttribute('points', '');
    leicRing.style.opacity = '0'; leicLabel.classList.remove('is-hit'); routeLeft.style.opacity = '1';
    meter.classList.remove('is-flash'); meterFill.style.transform = 'scaleX(0)'; meterPct.textContent = '0%';
    btn.disabled = false; setLabel('CHARGE LAUNCHER'); setHint('Press and hold');
    result.hidden = true; live.textContent = '';
  }
  function teardown() {
    cancelAnimationFrame(raf); raf = 0; lastTs = null;
    humStop(0.05); s = null; onComplete = null;
  }
  function start(opts = {}) {
    teardown();
    resetDom();
    onComplete = opts.onComplete || null;
    s = fresh();
    show('p2-attempt01', 'PART 2 // ATTEMPT 01');
    raf = requestAnimationFrame(frame);
  }

  window.BX.startAttempt01 = start;
  window.BX.resetAttempt01 = () => { teardown(); resetDom(); };
  // Read-only state for development checks.
  window.BX.attempt01State = () => s && { state: s.state, c: s.c, held: s.held, t: s.t, lockT: s.lockT, swapped: s.swapped, landed: s.landT >= 0, done: s.done };
})();
