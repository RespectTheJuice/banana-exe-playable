/* BANANA.EXE — Part 2 opening: delivery-method selector → Trebutech truck to HOME → rental charge → Delivery Problem.
   Locked sequence (production/PART2_TRANSITION_ASSET_CHECKPOINT.md):
     three-option selector → rapid cycling / ticks → deterministic slowdown → TREBUCHET → Trebutech truck travels to
     HOME → arrival → £15 rental charge → budget update → Delivery Problem.
   Only TREBUCHET is a named option. The other two slots are deliberately unlabelled until their names are decided;
   add them to DELIVERY_OPTIONS when they are. The selector always lands on RESULT for Attempt 01.
   Locked art (Trebutech truck, HOME, launcher reference) is only placed, moved and lit — never edited. The truck
   render has a black field, so the map beat is a black field and the truck composites with `lighten` (identical
   pixels over black). One rAF loop on a game clock that stops while paused, like Attempt 01. */
(() => {
  const { $, show, tone, noise, audio } = window.BX;

  // ---------- Configuration ----------
  // label: null = an option that exists in the selector but is not named yet (rendered as an unknown slot).
  const DELIVERY_OPTIONS = [
    { key: 'trebuchet', label: 'TREBUCHET', icon: 'assets/launcher.png' },
    { key: null, label: null },
    { key: null, label: null },
  ];
  const RESULT = 'trebuchet';
  const RENTAL = { label: 'TREBUCHET RENTAL', cost: 15 };
  const T = {
    fadeIn: 300, cycleAt: 700, steps: 17, firstGap: 70, lastGap: 470, // cycling: fast → slow, deterministic end
    lockHold: 1400, travel: 2700, arriveHold: 700, chargeIn: 380, budgetAt: 450, afterCharge: 2300,
  };
  const ROAD = { from: [-320, 520], to: [790, 700] }; // map space 1600 × 900; truck centre path, ending beside HOME
  const TRUCK = 420;                                    // drawn size of the 1254² truck render, in map units
  const FRONT = 200;                                    // centre → front bumper along the road, in map units

  // ---------- DOM ----------
  const scene = $('#p2-delivery'), status = $('#dl-status'), select = $('#dl-select'), options = $('#dl-options');
  const map = $('#dl-map'), route = $('#dl-route'), truck = $('#dl-truck'), home = $('#dl-home'), homeGlow = $('#dl-home-glow');
  const receipt = $('#dl-receipt'), remaining = $('#dl-remaining'), live = $('#dl-live');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeInOut = (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
  const money = (n) => `${n < 0 ? '−' : ''}£${Math.abs(n).toFixed(2)}`;
  const announce = (text) => { live.textContent = ''; live.textContent = text; };

  // Cards are built from the configuration, so naming an option later is a one-line change.
  const cards = DELIVERY_OPTIONS.map((o, i) => {
    const el = document.createElement('div');
    el.className = 'dl-card' + (o.label ? '' : ' is-unknown');
    el.dataset.index = i; if (o.key) el.dataset.key = o.key;
    el.innerHTML = o.label
      ? `<span class="dl-icon"><img src="${o.icon}" alt="" /></span><b>${o.label}</b>`
      : '<span class="dl-icon dl-icon-unknown" aria-hidden="true">?</span><b class="dl-unknown-label" aria-label="Option not yet revealed">? ? ?</b>';
    options.appendChild(el);
    return el;
  });
  const resultIndex = DELIVERY_OPTIONS.findIndex((o) => o.key === RESULT);

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

  // ---------- Audio (shared SFX bus via BX.tone / BX.noise / BX.sfxOut, so SOUND OFF and pause apply) ----------
  const fx = {
    tick: (i) => tone(1500 + (i % 2) * 180, 0, 0.03, { type: 'square', vol: 0.05 }),
    lock: () => { tone(660, 0, 0.12, { type: 'triangle', vol: 0.1 }); tone(990, 0.09, 0.28, { type: 'triangle', vol: 0.1 }); },
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
      }
      if (t >= lockAt && once('lock')) {
        s.method = DELIVERY_OPTIONS[resultIndex].label; s.lockT = t;
        cards[resultIndex].classList.add('is-locked'); cards.forEach((c, i) => c.classList.toggle('is-out', i !== resultIndex));
        status.textContent = s.method; fx.lock(); announce(`Delivery method: ${s.method}`);
      }
      if (s.lockT !== undefined) { // settle/bounce + one restrained glow pulse
        const u = (t - s.lockT) / 600, c = cards[resultIndex];
        const bounce = rm ? 1 : 1 + 0.1 * Math.exp(-u * 5) * Math.cos(u * 14);
        c.style.transform = `scale(${bounce.toFixed(4)})`;
        c.style.setProperty('--pulse', (u < 1 ? Math.sin(Math.PI * clamp(u)) : 0).toFixed(3));
        if (t - s.lockT >= T.lockHold) startMap();
      }
    } else if (s.phase === 'drive') {
      // Trebutech truck drives to HOME, decelerating to a stop beside it.
      const u = clamp(pt / T.travel), e = easeInOut(u);
      const x = ROAD.from[0] + (ROAD.to[0] - ROAD.from[0]) * e, y = ROAD.from[1] + (ROAD.to[1] - ROAD.from[1]) * e;
      const bob = rm || u >= 1 ? 0 : 3 * Math.sin(pt / 1000 * Math.PI * 2 * 7) * Math.min(1, 4 * u * (1 - u));
      placeTruck(x, y + bob);
      route.style.strokeDashoffset = (-Math.min(routeLen, routeLen * e + FRONT)).toFixed(1); // only the road ahead of the truck's nose
      const speed = u < 0.5 ? 2 * u : 2 * (1 - u); // the slope of the ease: pulls away, cruises, slows to a stop
      engineSet(speed);
      if (u >= 1 && once('arrive')) { engineStop(); fx.brake(); s.arriveT = t; announce('The Trebutech truck arrives at HOME'); }
      if (s.arriveT !== undefined) {
        const v = (t - s.arriveT) / 600; // HOME: small settle/bounce + one glow pulse
        home.style.transform = rm ? '' : `translateY(${(-10 * Math.exp(-v * 5) * Math.abs(Math.sin(v * 9))).toFixed(2)}px)`;
        homeGlow.style.opacity = (v < 1 ? 0.9 * Math.sin(Math.PI * clamp(v)) : 0).toFixed(3);
        if (t - s.arriveT >= T.arriveHold) enter('charge');
      }
    } else if (s.phase === 'charge') {
      // TREBUCHET RENTAL − £15.00, ching-ching, then the visible budget updates. Hold, then the Delivery Problem.
      const u = clamp(pt / T.chargeIn);
      receipt.style.visibility = 'visible'; receipt.style.opacity = u.toFixed(3);
      receipt.style.transform = rm ? 'translateX(-50%)' : `translate(-50%, ${((1 - u) * -24).toFixed(1)}px)`;
      if (once('ching')) { fx.kaching(); announce(`${RENTAL.label}: minus ${RENTAL.cost} pounds`); }
      if (pt >= T.budgetAt && once('budget')) {
        const before = window.BX.getBudget();
        window.BX.spendBudget(RENTAL.cost); s.charged = true;
        remaining.textContent = `BUDGET ${money(before)} → ${money(window.BX.getBudget())}`;
        receipt.classList.add('is-charged'); $('#budget')?.classList.add('is-spending');
        setTimeout(() => $('#budget')?.classList.remove('is-spending'), 900);
        announce(`Budget left: ${money(window.BX.getBudget())}`);
      }
      if (pt >= T.budgetAt + T.afterCharge && !s.done) {
        s.done = true; engineStop(); cancelAnimationFrame(raf); raf = 0;
        const cb = onDone; onDone = null; cb && cb({ method: s.method, rental: RENTAL.cost });
      }
    }
  }

  let routeLen = 0;
  function placeTruck(x, y) {
    const sc = map.clientWidth / 1600, w = TRUCK * sc;
    truck.style.width = `${w.toFixed(1)}px`;
    truck.style.transform = `translate(${(x * sc - w / 2).toFixed(1)}px, ${(y * sc - w / 2).toFixed(1)}px)`;
  }
  function startMap() {
    enter('drive');
    select.style.visibility = 'hidden';
    map.style.visibility = 'visible';
    routeLen = route.getTotalLength(); route.style.strokeDasharray = `${routeLen} ${routeLen}`; route.style.strokeDashoffset = '0';
    placeTruck(ROAD.from[0], ROAD.from[1]); truck.style.visibility = 'visible';
    engineStart(); engineSet(0.4);
  }

  // ---------- Mount / teardown ----------
  function resetDom() {
    select.style.visibility = ''; select.style.opacity = '0';
    cards.forEach((c) => { c.className = c.className.replace(/\s*is-(hi|locked|out)/g, ''); c.style.transform = ''; c.style.removeProperty('--pulse'); });
    status.textContent = 'SELECTING…';
    map.style.visibility = 'hidden'; truck.style.visibility = 'hidden'; home.style.transform = ''; homeGlow.style.opacity = '0';
    receipt.style.visibility = 'hidden'; receipt.style.opacity = '0'; receipt.style.transform = ''; receipt.classList.remove('is-charged'); remaining.textContent = '';
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

  window.BX.startDeliveryTransition = start;
  window.BX.resetDeliveryTransition = () => { teardown(); resetDom(); };
  window.BX.getDeliveryMethod = () => (s && s.method) || method;
  window.BX.setDeliveryMethod = (m) => { method = m; }; // for debug jumps that skip the transition
  window.BX.deliveryOptions = () => DELIVERY_OPTIONS.map((o) => ({ ...o }));
  window.BX.deliveryTransitionState = () => s && { phase: s.phase, t: s.t, phaseT: s.phaseT, hi: s.hi, step: s.step, method: s.method, charged: s.charged, done: s.done, lockT: s.lockT, arriveT: s.arriveT };
})();
