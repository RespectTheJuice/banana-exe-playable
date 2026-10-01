/* BANANA.EXE — Part 1, first half
   Flow: PRESS START → the Inbeeb discovery plays itself on screen (decoys, Head Geek, BANANA in the small print)
         → cut to the approved over-the-shoulder illustration, push in on BANANA
         → Skeptical reaction + thought bubble → YOU GOT IT → HOME → BANANA BOUTIQUE route (scene02.js) starts by itself.
   Required player actions in Part 1: PRESS START, YOU GOT IT, choose a banana. Everything else auto-plays;
   optional clicks only skip ahead. */
(() => {
  const $ = (s) => document.querySelector(s);
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers.length = 0; };

  // ---------- Sound (WebAudio, synthesised — no audio files) ----------
  let ctx = null, muted = false;
  const audio = () => {
    if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  function tone(freq, start, dur, { type = 'square', vol = 0.12, slideTo = null } = {}) {
    const a = audio(); if (!a || muted) return;
    const t = a.currentTime + start;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(start, dur, vol = 0.2) {
    const a = audio(); if (!a || muted) return;
    const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = a.createBufferSource(), g = a.createGain(), f = a.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900;
    src.buffer = buf; g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination); src.start(a.currentTime + start);
  }
  const sfx = {
    click: () => tone(880, 0, 0.05, { vol: 0.06 }),
    nah: () => tone(220, 0, 0.18, { slideTo: 110, vol: 0.08 }),
    open: () => { tone(660, 0, 0.06, { vol: 0.06 }); tone(990, 0.06, 0.08, { vol: 0.06 }); },
    notice: () => { tone(1320, 0, 0.12, { type: 'triangle', vol: 0.12 }); tone(1760, 0.1, 0.25, { type: 'triangle', vol: 0.1 }); },
    scratch: () => { noise(0, 0.22, 0.35); tone(400, 0, 0.25, { type: 'sawtooth', slideTo: 90, vol: 0.1 }); },
    pop: () => tone(520, 0, 0.09, { type: 'triangle', slideTo: 900, vol: 0.12 }),
    type: () => tone(1200 + Math.random() * 300, 0, 0.02, { vol: 0.025 }),
    // Arcade button: mechanical clunk + coin-up arpeggio
    arcade: () => {
      noise(0, 0.07, 0.5); tone(140, 0, 0.1, { type: 'square', slideTo: 60, vol: 0.18 });
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.08 + i * 0.07, 0.12, { vol: 0.1 }));
      tone(1568, 0.45, 0.35, { type: 'triangle', vol: 0.12 });
    },
    route: () => [392, 494, 587].forEach((f, i) => tone(f, i * 0.12, 0.1, { type: 'triangle', vol: 0.08 })),
  };

  $('#mute').addEventListener('click', (e) => {
    muted = !muted;
    e.currentTarget.textContent = muted ? 'SOUND: OFF' : 'SOUND: ON';
    e.currentTarget.setAttribute('aria-pressed', String(muted));
    dispatchEvent(new CustomEvent('bx:mute', { detail: { muted } }));
  });

  // ---------- Scene switching ----------
  function show(id, label) {
    document.querySelectorAll('.scene').forEach((s) => {
      const on = s.id === id;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', String(!on));
    });
    if (label) $('#hud-scene').textContent = label;
  }
  function flash() { const f = $('#flash'); f.classList.remove('is-on'); void f.offsetWidth; f.classList.add('is-on'); }

  // ---------- Player guidance (shared by every scene) ----------
  // One compact instruction per interactive step. If there's no input for ~4 s, the target pulses.
  // The cue is removed as soon as the step is completed; nothing is auto-played for the player.
  const hint = $('#objective');
  const touchUI = matchMedia('(pointer: coarse)').matches;
  let cueTargets = [], cueTimer = null;
  function armCue() {
    clearTimeout(cueTimer);
    cueTargets.forEach((t) => t.classList.remove('cue-pulse'));
    if (cueTargets.length) cueTimer = setTimeout(() => cueTargets.forEach((t) => t.classList.add('cue-pulse')), 4000);
  }
  function guide(targets, click, tap = click.replace(/^Click/, 'Tap')) {
    clearGuide();
    cueTargets = [].concat(targets).filter(Boolean);
    hint.textContent = touchUI ? tap : click;
    hint.classList.add('is-on');
    armCue();
  }
  function clearGuide() {
    clearTimeout(cueTimer);
    cueTargets.forEach((t) => t.classList.remove('cue-pulse'));
    cueTargets = [];
    hint.classList.remove('is-on');
  }
  ['pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, () => { if (cueTargets.length) armCue(); }, true));

  // ---------- 1. Title ----------
  guide($('#start'), 'Click PRESS START to begin');
  $('#start').addEventListener('click', () => {
    clearGuide();
    audio(); sfx.arcade();
    pressVisual($('#start'));
    later(startDesk, 220);
  });

  // ---------- 2. Laptop / Inbeeb: auto-played discovery ----------
  const detail = $('#detail'), caption = $('#caption'), pov = $('#pov');
  const bananaWord = $('#banana-word'), target = $('#job-target'), searchAnchor = document.querySelector('.site-head .search');
  const decoys = [...document.querySelectorAll('.job[data-nah]')];
  let captionTimer = null, found = false, deskStep = 0, deskToken = 0;

  function positionDeskCaption(anchor) {
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    caption.classList.add('is-anchored');
    // Measure after content is in place but before the fade completes.
    const w = Math.min(caption.offsetWidth || 320, innerWidth - 24);
    const h = caption.offsetHeight || 70;
    const mobile = innerWidth <= 700 || matchMedia('(orientation: portrait)').matches;
    let left, top;
    if (mobile) {
      left = Math.min(innerWidth - w - 12, Math.max(12, r.left + r.width / 2 - w / 2));
      top = Math.min(innerHeight - h - 18, r.bottom + 12);
      caption.dataset.tail = 'top';
    } else {
      left = Math.min(innerWidth - w - 18, r.right + 16);
      if (left < r.right + 8) left = Math.max(18, r.left - w - 16);
      top = Math.min(innerHeight - h - 22, Math.max(62, r.top + r.height / 2 - h / 2));
      caption.dataset.tail = left >= r.right ? 'left' : 'right';
    }
    caption.style.left = `${Math.round(left)}px`;
    caption.style.top = `${Math.round(top)}px`;
    caption.style.right = 'auto';
    caption.style.bottom = 'auto';
  }

  function say(text, ms = 1800, el = caption, anchor = null) {
    el.innerHTML = `<span class="cap-face" aria-hidden="true"></span><span class="cap-text"><small>VALENTÉ</small>${text}</span>`;
    if (el === caption) positionDeskCaption(anchor || searchAnchor);
    el.classList.add('is-on');
    clearTimeout(captionTimer);
    captionTimer = setTimeout(() => el.classList.remove('is-on'), ms);
  }
  function hoverJob(btn) {
    document.querySelectorAll('.job').forEach((j) => j.classList.toggle('is-hover', j === btn));
    btn.scrollIntoView({ block: 'nearest' });
  }
  function nah(btn) {
    btn.classList.remove('is-hover');
    if (btn.classList.contains('is-nah')) return;
    sfx.nah(); btn.classList.add('is-nah'); say(btn.dataset.nah, 1100, caption, btn);
  }
  function openTarget() {
    if (target.classList.contains('is-open')) return;
    sfx.open();
    document.querySelectorAll('.job').forEach((j) => j.classList.remove('is-open', 'is-hover'));
    target.classList.add('is-open');
    detail.classList.add('is-open');
    detail.scrollTop = 0;
    say('Head Geek… okay, this is actually interesting.', 1700, caption, target);
  }
  function noticeBanana() {
    if (bananaWord.classList.contains('is-noticed')) return;
    bananaWord.classList.add('is-noticed'); sfx.notice();
    bananaWord.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  // Punch in on the word on screen, then hard cut to the approved illustration.
  function punchIn() {
    if (found) return;
    found = true; deskToken++;
    noticeBanana();
    sfx.scratch();
    caption.classList.remove('is-on');
    const r = bananaWord.getBoundingClientRect(), s = pov.getBoundingClientRect();
    pov.style.transformOrigin = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`;
    pov.classList.add('is-zooming');
    pov.style.transform = 'scale(3)';
    later(startReveal, 650);
  }

  // Each beat: [delay before it, action]. Clicking ahead jumps the timeline forward; nothing waits for input.
  const DESK = [
    [500, () => say('Right. Let’s see what’s out there…', 1500, caption, searchAnchor)],
    [1500, () => hoverJob(decoys[0])],
    [450, () => nah(decoys[0])],
    [1150, () => hoverJob(decoys[1])],
    [450, () => nah(decoys[1])],
    [1150, () => hoverJob(target)],
    [400, openTarget],
    [1900, noticeBanana],
    [1900, punchIn],
  ];
  const OPEN_STEP = DESK.findIndex(([, fn]) => fn === openTarget);
  function playDesk(from = 0) {
    const tok = ++deskToken;
    deskStep = from;
    const next = () => {
      if (tok !== deskToken || deskStep >= DESK.length) return;
      const [wait, fn] = DESK[deskStep];
      later(() => { if (tok !== deskToken) return; deskStep++; fn(); next(); }, wait);
    };
    next();
  }

  function startDesk() {
    show('s-desk', 'PART 1 // THE LISTING');
    clearGuide();
    playDesk(0);
  }

  // Optional clicks: they only speed things up.
  decoys.forEach((btn) => btn.addEventListener('click', () => nah(btn)));
  target.addEventListener('click', () => {
    if (found) return;
    if (deskStep <= OPEN_STEP) { openTarget(); playDesk(OPEN_STEP + 1); }
  });
  $('#back').addEventListener('click', () => { sfx.click(); detail.classList.remove('is-open'); });
  bananaWord.addEventListener('click', punchIn);

  // ---------- 2b. Reveal: approved over-the-shoulder illustration ----------
  const reveal = $('#s-reveal'), revealCaption = $('#reveal-caption');
  let revealed = false;
  function startReveal() {
    revealed = false;
    show('s-reveal', 'PART 1 // THE LISTING');
    reveal.classList.remove('is-pushing');
    later(() => say('Wait…', 1500, revealCaption), 350);
    later(() => { reveal.classList.add('is-pushing'); sfx.notice(); }, 900);
    later(() => say('BANANA?', 1300, revealCaption), 2100);
    later(leaveReveal, 3500);
  }
  function leaveReveal() {
    if (revealed) return;
    revealed = true;
    sfx.scratch();
    later(cutToReaction, 180);
  }
  reveal.addEventListener('click', () => { if (reveal.classList.contains('is-active')) leaveReveal(); });

  // ---------- 3. Skeptical reaction ----------
  const thought = $('#thought'), thoughtText = $('#thought-text'), yougotit = $('#yougotit');
  const LINE = 'You want a banana?';

  function cutToReaction() {
    flash();
    show('s-react', 'PART 1 // THE ASK');
    later(() => { thought.classList.add('is-on'); sfx.pop(); }, 450);
    let i = 0;
    const typeNext = () => {
      thoughtText.textContent = LINE.slice(0, ++i);
      if (LINE[i - 1] !== ' ') sfx.type();
      if (i < LINE.length) later(typeNext, 45);
      else later(showButton, 450);
    };
    later(typeNext, 700);
  }

  function showButton() {
    yougotit.disabled = false;
    yougotit.classList.add('is-ready');
    yougotit.focus({ preventScroll: true });
    guide(yougotit, 'Click YOU GOT IT (or press Enter)', 'Tap YOU GOT IT');
  }

  // ---------- 4. YOU GOT IT → Scene 02 route (one approved map; no Scene 01 map) ----------
  // Held-down state is class-driven so it is visible on touch devices too (iOS ignores :active without a touch listener).
  function pressVisual(btn, hold = 180) {
    btn.classList.add('is-down');
    setTimeout(() => btn.classList.remove('is-down'), hold);
  }
  ['pointerdown'].forEach((ev) => yougotit.addEventListener(ev, () => { if (!yougotit.disabled) yougotit.classList.add('is-down'); }));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => yougotit.addEventListener(ev, () => yougotit.classList.remove('is-down')));

  yougotit.addEventListener('click', () => {
    if (yougotit.disabled) return;
    yougotit.disabled = true;
    clearGuide();
    sfx.arcade();
    pressVisual(yougotit, 260);
    later(() => window.BX.startScene02(), 520);
  });

  // ---------- Replay ----------
  function resetScene01() {
    clearTimers(); clearGuide();
    found = false; revealed = false; deskToken++; deskStep = 0;
    pov.classList.remove('is-zooming'); pov.style.transform = ''; pov.style.transformOrigin = '';
    reveal.classList.remove('is-pushing');
    [caption, revealCaption].forEach((c) => c.classList.remove('is-on'));
    bananaWord.classList.remove('is-noticed');
    detail.classList.remove('is-open');
    document.querySelectorAll('.job').forEach((j) => j.classList.remove('is-nah', 'is-open', 'is-hover'));
    thought.classList.remove('is-on'); thoughtText.textContent = '';
    yougotit.classList.remove('is-ready', 'is-down'); yougotit.disabled = true;
  }

  // Shared with scene02.js
  window.BX = { $, show, flash, later, clearTimers, tone, noise, sfx, guide, clearGuide, pressVisual, audio,
                isMuted: () => muted, touchUI, resetScene01, startDesk };

  // Debug/test hooks: ?scene=desk|reveal|react jumps straight to a beat; ?debug=1 shows TEMP/PROVISIONAL art tags.
  const params = new URLSearchParams(location.search);
  if (params.has('debug')) document.body.classList.add('debug');
  const jump = params.get('scene');
  if (jump === 'desk') startDesk();
  if (jump === 'reveal') startReveal();
  if (jump === 'react') cutToReaction();
})();
