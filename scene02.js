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
    drive: () => noise(0, 0.03, 0.06),
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
  let choice = null;
  const inv = $('#inv');
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
    let t0 = null, lastTick = 0, prev = trail.getPointAtLength(0);
    marker.classList.add('is-driving');
    const frameFn = (ts) => {
      if (!driving) return;
      if (t0 === null) t0 = ts;
      const raw = Math.min(1, (ts - t0) / DURATION);
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2; // easeInOutQuad
      const p = trail.getPointAtLength(L * t);
      faceCar(p.x - prev.x); prev = p;
      placeMarker(p);
      setTrail(t);
      if (ts - lastTick > 180 && raw < 0.97) { s2sfx.drive(); lastTick = ts; }
      if (raw < 1) requestAnimationFrame(frameFn);
      else arrived();
    };
    requestAnimationFrame(frameFn);
  }

  function arrived() {
    driving = false;
    marker.classList.remove('is-driving');
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
  const ripeCard = cards.find((c) => c.dataset.pick === 'ripe');
  const PICK_CLICK = 'Click a banana to choose it', PICK_TAP = 'Tap a banana to choose it';
  let choosing = false;

  function resetBoutique() {
    choosing = false;
    boutique.classList.remove('is-showing', 'is-choosing', 'is-chosen', 'is-paid');
    cards.forEach((c) => { c.disabled = true; c.classList.remove('is-picked', 'is-noticed'); });
    say.classList.remove('is-on'); reaction.classList.remove('is-on'); paid.classList.remove('is-on'); paid.textContent = '';
    wipe.getAnimations().forEach((a) => a.cancel());
  }

  function startBoutique() {
    show('s2-boutique', 'PART 1 // BANANA BOUTIQUE');
    clearGuide(); flash();
    resetBoutique();
    sayText.textContent = 'Here are our premium bananas. Which one would you like?';
    later(() => { sayText.textContent = 'Good choice.'; say.classList.add('is-on'); s2sfx.selected(); }, 350);
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
      sfx.pop();
    }, 2750);
    later(() => {
      reaction.classList.remove('is-on');
      ripeCard.classList.remove('is-noticed');
      boutique.classList.add('is-choosing');
      cards.forEach((c) => { c.disabled = false; });
      choosing = true;
      guide(cards, PICK_CLICK, PICK_TAP);
    }, 4700);
  }

  cards.forEach((card) => card.addEventListener('click', () => pick(card)));

  function pick(card) {
    if (!choosing) return;
    choosing = false;
    setChoice(card.dataset.pick);
    clearGuide();
    cards.forEach((c) => { c.disabled = true; });
    card.classList.add('is-picked');
    boutique.classList.add('is-chosen');
    s2sfx.pick();
    later(() => { say.classList.add('is-on'); s2sfx.selected(); }, 350);
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
        paid.innerHTML = `<small>PURCHASED</small>1 × ${choice.name} BANANA · ${choice.price}`;
        paid.classList.add('is-on');
        s2sfx.kaching();
      }, 480);
      anim.onfinish = () => later(() => startRoute('back'), 1500);
    }, 1700);
  }

  // ---------- BACK HOME → postal check → "Probably a bad idea anyway. It'll get bruised." ----------
  const home = $('#s2-home'), homeThought = $('#home-thought'), homeText = $('#home-thought-text');
  const LINES = {
    home: 'How the hell am I getting this banana to TFY?',
    post: 'Can I just post it?',
    bruise: 'Probably a bad idea anyway. It’ll get bruised.',
  };

  function typeThought(line, speed, done) {
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
    home.classList.remove('is-posting', 'is-checked');
    document.querySelectorAll('.post-list li').forEach((li) => li.classList.remove('is-fail'));
    homeThought.classList.remove('is-on'); homeText.textContent = '';
    later(() => { homeThought.classList.add('is-on'); sfx.pop(); }, 450);
    later(() => typeThought(LINES.home, 40, () => later(startPost, 1400)), 700);
  }

  function startPost() {
    typeThought(LINES.post, 45, () => {
      later(() => { home.classList.add('is-posting'); sfx.open(); }, 400);
      document.querySelectorAll('.post-list li').forEach((li, i) =>
        later(() => { li.classList.add('is-fail'); s2sfx.fail(); }, 1000 + i * 380));
      later(() => { home.classList.add('is-checked'); sfx.nah(); }, 1000 + 4 * 380 + 200);
      later(() => typeThought(LINES.bruise, 38, () => later(startTeaser, 1900)), 1000 + 4 * 380 + 1500);
    });
  }

  // ---------- PART 1 ENDING: automatic teaser → TO BE CONTINUED ----------
  const teaserScene = $('#s2-teaser');
  function startTeaser() {
    show('s2-teaser', 'PART 1 // NEXT PROBLEM');
    clearGuide(); flash();
    teaserScene.classList.remove('is-end');
    later(sfx.route, 300);
    later(endPart, 3600);
  }
  function endPart() {
    teaserScene.classList.add('is-end');
    $('#end-summary').textContent = choice ? `BANANA #1: 1 × ${choice.name} · ${choice.price}` : '';
    sfx.notice();
  }

  // ---------- Replay / reset ----------
  function resetPart() {
    clearTimers(); clearGuide();
    driving = false; marker.classList.remove('is-driving');
    setChoice(null);
    resetBoutique();
    home.classList.remove('is-posting', 'is-checked');
    homeThought.classList.remove('is-on'); homeText.textContent = '';
    teaserScene.classList.remove('is-end');
  }

  // YOU GOT IT (game.js) hands straight over to the outbound route.
  window.BX.startScene02 = () => { audio(); resetPart(); startRoute('out'); };
  $('#replay-part').addEventListener('click', () => { sfx.click(); resetPart(); window.BX.resetScene01(); window.BX.startDesk(); });
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
})();
