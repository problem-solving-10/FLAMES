/* ═══════════════════════════════════════════════════
   APP.JS  —  UI orchestration layer
   "The algorithm calculates the truth.
    The UI tells the story."
═══════════════════════════════════════════════════ */

// ── State ────────────────────────────────────────
let STATE = {
  name1: '', name2: '',
  calcResult: null,
  timelineOpen: false
};

// ── Reduced motion ───────────────────────────────
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const STEP_DELAY = prefersReducedMotion ? 80  : 500;
const FAST_DELAY = prefersReducedMotion ? 40  : 280;
const SLOW_DELAY = prefersReducedMotion ? 120 : 700;

// ── Utility: delay ───────────────────────────────
const wait = ms => new Promise(r => setTimeout(r, ms));

// ── Screen navigation ────────────────────────────
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active', 'exit');
  });
  const target = document.getElementById(id);
  target.classList.add('active');
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
}

// ── Input helpers ────────────────────────────────
function clearErr(id) {
  const el = document.getElementById(id);
  el.textContent = '';
  el.classList.remove('visible');
}

function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('visible');
}

function handleEnter(e) {
  if (e.key === 'Enter') startJourney();
}

// ── Toast ────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('visible'), 3000);
}

// ── Validate input ───────────────────────────────
function validate() {
  const v1 = document.getElementById('name1').value.trim();
  const v2 = document.getElementById('name2').value.trim();
  let ok = true;

  if (!v1) {
    showErr('err1', 'Looks like one name is missing… 👀');
    ok = false;
  } else if (!/^[a-zA-Z\s]+$/.test(v1)) {
    showErr('err1', 'Just letters please — no numbers or symbols 😊');
    ok = false;
  } else if (v1.length < 1) {
    showErr('err1', 'Please enter at least one letter 💕');
    ok = false;
  }

  if (!v2) {
    showErr('err2', 'Oops! We need both names before FLAMES can begin. ❤️');
    ok = false;
  } else if (!/^[a-zA-Z\s]+$/.test(v2)) {
    showErr('err2', 'Just letters please — no numbers or symbols 😊');
    ok = false;
  }

  return ok ? { v1, v2 } : null;
}

// ── Main entry ───────────────────────────────────
function startJourney() {
  const vals = validate();
  if (!vals) return;

  STATE.name1 = vals.v1;
  STATE.name2 = vals.v2;

  // Run engine (instant, deterministic)
  STATE.calcResult = FlamesEngine.calculate(STATE.name1, STATE.name2);

  // Reset all journey steps
  resetJourney();

  goTo('screen-journey');

  // Start Step 1 after brief entrance
  setTimeout(() => runStep1(), prefersReducedMotion ? 50 : 400);
}

// ── Reset journey UI — full clean slate ──────────
function resetJourney() {
  // Reset all step containers
  ['step-normalize','step-match','step-count','step-flames'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.add('hidden');
    el.classList.remove('step-enter','step-exit');
  });

  // Reset FLAMES letter cards
  ['fl-F','fl-L','fl-A','fl-M','fl-E','fl-S'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('eliminated','counting','winner','shaking');
  });

  // Reset next buttons to hidden and remove stale onclick handlers
  ['btn-to-match','btn-to-count','btn-to-flames'].forEach(id => {
    const btn = document.getElementById(id);
    btn.classList.add('hidden');
    btn.onclick = null;
  });

  // Clear status/indicator text
  const elim = document.getElementById('elim-status');
  const ind  = document.getElementById('count-indicator');
  if (elim) elim.textContent = '';
  if (ind)  ind.textContent  = '';

  // Reset match rows and status
  const row1 = document.getElementById('match-row1');
  const row2 = document.getElementById('match-row2');
  const ms   = document.getElementById('match-status');
  if (row1) row1.innerHTML = '';
  if (row2) row2.innerHTML = '';
  if (ms)   ms.textContent = '';

  // Reset remaining letters
  const remEl  = document.getElementById('remaining-letters');
  const remNum = document.getElementById('remaining-num');
  const remWrd = document.getElementById('remaining-word');
  if (remEl)  remEl.innerHTML  = '';
  if (remNum) remNum.textContent = '0';
  if (remWrd) { remWrd.textContent = ''; remWrd.classList.remove('count-reveal'); }

  // Reset normalize fields
  const n1o = document.getElementById('norm1-orig');
  const n1c = document.getElementById('norm1-clean');
  const n2o = document.getElementById('norm2-orig');
  const n2c = document.getElementById('norm2-clean');
  if (n1o) n1o.textContent = '';
  if (n1c) n1c.textContent = '';
  if (n2o) n2o.textContent = '';
  if (n2c) n2c.textContent = '';

  // Reset timeline toggle state
  STATE.timelineOpen = false;
  const tBody = document.getElementById('timeline-body');
  const tBtn  = document.getElementById('btn-timeline');
  if (tBody) tBody.classList.add('hidden');
  if (tBtn)  { tBtn.setAttribute('aria-expanded','false'); tBtn.textContent = '🔍 See How We Got This Result'; }

  // Reset result screen background
  const resultScreen = document.getElementById('screen-result');
  const revealScreen = document.getElementById('screen-reveal');
  if (resultScreen) resultScreen.style.background = '';
  if (revealScreen) revealScreen.style.background = '';

  // Reset reveal elements
  const sp = document.getElementById('reveal-spoken');
  const yr = document.getElementById('reveal-your');
  const rl = document.getElementById('reveal-letter');
  const tw = document.getElementById('reveal-title-wrap');
  const rn = document.getElementById('reveal-result-name');
  if (sp) { sp.textContent = ''; sp.classList.remove('fade-in'); }
  if (yr) { yr.textContent = ''; yr.classList.remove('fade-in'); }
  if (rl) { rl.textContent = ''; rl.classList.remove('letter-pop','letter-expand'); rl.style.color = ''; }
  if (tw) tw.classList.add('hidden');
  if (rn) { rn.textContent = ''; rn.classList.remove('title-pop'); rn.style.background = ''; rn.style.webkitTextFillColor = ''; }
}

/* ─────────────────────────────────────────────────
   STEP 1: NORMALIZE
───────────────────────────────────────────────── */
async function runStep1() {
  const { clean1, clean2 } = STATE.calcResult;
  const step = document.getElementById('step-normalize');
  step.classList.remove('hidden', 'step-exit', 'step-enter');
  // Force reflow so animation restarts cleanly
  void step.offsetWidth;
  step.classList.add('step-enter');

  document.getElementById('norm1-orig').textContent = STATE.name1;
  document.getElementById('norm2-orig').textContent = STATE.name2;
  document.getElementById('norm1-clean').textContent = '';
  document.getElementById('norm2-clean').textContent = '';

  const matchBtn = document.getElementById('btn-to-match');
  matchBtn.classList.add('hidden');
  matchBtn.onclick = null;

  await wait(STEP_DELAY);

  animateTextReveal('norm1-clean', clean1, FAST_DELAY);
  await wait(FAST_DELAY * clean1.length + 100);
  animateTextReveal('norm2-clean', clean2, FAST_DELAY);
  await wait(FAST_DELAY * clean2.length + 100);

  matchBtn.classList.remove('hidden');
  matchBtn.onclick = () => runStep2();
}

function animateTextReveal(elId, text, delay) {
  const el = document.getElementById(elId);
  el.textContent = '';
  [...text].forEach((ch, i) => {
    setTimeout(() => {
      el.textContent += ch;
    }, i * delay);
  });
}

/* ─────────────────────────────────────────────────
   STEP 2: CHARACTER MATCHING
───────────────────────────────────────────────── */
async function runStep2() {
  const stepNorm = document.getElementById('step-normalize');
  stepNorm.classList.add('step-exit');
  await wait(300);
  stepNorm.classList.add('hidden');
  stepNorm.classList.remove('step-exit','step-enter');

  const { clean1, clean2, matchEvents } = STATE.calcResult;
  const step = document.getElementById('step-match');
  step.classList.remove('hidden', 'step-exit', 'step-enter');
  void step.offsetWidth;
  step.classList.add('step-enter');

  const row1   = document.getElementById('match-row1');
  const row2   = document.getElementById('match-row2');
  const status = document.getElementById('match-status');
  const countBtn = document.getElementById('btn-to-count');
  row1.innerHTML = '';
  row2.innerHTML = '';
  status.textContent = '';
  countBtn.classList.add('hidden');
  countBtn.onclick = null;

  // Build letter tiles
  const tiles1 = buildLetterTiles(clean1, 'r1');
  const tiles2 = buildLetterTiles(clean2, 'r2');
  tiles1.forEach(t => row1.appendChild(t));
  tiles2.forEach(t => row2.appendChild(t));

  await wait(STEP_DELAY);

  // Animate matches one by one
  for (let i = 0; i < matchEvents.length; i++) {
    const ev = matchEvents[i];
    const t1 = document.getElementById(`r1-${ev.i1}`);
    const t2 = document.getElementById(`r2-${ev.i2}`);

    // Highlight both
    t1.classList.add('highlight');
    t2.classList.add('highlight');
    status.innerHTML = `<span class="match-found">Found a match! ✨ Both names have "<strong>${ev.char.toUpperCase()}</strong>"</span>`;

    await wait(SLOW_DELAY);

    // Strike through
    t1.classList.remove('highlight');
    t2.classList.remove('highlight');
    t1.classList.add('matched');
    t2.classList.add('matched');
    status.innerHTML = `<span class="match-gone">Oops… <strong>${ev.char.toUpperCase()}</strong> found a match and is out! 😄</span>`;

    await wait(SLOW_DELAY);
  }

  if (matchEvents.length === 0) {
    status.innerHTML = `<span class="match-none">No common letters — all letters stay! 👀</span>`;
    await wait(STEP_DELAY);
  } else {
    status.innerHTML = `<span class="match-done">All matches found! ✅ Moving on…</span>`;
    await wait(STEP_DELAY);
  }

  countBtn.classList.remove('hidden');
  countBtn.onclick = () => runStep3();
}

function buildLetterTiles(word, prefix) {
  return [...word].map((ch, i) => {
    const div = document.createElement('div');
    div.className = 'letter-tile';
    div.id = `${prefix}-${i}`;
    div.textContent = ch.toUpperCase();
    div.style.animationDelay = `${i * 60}ms`;
    return div;
  });
}

/* ─────────────────────────────────────────────────
   STEP 3: COUNT
───────────────────────────────────────────────── */
async function runStep3() {
  const stepMatch = document.getElementById('step-match');
  stepMatch.classList.add('step-exit');
  await wait(300);
  stepMatch.classList.add('hidden');
  stepMatch.classList.remove('step-exit','step-enter');

  const { remainCount, rem1, rem2 } = STATE.calcResult;
  const step = document.getElementById('step-count');
  step.classList.remove('hidden', 'step-exit', 'step-enter');
  void step.offsetWidth;
  step.classList.add('step-enter');

  const remLettersEl = document.getElementById('remaining-letters');
  const remNumEl     = document.getElementById('remaining-num');
  const remWordEl    = document.getElementById('remaining-word');
  const flamesBtn    = document.getElementById('btn-to-flames');
  remLettersEl.innerHTML = '';
  remNumEl.textContent   = '0';
  remWordEl.textContent  = '';
  remWordEl.classList.remove('count-reveal');
  flamesBtn.classList.add('hidden');
  flamesBtn.onclick = null;

  const allRem = [...rem1, ...rem2];

  await wait(STEP_DELAY);

  // Animate letters appearing one by one
  for (let i = 0; i < allRem.length; i++) {
    const tile = document.createElement('div');
    tile.className = 'rem-tile';
    tile.textContent = allRem[i].toUpperCase();
    tile.style.opacity = '0';
    remLettersEl.appendChild(tile);
    await wait(prefersReducedMotion ? 30 : 180);
    tile.style.opacity = '1';
    tile.classList.add('pop-in');
    remNumEl.textContent = String(i + 1);
  }

  await wait(STEP_DELAY);
  remWordEl.textContent = `${numWord(remainCount)} letter${remainCount !== 1 ? 's' : ''} remain`;
  remWordEl.classList.add('count-reveal');

  await wait(STEP_DELAY);
  flamesBtn.classList.remove('hidden');
  flamesBtn.onclick = () => runStep4();
}

/* ─────────────────────────────────────────────────
   STEP 4: FLAMES ELIMINATION
───────────────────────────────────────────────── */
async function runStep4() {
  const stepCount = document.getElementById('step-count');
  stepCount.classList.add('step-exit');
  await wait(300);
  stepCount.classList.add('hidden');
  stepCount.classList.remove('step-exit','step-enter');

  const { elimEvents, remainCount, final } = STATE.calcResult;
  const step = document.getElementById('step-flames');
  step.classList.remove('hidden', 'step-exit', 'step-enter');
  void step.offsetWidth;
  step.classList.add('step-enter');

  const statusEl    = document.getElementById('elim-status');
  const indicatorEl = document.getElementById('count-indicator');

  await wait(STEP_DELAY);

  statusEl.textContent = `Counting to ${remainCount} on each round… 🔢`;
  await wait(SLOW_DELAY);

  for (let round = 0; round < elimEvents.length; round++) {
    const ev = elimEvents[round];

    // Animate counting across remaining letters
    await animateCounting(ev.countSteps, indicatorEl, remainCount);

    // Eliminate
    const card = document.getElementById('fl-' + ev.letter);
    if (card) {
      card.classList.add('shaking');
      await wait(300);
      card.classList.remove('shaking');
      card.classList.add('eliminated');
    }

    indicatorEl.textContent = '';
    statusEl.innerHTML = `<span class="elim-msg">${elimMessage(round, ev.letter)}</span>`;
    await wait(SLOW_DELAY * 1.3);
  }

  // Winner!
  const winnerCard = document.getElementById('fl-' + final);
  if (winnerCard) {
    winnerCard.classList.add('winner');
  }

  statusEl.innerHTML = `<span class="elim-final">FLAMES has made its choice… 🔥</span>`;
  await wait(SLOW_DELAY * 1.5);

  // Go to reveal
  runReveal(final);
}

async function animateCounting(countSteps, indicatorEl, total) {
  for (let s = 0; s < countSteps.length; s++) {
    const { letter } = countSteps[s];
    const card = document.getElementById('fl-' + letter);

    // Highlight active card
    document.querySelectorAll('.fl-card.counting').forEach(c => c.classList.remove('counting'));
    if (card) card.classList.add('counting');

    indicatorEl.textContent = `Counting… ${s + 1} of ${total} → ${letter}`;
    await wait(prefersReducedMotion ? 60 : 280);
  }
  document.querySelectorAll('.fl-card.counting').forEach(c => c.classList.remove('counting'));
}

/* ─────────────────────────────────────────────────
   REVEAL
───────────────────────────────────────────────── */
async function runReveal(letter) {
  const cfg = FLAMES_CONFIG[letter];
  goTo('screen-reveal');

  const spokenEl = document.getElementById('reveal-spoken');
  const yourEl   = document.getElementById('reveal-your');
  const letterEl = document.getElementById('reveal-letter');
  const titleWrap = document.getElementById('reveal-title-wrap');
  const nameEl   = document.getElementById('reveal-result-name');

  spokenEl.textContent = '';
  yourEl.textContent   = '';
  letterEl.textContent = '';
  titleWrap.classList.add('hidden');
  nameEl.textContent   = '';

  // Apply result theme to reveal background
  document.getElementById('screen-reveal').style.background = cfg.bg;

  await wait(SLOW_DELAY);
  spokenEl.textContent = 'FLAMES has spoken…';
  spokenEl.classList.add('fade-in');

  await wait(SLOW_DELAY * 2);
  yourEl.textContent = 'Your result is…';
  yourEl.classList.add('fade-in');

  await wait(SLOW_DELAY * 1.5);

  // Show the letter
  letterEl.textContent = letter;
  letterEl.style.color = cfg.glow;
  letterEl.classList.add('letter-pop');

  await wait(SLOW_DELAY * 1.5);

  // Expand to full title
  letterEl.classList.add('letter-expand');
  await wait(STEP_DELAY);

  titleWrap.classList.remove('hidden');
  nameEl.textContent = cfg.title;
  nameEl.style.background = cfg.gradient;
  nameEl.style.webkitBackgroundClip = 'text';
  nameEl.style.webkitTextFillColor = 'transparent';
  nameEl.classList.add('title-pop');

  // Spawn particles
  spawnParticles(cfg.particles);
  if (cfg.confetti) launchConfetti(cfg);

  await wait(SLOW_DELAY * 2);
  showResult(letter);
}

/* ─────────────────────────────────────────────────
   RESULT SCREEN
───────────────────────────────────────────────── */
function showResult(letter) {
  const cfg = FLAMES_CONFIG[letter];
  const { clean1, clean2, matchEvents, remainCount, elimEvents } = STATE.calcResult;

  goTo('screen-result');
  document.getElementById('screen-result').style.background = cfg.bg;

  document.getElementById('result-icon').textContent    = cfg.emoji;
  document.getElementById('result-name').textContent    = cfg.title;
  document.getElementById('result-headline').textContent = cfg.headline;
  document.getElementById('result-sub').textContent     = cfg.sub;

  // Apply gradient to result name
  const nameEl = document.getElementById('result-name');
  nameEl.style.background = cfg.gradient;
  nameEl.style.webkitBackgroundClip = 'text';
  nameEl.style.webkitTextFillColor = 'transparent';

  // Journey summary
  buildSummary(letter, clean1, clean2, matchEvents, remainCount, elimEvents);

  // Timeline
  buildTimeline(letter, clean1, clean2, matchEvents, remainCount, elimEvents);

  // Particles
  spawnParticles(cfg.particles);
  if (cfg.confetti) launchConfetti(cfg);
}

function buildSummary(letter, c1, c2, matches, count, elims) {
  const el = document.getElementById('summary-steps');
  const matched = matches.map(m => m.char.toUpperCase()).join(', ') || 'none';
  const eliminated = elims.map(e => e.letter).join(' → ');

  el.innerHTML = `
    <div class="sum-row"><span class="sum-icon">👤</span><span class="sum-label">Names</span><span class="sum-val">${STATE.name1} &amp; ${STATE.name2}</span></div>
    <div class="sum-row"><span class="sum-icon">🔍</span><span class="sum-label">Matching letters</span><span class="sum-val">${matched}</span></div>
    <div class="sum-row"><span class="sum-icon">🔢</span><span class="sum-label">Remaining count</span><span class="sum-val">${count}</span></div>
    <div class="sum-row"><span class="sum-icon">🔥</span><span class="sum-label">Letters eliminated</span><span class="sum-val">${eliminated || 'none'}</span></div>
    <div class="sum-row sum-final"><span class="sum-icon">${FLAMES_CONFIG[letter].emoji}</span><span class="sum-label">Final result</span><span class="sum-val"><strong>${FLAMES_CONFIG[letter].title}</strong></span></div>
  `;
}

function buildTimeline(letter, c1, c2, matches, count, elims) {
  const el = document.getElementById('timeline-list');
  const lines = [];

  lines.push(`✓ Name 1 normalized: <strong>${c1}</strong>`);
  lines.push(`✓ Name 2 normalized: <strong>${c2}</strong>`);

  if (matches.length > 0) {
    lines.push(`✓ ${matches.length} matching letter(s) found: ${matches.map(m => '<strong>' + m.char.toUpperCase() + '</strong>').join(', ')}`);
    lines.push(`✓ Matched letters removed from both names`);
  } else {
    lines.push(`✓ No common letters found — all letters kept`);
  }

  lines.push(`✓ Remaining letter count = <strong>${count}</strong>`);
  lines.push(`✓ FLAMES elimination begins (counting by ${count})`);

  elims.forEach(ev => {
    lines.push(`✗ <strong>${ev.letter}</strong> (${FLAMES_CONFIG[ev.letter]?.title || ev.letter}) eliminated`);
  });

  lines.push(`🎯 Final result = <strong>${FLAMES_CONFIG[letter].title}</strong> ${FLAMES_CONFIG[letter].emoji}`);

  el.innerHTML = lines.map(l =>
    `<div class="tl-row">${l}</div>`
  ).join('');
}

function toggleTimeline() {
  const body = document.getElementById('timeline-body');
  const btn  = document.getElementById('btn-timeline');
  STATE.timelineOpen = !STATE.timelineOpen;
  body.classList.toggle('hidden', !STATE.timelineOpen);
  btn.setAttribute('aria-expanded', String(STATE.timelineOpen));
  btn.textContent = STATE.timelineOpen
    ? '🔍 Hide Calculation'
    : '🔍 See How We Got This Result';
}

/* ─────────────────────────────────────────────────
   ACTIONS
───────────────────────────────────────────────── */
function tryAgain() {
  // Keep same names, rerun the full journey from scratch
  if (!STATE.name1 || !STATE.name2) {
    goTo('screen-input');
    return;
  }
  STATE.calcResult = FlamesEngine.calculate(STATE.name1, STATE.name2);
  resetJourney();
  goTo('screen-journey');
  setTimeout(() => runStep1(), prefersReducedMotion ? 50 : 400);
}

function playAnother() {
  // Clear everything and go back to input
  STATE.name1 = '';
  STATE.name2 = '';
  STATE.calcResult = null;
  document.getElementById('name1').value = '';
  document.getElementById('name2').value = '';
  clearErr('err1');
  clearErr('err2');
  resetJourney();
  goTo('screen-input');
  setTimeout(() => document.getElementById('name1').focus(), 300);
}

async function shareResult() {
  const cfg = FLAMES_CONFIG[STATE.calcResult.final];
  const msg = cfg.shareMsg(STATE.name1, STATE.name2);

  if (navigator.share) {
    try {
      await navigator.share({ title: 'FLAMES Result 🔥', text: msg });
      return;
    } catch (_) { /* fall through */ }
  }
  try {
    await navigator.clipboard.writeText(msg);
    showToast('Result copied! ❤️');
  } catch (_) {
    showToast('Could not copy — try sharing manually 😊');
  }
}

/* ─────────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────────── */
function spawnParticles(emojis) {
  if (prefersReducedMotion) return;
  const count = 14;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.cssText = `
        left:${10 + Math.random() * 80}vw;
        top:${40 + Math.random() * 40}vh;
        font-size:${1 + Math.random() * 1.2}rem;
        animation-duration:${1.8 + Math.random() * 1.2}s;
        animation-delay:${Math.random() * 0.4}s;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3000);
    }, i * 100);
  }
}

/* ─────────────────────────────────────────────────
   CONFETTI
───────────────────────────────────────────────── */
function launchConfetti(cfg) {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const palette = ['#ff6b9d','#ff4d7e','#b565e8','#ffd6e8','#fffde8','#a0f0d0','#f7971e'];
  const pieces = Array.from({ length: 80 }, () => ({
    x:     Math.random() * canvas.width,
    y:    -20 - Math.random() * 120,
    w:     6 + Math.random() * 9,
    h:     3 + Math.random() * 6,
    color: palette[Math.floor(Math.random() * palette.length)],
    vx:   (Math.random() - 0.5) * 4,
    vy:    2 + Math.random() * 5,
    rot:   Math.random() * 360,
    vr:   (Math.random() - 0.5) * 8
  }));

  let frame = 0;
  const MAX = 140;

  function draw() {
    if (frame++ > MAX) { ctx.clearRect(0,0,canvas.width,canvas.height); return; }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const alpha = Math.max(0, 1 - frame / (MAX * 0.85));
    pieces.forEach(p => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.vr;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────────────────────
   BACKGROUND PARTICLES
───────────────────────────────────────────────── */
(function initBgParticles() {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('particle-canvas');
  // Subtle background orbs — drawn on idle frames
  // Kept very lightweight — 6 orbs
  const orbs = Array.from({ length: 6 }, () => ({
    x:    Math.random() * window.innerWidth,
    y:    Math.random() * window.innerHeight,
    r:    40 + Math.random() * 80,
    vx:   (Math.random() - 0.5) * 0.4,
    vy:   (Math.random() - 0.5) * 0.4,
    hue:  300 + Math.random() * 60
  }));

  function drawOrbs() {
    const ctx = canvas.getContext('2d');
    if (!ctx || canvas.width === 0) {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    orbs.forEach(o => {
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `hsla(${o.hue},80%,75%,0.07)`);
      g.addColorStop(1, `hsla(${o.hue},80%,75%,0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      o.x += o.vx;
      o.y += o.vy;
      if (o.x < -o.r)  o.x = canvas.width  + o.r;
      if (o.x > canvas.width  + o.r) o.x = -o.r;
      if (o.y < -o.r)  o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;
    });
    requestAnimationFrame(drawOrbs);
  }

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  drawOrbs();
})();

/* ─────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start').addEventListener('click', () => goTo('screen-input'));
  setTimeout(() => document.getElementById('name1').focus &&
    document.getElementById('name1').focus(), 100);
});
