/* BANANA.EXE — Part 1, second half:
   HOME → BANANA BOUTIQUE on MAP 02A (vehicle marker) → Boutique exterior → choose a banana (required action 3) → "Good choice." → transaction wipe
   → banana in inventory → BANANA BOUTIQUE → HOME → "How the hell am I getting this banana to TFY?" → postal check
   → "Probably a bad idea anyway. It'll get bruised." → teaser → TO BE CONTINUED.
   Everything after the choice runs by itself. The chosen ripeness and price live in `choice` and drive the inventory
   chip, the return route label, the postal check and the end summary. Approved art is only positioned, scaled,
   cropped or dimmed — never edited. Builds on window.BX from game.js. */
(() => {
  const { $, show, flash, later, clearTimers, tone, noise, sfx, guide, clearGuide, audio } = window.BX;
  const stage = $('#stage');
  const PROPS = 'assets/';

  const s2sfx = {
    arrive: () => [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.14, { type: 'triangle', vol: 0.1 })),
    pick: () => { tone(880, 0, 0.08, { type: 'triangle', vol: 0.1 }); tone(1175, 0.07, 0.08, { type: 'triangle', vol: 0.1 }); },
    selected: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.08, 0.16, { type: 'square', vol: 0.08 })),
    kaching: () => { noise(0, 0.06, 0.3); [1319, 1568, 2093].forEach((f, i) => tone(f, 0.05 + i * 0.07, 0.3, { type: 'triangle', vol: 0.1 })); },
    fail: () => tone(196, 0, 0.16, { type: 'square', slideTo: 150, vol: 0.06 }),
  };

  // Canonical banana data (PART1_SHIP_BRIEF.md "Current values"). Images are the approved Beat 7 bananas.
  const BANANAS = {
    green: { name: 'GREEN', price: '£4.50', line: 'Bold choice', img: PROPS + 'banana_green_v1.png' },
    ripe: { name: 'RIPE', price: '£5.00', line: 'The safe bet', img: PROPS + 'banana_ripe_v1.png' },
    extra: { name: 'EXTRA RIPE', price: '£3.00', line: 'Living dangerously', img: PROPS + 'banana_extra_ripe_v1.png' },
  };
  const STARTING_BUDGET = 50;
  let budget = STARTING_BUDGET;
  let choice = null;
  const inv = $('#inv'), budgetEl = $('#budget'), budgetValue = $('#budget-value');

  function renderBudget() {
    budgetValue.textContent = `${budget < 0 ? '−' : ''}£${Math.abs(budget).toFixed(2)}`;
    budgetEl.classList.toggle('is-debt', budget < 0);
  }

  // Future delivery purchases are allowed to exceed the remaining budget.
  // This is intentionally a game mechanic: same-day delivery can push the player into debt.
  function spend(amount) {
    budget -= Number(amount) || 0;
    renderBudget();
  }

  renderBudget();
  function setChoice(key) {
    choice = key ? { key, ...BANANAS[key] } : null;
    if (key) stage.dataset.pick = key; else delete stage.dataset.pick;
    if (!key) { inv.classList.remove('is-on'); return; }
    $('#inv-img').src = choice.img;
    $('#inv-text').innerHTML = `<span class="inv-name">1 × ${choice.name} · </span>${choice.price}`;
    $('#marker-banana').setAttribute('href', choice.img);
    $('#post-banana').src = choice.img;
  }

  // ---------- ROUTE: HOME ⇄ BANANA BOUTIQUE on locked MAP 02A, vehicle marker ----------
  // Coordinates are MAP_02A sheet pixels, traced over the baked cyan route.
  const ROUTE_OUT = 'M210 483 L268 483 L343 432 L1050 432 L1050 335 L1163 386';
  const ROUTE_BACK = 'M1163 386 L1050 335 L1050 432 L343 432 L268 483 L210 483';
  const PANEL = { x: 22, w: 1404 }; // the MAP 02A panel shown by CSS
  const frame = $('#map-frame'), pan = $('#map-pan'), marker = $('#marker'), markerInner = $('#marker-inner'), car = $('#car');
  const trail = $('#route-trail'), halo = $('#route-halo');
  const wpHome = $('#wp-home'), wpStore = $('#wp-store');
  let dir = 'out', driving = false, kScale = 1;

  // ---------- Car sound: continuous synthesized engine + road hum (WebAudio, no files) ----------
  // Ported from the approved scene02-review implementation.
  let engine = null;
  function engineStart() {
    if (engine || window.BX.isMuted()) return;
    const a = audio(); if (!a) return;
    const t = a.currentTime, out = a.createGain();
    out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.07, t + 0.5);
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 0.7;
    const o1 = a.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 46;
    const o2 = a.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 93;
    const g2 = a.createGain(); g2.gain.value = 0.5;
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 7; lg.gain.value = 1.6;
    const buf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const road = a.createBufferSource(); road.buffer = buf; road.loop = true;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 360; bp.Q.value = 0.6;
    const rg = a.createGain(); rg.gain.value = 0.32;
    lfo.connect(lg).connect(o1.frequency);
    o1.connect(lp); o2.connect(g2).connect(lp); lp.connect(out);
    road.connect(bp).connect(rg).connect(out);
    out.connect(window.BX.sfxOut());
    const srcs = [o1, o2, lfo, road];
    srcs.forEach((n) => n.start(t));
    engine = { a, out, o1, o2, srcs };
  }
  function engineSpeed(v) {
    if (!engine) return;
    const t = engine.a.currentTime;
    engine.o1.frequency.setTargetAtTime(44 + v * 24, t, 0.12);
    engine.o2.frequency.setTargetAtTime(89 + v * 46, t, 0.12);
  }
  function engineStop(fade = 0.6) {
    if (!engine) return;
    const { a, out, srcs } = engine, t = a.currentTime;
    engine = null;
    out.gain.cancelScheduledValues(t);
    out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
    out.gain.exponentialRampToValueAtTime(0.0001, t + fade);
    srcs.forEach((n) => n.stop(t + fade + 0.05));
  }
  addEventListener('bx:mute', (e) => {
    if (e.detail.muted) engineStop(0.08);
    else if (driving) engineStart();
  });

  // Marker about the size of the baked HOME / BOUTIQUE rings; never smaller than ~22 CSS px radius.
  function sizeMarker() {
    const scale = pan.clientWidth / PANEL.w || 1;
    kScale = Math.max(0.72, 22 / (46 * scale));
    markerInner.setAttribute('transform', `scale(${kScale.toFixed(3)})`);
  }
  // Portrait: the panel is wider than the frame, so pan it to keep the car in view (crop/pan only; no redraw).
  function panTo(x) {
    const fw = frame.clientWidth, pw = pan.clientWidth;
    if (pw <= fw + 1) { pan.style.transform = ''; return; }
    const px = (x - PANEL.x) / PANEL.w * pw;
    pan.style.transform = `translateX(${Math.min(0, Math.max(fw - pw, fw / 2 - px)).toFixed(1)}px)`;
  }
  let lastX = 210;
  addEventListener('resize', () => { sizeMarker(); panTo(lastX); });

  function placeMarker(p) { lastX = p.x; panTo(p.x); marker.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); }
  function faceCar(dx) { if (Math.abs(dx) > 0.01) car.setAttribute('transform', dx < 0 ? 'scale(-1 1)' : ''); }
  function setTrail(t) {
    const L = trail.getTotalLength();
    [trail, halo].forEach((el) => { el.style.strokeDasharray = `${L}`; el.style.strokeDashoffset = `${L * (1 - t)}`; });
  }

  function startRoute(direction) {
    window.BX.setMusicTheme('main');
    dir = direction; driving = false;
    const back = dir === 'back';
    clearGuide();
    [trail, halo].forEach((el) => el.setAttribute('d', back ? ROUTE_BACK : ROUTE_OUT));
    show('s2-route', back ? 'PART 1 // BANANA BOUTIQUE → HOME' : 'PART 1 // HOME → BANANA BOUTIQUE');
    flash();
    sizeMarker();
    setTrail(0);
    placeMarker(trail.getPointAtLength(0));
    faceCar(back ? -1 : 1);
    $('#marker-banana').classList.toggle('is-on', back && !!choice);
    [wpHome, wpStore].forEach((w) => w.classList.remove('is-target', 'is-reached'));
    (back ? wpHome : wpStore).classList.add('is-target');
    $('#route-label').textContent = back && choice
      ? `BANANA BOUTIQUE → HOME · 1 × ${choice.name} BANANA · ${choice.price}`
      : 'MISSION: ACQUIRE BANANA · HOME → BANANA BOUTIQUE';
    later(drive, 800);
  }

  function drive() {
    if (driving) return;
    driving = true;
    const L = trail.getTotalLength(), DURATION = 3600;
    let lastTs = null, elapsed = 0, prev = trail.getPointAtLength(0);
    marker.classList.add('is-driving');
    engineStart();
    const frameFn = (ts) => {
      if (!driving) return;
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs; lastTs = ts;
      if (window.BX.isPaused()) { requestAnimationFrame(frameFn); return; }
      elapsed += Math.min(dt, 100);
      const raw = Math.min(1, elapsed / DURATION);
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2; // easeInOutQuad
      const p = trail.getPointAtLength(L * t);
      faceCar(p.x - prev.x); prev = p;
      placeMarker(p);
      setTrail(t);
      engineSpeed(raw < 0.5 ? raw * 2 : (1 - raw) * 2);
      if (raw < 1) requestAnimationFrame(frameFn);
      else arrived();
    };
    requestAnimationFrame(frameFn);
  }

  function arrived() {
    driving = false;
    marker.classList.remove('is-driving');
    engineStop(0.6);
    const wp = dir === 'back' ? wpHome : wpStore;
    wp.classList.remove('is-target'); wp.classList.add('is-reached');
    s2sfx.arrive();
    later(dir === 'back' ? startHome : startExterior, 1000);
  }

  // ---------- BEAT 6: BANANA BOUTIQUE exterior arrival (locked building; push-in + glow, then hard cut inside) ----------
  function startExterior() {
    show('s2-exterior', 'PART 1 // BANANA BOUTIQUE');
    clearGuide();
    s2sfx.arrive();
    later(startBoutique, 1700);
  }

  // ---------- BEAT 7: BANANA BOUTIQUE (required action 3) ----------
  const boutique = $('#s2-boutique'), cards = [...document.querySelectorAll('.bq-card')];
  const say = $('#bq-say'), sayText = $('#bq-say-text'), reaction = $('#bq-reaction'), paid = $('#bq-paid'), wipe = $('#wipe');
  const budgetFocus = $('#bq-budget-focus'), budgetMain = $('#bq-budget-main'), budgetProjection = $('#bq-budget-projection');
  const ripeCard = cards.find((c) => c.dataset.pick === 'ripe');
  const PICK_CLICK = 'Click a banana to choose it', PICK_TAP = 'Tap a banana to choose it';
  let choosing = false;

  function money(n) {
    return `${n < 0 ? '−' : ''}£${Math.abs(n).toFixed(2)}`;
  }
  function previewBudget(card = null) {
    budgetMain.textContent = money(budget);
    if (!card) {
      budgetProjection.textContent = 'CHOOSE YOUR BANANA';
      budgetFocus.classList.remove('is-preview', 'is-spent');
      return;
    }
    const item = BANANAS[card.dataset.pick];
    const cost = parseFloat(item.price.replace('£',''));
    budgetProjection.textContent = `${money(budget)} → ${money(budget - cost)}`;
    budgetFocus.classList.add('is-preview');
    budgetFocus.classList.remove('is-spent');
  }

  function resetBoutique() {
    choosing = false;
    boutique.classList.remove('is-showing', 'is-choosing', 'is-chosen', 'is-paid');
    cards.forEach((c) => { c.disabled = true; c.classList.remove('is-picked', 'is-noticed'); });
    say.classList.remove('is-on'); reaction.classList.remove('is-on'); paid.classList.remove('is-on'); paid.textContent = '';
    budgetFocus.classList.remove('is-on', 'is-preview', 'is-spent'); previewBudget();
    wipe.getAnimations().forEach((a) => a.cancel());
  }

  function startBoutique() {
    window.BX.setMusicTheme('boutique');
    show('s2-boutique', 'PART 1 // BANANA BOUTIQUE');
    clearGuide(); flash();
    resetBoutique();
    sayText.textContent = 'Here are our premium bananas. Which one would you like?';
    later(() => { window.BX.duckMusic(2050); say.classList.add('is-on'); s2sfx.selected(); }, 350);
    later(() => {
      say.classList.remove('is-on');
      boutique.classList.add('is-showing');
    }, 2200);
    later(() => {
      ripeCard.classList.add('is-noticed');
      const r = ripeCard.getBoundingClientRect();
      reaction.style.left = `${Math.round(r.left + r.width / 2)}px`;
      reaction.style.top = `${Math.max(64, Math.round(r.top - 66))}px`;
      reaction.classList.add('is-on');
      window.BX.duckMusic(1750);
      sfx.pop();
    }, 2750);
    later(() => {
      reaction.classList.remove('is-on');
      ripeCard.classList.remove('is-noticed');
      boutique.classList.add('is-choosing');
      budgetFocus.classList.add('is-on'); previewBudget();
      cards.forEach((c) => { c.disabled = false; });
      choosing = true;
      guide(cards, PICK_CLICK, PICK_TAP);
    }, 4700);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => pick(card));
    card.addEventListener('pointerenter', () => { if (choosing) previewBudget(card); });
    card.addEventListener('pointerleave', () => { if (choosing) previewBudget(); });
    card.addEventListener('focus', () => { if (choosing) previewBudget(card); });
    card.addEventListener('blur', () => { if (choosing) previewBudget(); });
  });

  function pick(card) {
    if (!choosing) return;
    choosing = false;
    setChoice(card.dataset.pick);
    const before = budget;
    const cost = parseFloat(choice.price.replace('£',''));
    spend(cost);
    budgetMain.textContent = `−£${cost.toFixed(2)}`;
    budgetProjection.textContent = `${money(before)} → ${money(budget)}`;
    budgetFocus.classList.add('is-on', 'is-spent');
    budgetEl.classList.add('is-spending');
    later(() => budgetEl.classList.remove('is-spending'), 900);
    clearGuide();
    cards.forEach((c) => { c.disabled = true; });
    card.classList.add('is-picked');
    boutique.classList.add('is-chosen');
    s2sfx.pick();
    later(() => { window.BX.duckMusic(1350); sayText.textContent = 'Good choice.'; say.classList.add('is-on'); s2sfx.selected(); }, 350);
    // Transaction cut: the banana never travels across the scene — it is in the inventory on the far side of the wipe.
    later(() => {
      const anim = wipe.animate([
        { transform: 'translateX(-105%)' }, { transform: 'translateX(0)', offset: 0.45 },
        { transform: 'translateX(0)', offset: 0.6 }, { transform: 'translateX(105%)' },
      ], { duration: 1000, easing: 'cubic-bezier(.6,0,.4,1)' });
      later(() => {
        boutique.classList.remove('is-showing', 'is-choosing', 'is-chosen');
        boutique.classList.add('is-paid');
        say.classList.remove('is-on');
        inv.classList.add('is-on'); inv.classList.remove('is-pop'); void inv.offsetWidth; inv.classList.add('is-pop');
        paid.innerHTML = `
          <small>PURCHASE COMPLETE</small>
          <strong>1 × ${choice.name} BANANA</strong>
          <em>−£${cost.toFixed(2)}</em>
          <span>${money(before)} → ${money(budget)} REMAINING</span>
        `;
        paid.classList.add('is-on');
        s2sfx.kaching();
        later(() => sfx.notice(), 650);
      }, 480);
      // Event-weight hold: action → consequence → time to absorb it → continue.
      anim.onfinish = () => later(() => startRoute('back'), 3200);
    }, 1700);
  }

  // ---------- BACK HOME → postal check → "Probably a bad idea anyway. It'll get bruised." ----------
  const home = $('#s2-home'), homeThought = $('#home-thought'), homeText = $('#home-thought-text');
  const LINES = {
    home: 'How am I getting this banana to TFY?',
    post: 'Can I just post it?',
    bruise: 'Probably a bad idea anyway. It’ll get bruised.',
  };

  function typeThought(line, speed, done) {
    window.BX.duckMusic(Math.max(1200, line.length * speed + 650));
    homeText.textContent = '';
    let i = 0;
    const next = () => {
      homeText.textContent = line.slice(0, ++i);
      if (line[i - 1] !== ' ') sfx.type();
      if (i < line.length) later(next, speed); else if (done) later(done, 0);
    };
    next();
  }

  function startHome() {
    show('s2-home', 'PART 1 // BACK HOME');
    clearGuide(); flash();
    home.classList.remove('is-posting', 'is-checked', 'is-bruising');
    document.querySelectorAll('.post-list li').forEach((li) => li.classList.remove('is-revealed'));
    homeThought.classList.remove('is-on'); homeText.textContent = '';
    later(() => { homeThought.classList.add('is-on'); sfx.pop(); }, 450);
    later(() => typeThought(LINES.home, 40, () => later(startPost, 1400)), 700);
  }

  function startPost() {
    typeThought(LINES.post, 45, () => {
      later(() => { home.classList.add('is-posting'); sfx.open(); }, 400);
      document.querySelectorAll('.post-list li').forEach((li, i) =>
        later(() => { li.classList.add('is-revealed'); sfx.click(); }, 900 + i * 340));
      later(() => { home.classList.add('is-checked'); sfx.nah(); }, 900 + 4 * 340 + 260);
      later(() => {
        home.classList.add('is-bruising');
        typeThought(LINES.bruise, 38, () => later(startTeaser, 1900));
      }, 900 + 4 * 340 + 1450);
    });
  }

  // ---------- PART 1 ENDING: automatic teaser → TO BE CONTINUED ----------
  const teaserScene = $('#s2-teaser');
  function startTeaser() {
    window.BX.teaserSting();
    show('s2-teaser', 'PART 1 // NEXT PROBLEM');
    clearGuide(); flash();
    teaserScene.classList.remove('is-end');
    later(sfx.route, 300);
    later(endPart, 3600);
  }
  function endPart() {
    window.BX.endSting();
    teaserScene.classList.add('is-end');
    $('#end-summary').textContent = choice ? `BANANA #1: 1 × ${choice.name} · ${choice.price} · BUDGET ${money(budget)}` : '';
    sfx.notice();
  }

  // ---------- PART 2 PREVIEW ----------
  // Kept behind ?scene=part2 until the first attempt sequence is locked.
  const p2 = $('#p2-intro'), p2Analyze = $('#p2-analyze'), p2Analysis = $('#p2-analysis'), p2Continue = $('#p2-continue');

  function startPart2Preview() {
    if (!choice) setChoice('ripe');
    show('p2-intro', 'PART 2 // DELIVERY PROBLEM');
    clearGuide(); flash();
    window.BX.setMusicTheme('main');

    $('#p2-payload').textContent = `1 × ${choice.name} BANANA`;
    $('#p2-budget').textContent = money(budget);
    $('#p2-analysis-budget').textContent = money(budget);
    p2.classList.remove('is-analyzed');
    p2Analyze.disabled = false;
    p2Continue.disabled = true;
    guide(p2Analyze, 'Click SIZE UP THE PROBLEM', 'Tap SIZE UP THE PROBLEM');
    later(sfx.route, 250);
    // Fetch and decode the Attempt 01 plates while the player reads the problem.
    later(() => window.BX.preloadAttempt01?.(), 600);
  }

  p2Analyze.addEventListener('click', () => {
    if (p2Analyze.disabled) return;
    p2Analyze.disabled = true;
    clearGuide();
    sfx.arcade();
    window.BX.duckMusic(1100);
    p2.classList.add('is-analyzed');
    later(() => {
      sfx.notice();
      p2Continue.disabled = false;
      guide(p2Continue, 'Click CONTINUE when you are ready', 'Tap CONTINUE when you are ready');
    }, 520);
  });

  p2Continue.addEventListener('click', () => {
    if (p2Continue.disabled) return;
    p2Continue.disabled = true;
    clearGuide();
    sfx.arcade();
    startAttempt01();
  });

  // ---------- PART 2 — ATTEMPT 01 (attempt01.js) ----------
  // Costs £0: the budget is not touched. The selected banana is read through BX.getChoice().
  const part2Results = [];
  function startAttempt01() {
    if (!choice) setChoice('ripe');
    clearGuide();
    window.BX.startAttempt01({
      onComplete: (r) => {
        part2Results.push(r);
        dispatchEvent(new CustomEvent('bx:attempt-complete', { detail: r }));
      },
    });
  }
  window.BX.getPart2Results = () => part2Results.slice();

  // ---------- Replay / reset ----------
  function resetPart() {
    clearTimers(); clearGuide();
    window.BX.resetAttempt01?.();
    driving = false; marker.classList.remove('is-driving'); engineStop(0.1);
    budget = STARTING_BUDGET; renderBudget();
    setChoice(null);
    resetBoutique();
    home.classList.remove('is-posting', 'is-checked', 'is-bruising');
    homeThought.classList.remove('is-on'); homeText.textContent = '';
    teaserScene.classList.remove('is-end');
  }

  // YOU GOT IT (game.js) hands straight over to the outbound route.
  window.BX.spendBudget = spend;
  window.BX.getBudget = () => budget;
  window.BX.getChoice = () => choice;
  window.BX.startScene02 = () => { audio(); resetPart(); startRoute('out'); };
  $('#replay-part').addEventListener('click', () => {
    sfx.click();
    resetPart();
    window.BX.resetScene01();
    window.BX.startMusic('main');
    window.BX.startDesk();
  });
  $('#replay-all').addEventListener('click', () => {
    sfx.click(); resetPart(); window.BX.resetScene01();
    show('s-title', 'PART 1');
    guide($('#start'), 'Click PRESS START to begin');
  });

  // Debug/test hooks: ?scene=route|exterior|boutique|return|home|teaser (&pick=green|ripe|extra)
  const params = new URLSearchParams(location.search), jump = params.get('scene');
  if (BANANAS[params.get('pick')]) { setChoice(params.get('pick')); inv.classList.add('is-on'); }
  if (jump === 'route') startRoute('out');
  if (jump === 'exterior') startExterior();
  if (jump === 'boutique') startBoutique();
  if (jump === 'return') startRoute('back');
  if (jump === 'home') startHome();
  if (jump === 'teaser') startTeaser();
  if (jump === 'attempt01') {
    if (!choice) setChoice('ripe');
    budget = STARTING_BUDGET - parseFloat(choice.price.replace('£',''));
    renderBudget();
    budgetEl.classList.add('is-unlocked');
    inv.classList.add('is-on');
    // attempt01.js loads after this file: start once every script has run.
    if (document.readyState === 'loading') addEventListener('DOMContentLoaded', startAttempt01, { once: true });
    else startAttempt01();
  }
  if (jump === 'part2') {
    if (!choice) setChoice('ripe');
    budget = STARTING_BUDGET - parseFloat(choice.price.replace('£',''));
    renderBudget();
    budgetEl.classList.add('is-unlocked');
    inv.classList.add('is-on');
    startPart2Preview();
  }
})();
