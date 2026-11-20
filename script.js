/* ==========================================================
   FOLCLORIA — Juego "¿Qué leyenda vive en vos?"
   1) CONFIG: imágenes, leyendas, preguntas y textos (editar aquí).
   2) Lógica del juego: jugadores, preguntas, resultado, familia, figurita.
   Sin cuentas ni servidores: todo queda en el aparato.
   ========================================================== */
'use strict';

/* ----------------------------------------------------------
   1) CONFIG
   Imágenes: mismas rutas del app. Si un archivo no existe se
   muestra un recuadro neutro con su etiqueta.
   ---------------------------------------------------------- */
const A = {
  logo:    'assets/Logodefolclor.png',
  mascota: 'assets/imgs/personafolc.png',
  /* Brand pattern de fondo (opcional; si no existe, colores lisos) */
  patron:  'assets/imgs/patron.folc.png',
  patronOpacidad: 0.1,       /* fondo de las pantallas */
  patronOpacidadHero: 0.2    /* franja verde del inicio */
};

const KEYS = ['iara', 'saci', 'boto', 'curupira'];

const LEY = {
  iara: {
    nombre: 'Iara', titulo: 'La guardiana de los ríos', emoji: '🌊',
    color: '#2a9fd6', bg: '#def2fb', img: 'assets/imgs/Folcloria imprimir/iara.app.png',
    texto: 'Tienes una imaginación enorme y un corazón tranquilo. Te gusta escuchar, crear y soñar, y tu voz tiene el poder de calmar a todos.',
    poder: 'Hablar con el agua y con los animales del río.',
    curiosidad: 'Su nombre viene del tupi y se relaciona con «señora del agua».',
    amigo: 'boto',
    charla: '¿Qué canción los hace sentir en calma? Cada uno cuenta la suya.'
  },
  saci: {
    nombre: 'Saci-Pererê', titulo: 'El travieso de una sola pierna', emoji: '🌪️',
    color: '#ff8a3d', bg: '#ffe6d3', img: 'assets/imgs/Folcloria imprimir/saci.app.png',
    texto: 'Eres rápido, ingenioso y lleno de energía. Siempre tienes una idea divertida (¡y un poquito traviesa!) y ningún remolino te asusta.',
    poder: 'Aparecer y desaparecer en un remolino de viento.',
    curiosidad: 'Se celebra el Día del Saci el 31 de octubre.',
    amigo: 'curupira',
    charla: '¿Cuál fue la travesura más divertida que hicieron de chicos? ¡Cuéntenla!'
  },
  boto: {
    nombre: 'Boto-cor-de-rosa', titulo: 'El delfín encantado', emoji: '🐬',
    color: '#ef476f', bg: '#ffe0ec', img: 'assets/imgs/Folcloria imprimir/boto.app.png',
    texto: 'Eres simpático, alegre y encantas a todos. Te encanta bailar, hacer amigos y convertir cualquier momento en una fiesta.',
    poder: 'Hacer sonreír a todos con tu encanto y tu baile.',
    curiosidad: 'El boto-cor-de-rosa existe de verdad: es un delfín de río de la Amazonía.',
    amigo: 'iara',
    charla: '¿Qué canción bailarían todos juntos ahora mismo?'
  },
  curupira: {
    nombre: 'Curupira', titulo: 'El guardián del bosque', emoji: '🌳',
    color: '#1f8a4c', bg: '#e3f5e8', img: 'assets/imgs/Folcloria imprimir/curupira.app.png',
    texto: 'Eres valiente, leal y amas la naturaleza. Cuidas a los tuyos y a los animales, y siempre sabes encontrar el camino.',
    poder: 'Proteger el bosque y a todos sus animales.',
    curiosidad: 'Tiene los pies al revés: sus huellas confunden a quien se mete en el bosque con malas intenciones.',
    amigo: 'saci',
    charla: '¿Qué animal o planta les gustaría proteger? ¿Por qué?'
  }
};

/* Resultado secreto: respuestas muy equilibradas */
const MASCOTA = {
  nombre: 'Un poco de cada leyenda', titulo: 'Como nuestra mascota', emoji: '🌟',
  bg: '#fff4cf', img: A.mascota,
  texto: 'Eres creativo, travieso, simpático y valiente, todo a la vez. ¡Un resultado muy especial que casi nadie consigue!',
  poder: 'Tomar lo mejor de cada leyenda cuando más lo necesitas.',
  curiosidad: 'En el bosque de Folcloria hay lugar para todas las leyendas, y tú las llevas dentro.',
  charla: '¿Qué parte de cada leyenda les gustaría tener hoy: la calma, la travesura, la alegría o la valentía?'
};

/* Cada respuesta: [texto, emoji, leyenda principal (+3), leyenda secundaria (+1)] */
const QUESTIONS = [
  { kid: true, q: 'Encuentras un río brillante en medio del bosque. ¿Qué haces?', a: [
    ['Le canto una canción', '🎶', 'iara', 'boto'],
    ['Salto de piedra en piedra', '🦘', 'saci', 'curupira'],
    ['¡Armo una fiesta con todos!', '🎉', 'boto', 'saci'],
    ['Cuido que quede limpito', '🌿', 'curupira', 'iara'] ] },
  { kid: true, q: 'Hoy es un día libre. ¿Qué te gustaría hacer?', a: [
    ['Dibujar e inventar historias', '🎨', 'iara', 'boto'],
    ['Inventar un juego nuevo', '🎲', 'saci', 'boto'],
    ['Bailar con muchos amigos', '💃', 'boto', 'saci'],
    ['Explorar la naturaleza', '🌳', 'curupira', 'iara'] ] },
  { kid: true, q: 'Un amigo está triste. ¿Qué haces?', a: [
    ['Me siento a su lado y le canto bajito', '🎵', 'iara', 'curupira'],
    ['Le hago una broma para que se ría', '🤪', 'saci', 'boto'],
    ['Lo invito a jugar con todos', '🤝', 'boto', 'iara'],
    ['Le doy un abrazo fuerte y lo cuido', '🤗', 'curupira', 'iara'] ] },
  { kid: true, q: '¿Qué superpoder elegirías?', a: [
    ['Hablar con el agua y los peces', '🐟', 'iara', 'curupira'],
    ['Aparecer y desaparecer en un remolino', '🌪️', 'saci', 'boto'],
    ['Hacer amigos en un segundo', '✨', 'boto', 'iara'],
    ['Proteger a todos los animales', '🦜', 'curupira', 'saci'] ] },
  { kid: true, q: 'Te perdiste en el bosque. ¿Qué haces?', a: [
    ['Me quedo tranquilo y escucho los sonidos', '👂', 'iara', 'curupira'],
    ['Invento un atajo, ¡seguro funciona!', '🏃', 'saci', 'boto'],
    ['Les pregunto a los animales cómo salir', '🐒', 'boto', 'curupira'],
    ['Sigo las huellas y las señales', '👣', 'curupira', 'saci'] ] },
  { q: 'Tus amigos dicen que eres…', a: [
    ['Soñador/a y creativo/a', '💭', 'iara', 'boto'],
    ['Travieso/a e ingenioso/a', '😜', 'saci', 'boto'],
    ['El alma de la fiesta', '🎊', 'boto', 'saci'],
    ['Leal y valiente', '🛡️', 'curupira', 'iara'] ] },
  { q: '¿Qué sonido te gusta más?', a: [
    ['Una canción junto al río', '🎼', 'iara', 'curupira'],
    ['El silbido del viento', '🍃', 'saci', 'curupira'],
    ['Tambores y música para bailar', '🥁', 'boto', 'saci'],
    ['Los pájaros de la selva', '🐦', 'curupira', 'iara'] ] },
  { q: 'Llega una tormenta. ¿Qué haces?', a: [
    ['Miro la lluvia y me inspiro', '🌧️', 'iara', 'curupira'],
    ['¡Salto en los charcos!', '💦', 'saci', 'boto'],
    ['Armo una fiesta bajo techo', '🎈', 'boto', 'saci'],
    ['Me aseguro de que todos estén a salvo', '🏕️', 'curupira', 'iara'] ] }
];

/* Qué preguntas (índices de QUESTIONS) usa cada nivel */
const LEVEL_QUESTIONS = { kid: [0, 1, 2, 3], adv: [0, 1, 3, 5, 6, 7] };

const BALANCED_MAX_SHARE = 0.30;   /* si la leyenda más fuerte no pasa de este % → resultado secreto */

/* ----------------------------------------------------------
   2) Utilidades
   ---------------------------------------------------------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* Recorta solos los márgenes transparentes del PNG, para que el personaje se vea grande */
function trimPng(img) {
  if (img.dataset.trim) return; img.dataset.trim = '1';
  try {
    const w = img.naturalWidth, h = img.naturalHeight; if (!w || !h) return;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, w, h).data;
    let t = h, b = -1, l = w, r = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 16) { if (y < t) t = y; if (y > b) b = y; if (x < l) l = x; if (x > r) r = x; }
    if (r < l || b < t) return;
    const pad = Math.round(Math.max(r - l, b - t) * 0.02);
    l = Math.max(0, l - pad); t = Math.max(0, t - pad); r = Math.min(w - 1, r + pad); b = Math.min(h - 1, b + pad);
    if (l <= 0 && t <= 0 && r >= w - 1 && b >= h - 1) return;
    const o = document.createElement('canvas'); o.width = r - l + 1; o.height = b - t + 1;
    o.getContext('2d').drawImage(c, l, t, o.width, o.height, 0, 0, o.width, o.height);
    img.src = o.toDataURL('image/png');
  } catch (e) { /* sin recorte si el navegador lo bloquea */ }
}
function pic(src, label, cls = '') {
  return `<div class="ph-wrap ${cls}"><img src="${esc(src)}" alt="${esc(label)}" draggable="false" onload="trimPng(this)" onerror="this.parentNode.classList.add('missing')"><span class="ph-label">${esc(label)}<br>(aguardando imagen)</span></div>`;
}
const haptic = () => { try { navigator.vibrate && navigator.vibrate(8); } catch (e) {} };

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function view(html) {
  const m = $('#modal'); if (m) m.hidden = true;
  const el = $('#screen');
  el.innerHTML = html; el.scrollTop = 0;
  el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
}

/* Álbum de figuritas (localStorage con respaldo en memoria) */
const Album = (() => {
  const KEY = 'folcloria-quiz:album';
  let set = new Set();
  try { set = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}
  return {
    has: k => set.has(k),
    add(k) { set.add(k); try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch (e) {} },
    count: () => KEYS.filter(k => set.has(k)).length
  };
})();

/* Voz (usa la voz en español del aparato) */
let voice = null;
const canSpeak = 'speechSynthesis' in window;
function pickVoice() {
  if (!canSpeak) return;
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => /^es[-_](AR|419|MX|US)/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null;
}
if (canSpeak) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(text) {
  if (!canSpeak) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice ? voice.lang : 'es-ES'; if (voice) u.voice = voice; u.rate = 0.95;
    speechSynthesis.speak(u);
  } catch (e) {}
}
const stopSpeak = () => { try { canSpeak && speechSynthesis.cancel(); } catch (e) {} };

/* ----------------------------------------------------------
   3) Estado
   ---------------------------------------------------------- */
const S = { players: [], p: 0, qs: [], qi: 0, ans: [], cur: [], results: [], autoRead: true };

const newPlayer = (mode = 'kid') => ({ name: '', mode });
/* Nombre escrito (vacío si no escribió nada) */
const typedName = () => (S.players[0] ? S.players[0].name.trim() : '');

/* ----------------------------------------------------------
   4) Pantallas
   ---------------------------------------------------------- */
function renderIntro() {
  stopSpeak();
  const slots = KEYS.map(k => Album.has(k)
    ? `<div class="slot on" title="${esc(LEY[k].nombre)}">${pic(LEY[k].img, LEY[k].nombre)}</div>`
    : `<div class="slot" title="Aún no descubierta">?</div>`).join('');
  view(`
    <div class="land">
      <section class="hero-panel">
        ${pic(A.logo, 'Logotipo Folcloria', 'logo')}
        ${pic(A.mascota, 'Mascota oficial', 'mascot')}
      </section>
      <section class="intro-right">
        <div class="card">
          <h1>¿Qué leyenda vive en vos?</h1>
          <p>Responde unas preguntas del bosque y descubre cuál de las leyendas de Folcloria se parece más a ti. ¡Pueden jugar niños y grandes!</p>
          <button class="btn btn-primary btn-xl" data-act="play">Jugar</button>
        </div>
        <div class="album">
          <h3>Mi álbum de figuritas <small>${Album.count()} de 4</small></h3>
          <div class="slots">${slots}</div>
        </div>
        <p class="fine">Sin cuentas ni datos personales: todo queda en esta tablet.</p>
      </section>
    </div>
  `);
}

function renderSetup() {
  const p = S.players[0];
  view(`
    <div class="setup">
      <button class="icon-btn" data-act="home" aria-label="Volver">‹</button>
      <div class="setup-wrap">
        <div class="setup-card">
          <h1>¿Quién juega?</h1>
          <label class="field">
            <span>Escribe tu nombre (si quieres)</span>
            <input class="pname" maxlength="16" autocomplete="off" enterkeyhint="done" placeholder="Tu nombre" value="${esc(p.name)}" aria-label="Tu nombre">
          </label>
          <div class="field">
            <span>Elige tu nivel</span>
            <div class="seg" role="group" aria-label="Nivel">
              <button type="button" data-act="mode" data-m="kid" class="${p.mode === 'kid' ? 'on' : ''}">Explorador<small>5 a 8 años · 4 preguntas</small></button>
              <button type="button" data-act="mode" data-m="adv" class="${p.mode === 'adv' ? 'on' : ''}">Aventurero<small>9 años o más · 6 preguntas</small></button>
            </div>
          </div>
          ${canSpeak ? `<label class="opt"><input type="checkbox" id="autoRead" ${S.autoRead ? 'checked' : ''}><span>Leer las preguntas en voz alta a los Exploradores 🔊</span></label>` : ''}
          <button class="btn btn-primary btn-xl" data-act="start">¡Empezar la aventura!</button>
        </div>
      </div>
    </div>
  `);
}

function startPlayer() {
  const p = S.players[S.p];
  S.qs = (LEVEL_QUESTIONS[p.mode] || LEVEL_QUESTIONS.kid).map(i => QUESTIONS[i]);
  S.qi = 0; S.ans = [];
  renderQuestion();
}

function questionSpeech(q, opts) {
  return q.q + ' ' + opts.map((o, i) => `Opción ${i + 1}: ${o.t}.`).join(' ');
}

function renderQuestion() {
  const p = S.players[S.p], q = S.qs[S.qi];
  S.cur = shuffle(q.a.map(([t, e, m, s]) => ({ t, e, m, s })));
  const dots = S.qs.map((_, i) => `<span class="dot ${i < S.qi ? 'done' : i === S.qi ? 'now' : ''}"></span>`).join('');
  view(`
    <div class="qscreen ${p.mode === 'kid' ? 'kid' : ''}">
      <div class="qtop">
        <button class="icon-btn" data-act="exit" aria-label="Salir del juego">×</button>
        <div class="dots" role="img" aria-label="Pregunta ${S.qi + 1} de ${S.qs.length}">${dots}</div>
        <div class="who"><span>${esc(typedName() || (p.mode === 'kid' ? 'Explorador' : 'Aventurero'))}</span></div>
      </div>
      <div class="qbody">
        <div class="qleft">
          <div class="qcard">
            <div class="qhead">
              <span class="n">Pregunta ${S.qi + 1} de ${S.qs.length}</span>
              ${canSpeak ? `<button class="speak" data-act="speak" aria-label="Escuchar la pregunta">🔊</button>` : ''}
            </div>
            <h2>${esc(q.q)}</h2>
          </div>
          <img class="qmascot" src="${esc(A.mascota)}" alt="" draggable="false" onerror="this.remove()">
        </div>
        <div class="answers" id="answers">
          ${S.cur.map((o, i) => `<button class="ans" data-act="ans" data-i="${i}"><span class="em" aria-hidden="true">${o.e}</span><span>${esc(o.t)}</span></button>`).join('')}
        </div>
      </div>
    </div>
  `);
  if (S.autoRead && p.mode === 'kid') speak(questionSpeech(q, S.cur));
}

function answer(i, btn) {
  const box = $('#answers'); if (box.classList.contains('locked')) return;
  haptic(); stopSpeak();
  box.classList.add('locked'); btn.classList.add('chosen');
  S.ans.push(S.cur[i]);
  setTimeout(() => {
    S.qi++;
    if (S.qi < S.qs.length) renderQuestion(); else finishPlayer();
  }, 420);
}

/* ----------------------------------------------------------
   5) Resultado
   ---------------------------------------------------------- */
function computeResult(ans) {
  const s = { iara: 0, saci: 0, boto: 0, curupira: 0 };
  ans.forEach(a => { s[a.m] += 3; s[a.s] += 1; });
  const total = ans.length * 4;
  const lastIdx = k => { for (let i = ans.length - 1; i >= 0; i--) if (ans[i].m === k) return i; return -1; };
  const order = KEYS.slice().sort((x, y) => (s[y] - s[x]) || (lastIdx(y) - lastIdx(x)));
  /* porcentajes que suman 100 (método del mayor resto) */
  const raw = KEYS.map(k => ({ k, v: 100 * s[k] / total }));
  const pct = {}; let used = 0;
  raw.forEach(r => { pct[r.k] = Math.floor(r.v); used += pct[r.k]; });
  raw.slice().sort((a, b) => (b.v - Math.floor(b.v)) - (a.v - Math.floor(a.v))).slice(0, 100 - used).forEach(r => pct[r.k]++);
  const top = order[0];
  const secret = s[top] / total <= BALANCED_MAX_SHARE;
  return { key: secret ? 'mascota' : top, top, pct, order, secret };
}

function finishPlayer() {
  const r = computeResult(S.ans);
  S.results[S.p] = r;
  if (!r.secret) Album.add(r.top);
  renderResult(S.p);
}

function dataOf(r) { return r.secret ? MASCOTA : LEY[r.key]; }

function renderResult(i) {
  stopSpeak();
  const p = S.players[i], r = S.results[i], L = dataOf(r);
  const mix = r.order.map(k => `
    <div class="mrow"><span>${esc(LEY[k].nombre.split('-')[0])}</span><span class="bar"><i style="--c:${LEY[k].color}" data-w="${r.pct[k]}"></i></span><b>${r.pct[k]}%</b></div>`).join('');
  const friend = !r.secret ? LEY[L.amigo] : null;
  const nm = typedName();
  view(`
    <div class="rscreen" style="--bgc:${L.bg}">
      <section class="rleft">
        <span class="badge">${r.secret ? '¡Resultado secreto!' : '¡Descubriste tu leyenda!'}</span>
        ${pic(L.img, L.nombre, 'res-art')}
        <div class="res-title">
          <div class="pre">${nm ? esc(nm) + ', eres…' : '¡Eres…'}</div>
          <h1>${esc(L.nombre)}</h1>
          <p>${esc(L.titulo)}</p>
        </div>
        <div class="actions">
          <button class="btn btn-primary block-btn" data-act="again">Jugar otra vez</button>
          <button class="btn btn-secondary block-btn" data-act="sticker" data-i="${i}">📸 Guardar mi figurita</button>
        </div>
      </section>
      <section class="rright">
        <div class="block b-green"><h2>${L.emoji} Así eres</h2><p>${esc(L.texto)}</p></div>
        <div class="block b-yellow"><h2>⚡ Tu superpoder</h2><p>${esc(L.poder)}</p></div>
        <div class="block"><h2>📊 Tu mezcla del bosque</h2><div class="mix">${mix}</div></div>
        ${friend
          ? `<div class="block b-blue"><h2>🤝 Tu mejor amigo del bosque</h2><div class="friend"><div class="thumb">${pic(friend.img, friend.nombre)}</div><p><b>${esc(friend.nombre)}</b><br>${esc(friend.titulo)}</p></div></div>`
          : `<div class="block b-blue"><h2>🌟 Un resultado especial</h2><p>Tienes un poquito de todas las leyendas, ¡no hay otra persona igual a ti!</p></div>`}
        <div class="block"><h2>🔎 ¿Sabías que…?</h2><p>${esc(L.curiosidad)}</p></div>
        <div class="block b-orange"><h2>💬 Para conversar en familia</h2><p>${esc(L.charla)}</p></div>
      </section>
    </div>
  `);
  /* anima las barras */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.bar i').forEach(b => { b.style.width = b.dataset.w + '%'; });
  }));
}

/* ----------------------------------------------------------
   6) Familia
   ---------------------------------------------------------- */
/* ----------------------------------------------------------
   7) Figurita para compartir (imagen PNG)
   ---------------------------------------------------------- */
const loadImg = src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function contain(ctx, im, x, y, w, h) {
  const k = Math.min(w / im.width, h / im.height), dw = im.width * k, dh = im.height * k;
  ctx.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

async function makeSticker(i) {
  const r = S.results[i], L = dataOf(r), nm = typedName();
  const [logo, art, pat] = await Promise.all([loadImg(A.logo), loadImg(L.img), loadImg(A.patron)]);
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, W * .4, H);
  g.addColorStop(0, '#1f8a4c'); g.addColorStop(.6, '#1a7a43'); g.addColorStop(1, '#0f4d2b');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  if (pat) { x.globalAlpha = .22; const k = Math.max(W / pat.width, H / pat.height); x.drawImage(pat, (W - pat.width * k) / 2, 0, pat.width * k, pat.height * k); x.globalAlpha = 1; }
  /* logo */
  if (logo) contain(x, logo, W / 2 - 230, 36, 460, 220);
  else { x.fillStyle = '#fff'; x.font = '900 84px sans-serif'; x.textAlign = 'center'; x.fillText('FOLCLORIA', W / 2, 150); }
  /* tarjeta */
  x.save(); x.shadowColor = 'rgba(0,0,0,.28)'; x.shadowBlur = 40; x.shadowOffsetY = 14;
  x.fillStyle = '#fff'; rrect(x, 70, 270, 940, 960, 70); x.fill(); x.restore();
  x.fillStyle = L.bg; rrect(x, 110, 310, 860, 560, 56); x.fill();
  if (art) contain(x, art, 130, 325, 820, 530);
  else { x.font = '260px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#000'; x.fillText(L.emoji, W / 2, 590); x.textBaseline = 'alphabetic'; }
  /* textos */
  x.textAlign = 'center'; x.fillStyle = '#4f6b60'; x.font = '800 42px -apple-system, "Segoe UI", sans-serif';
  x.fillText((nm ? nm + ', eres…' : '¡Eres…'), W / 2, 940);
  x.fillStyle = '#0f4d2b'; let fs = 100; x.font = `900 ${fs}px -apple-system, "Segoe UI", sans-serif`;
  while (x.measureText(L.nombre).width > 820 && fs > 50) { fs -= 4; x.font = `900 ${fs}px -apple-system, "Segoe UI", sans-serif`; }
  x.fillText(L.nombre, W / 2, 1040);
  x.fillStyle = '#4f6b60'; x.font = '700 40px -apple-system, "Segoe UI", sans-serif';
  x.fillText(L.titulo, W / 2, 1100);
  /* mezcla */
  const top3 = r.order.slice(0, 3).map(k => `${LEY[k].nombre.split('-')[0]} ${r.pct[k]}%`).join('  ·  ');
  x.fillStyle = '#1f8a4c'; x.font = '800 34px -apple-system, "Segoe UI", sans-serif';
  x.fillText(top3, W / 2, 1170);
  x.fillStyle = '#fff'; x.font = '800 38px -apple-system, "Segoe UI", sans-serif';
  x.fillText('¿Y tú? Descubre tu leyenda en Folcloria', W / 2, 1296);
  return c;
}

async function saveSticker(i) {
  try {
    toast('Preparando tu figurita…');
    const c = await makeSticker(i);
    const blob = await new Promise(res => c.toBlob(res, 'image/png'));
    const file = new File([blob], 'mi-leyenda-folcloria.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Mi leyenda en Folcloria' }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mi-leyenda-folcloria.png';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('¡Figurita guardada! 📸');
  } catch (e) { toast('No se pudo crear la figurita'); }
}

/* ----------------------------------------------------------
   8) Eventos
   ---------------------------------------------------------- */
function begin(mode) {
  S.players = [newPlayer(mode)];
  S.results = []; S.p = 0;
  renderSetup();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const act = t.dataset.act, i = +t.dataset.i;
  switch (act) {
    case 'play': begin('kid'); break;
    case 'home': renderIntro(); break;
    case 'mode': { const keep = S.players[0].name; S.players[0].mode = t.dataset.m; renderSetup(); const inp = $('.pname'); if (inp) inp.value = keep; break; }
    case 'start':
      S.results = []; S.p = 0; haptic();
      startPlayer();
      break;
    case 'speak': { const q = S.qs[S.qi]; speak(questionSpeech(q, S.cur)); break; }
    case 'ans': answer(i, t); break;
    case 'exit': stopSpeak(); $('#modal').hidden = false; break;
    case 'exit-no': $('#modal').hidden = true; break;
    case 'exit-yes': $('#modal').hidden = true; renderIntro(); break;
    case 'again': { const m = S.players[0] ? S.players[0].mode : 'kid'; begin(m); break; }
    case 'sticker': saveSticker(i); break;
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('pname')) e.target.blur(); });

document.addEventListener('input', e => {
  if (e.target.classList.contains('pname')) S.players[0].name = e.target.value;
  if (e.target.id === 'autoRead') S.autoRead = e.target.checked;
});

/* Evita el zoom accidental de página en iOS */
['gesturestart', 'gesturechange'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));

/* Brand pattern de fondo (si el archivo existe) */
(function applyPattern() {
  const img = new Image();
  img.onload = () => {
    const app = $('#app'), c = v => Math.min(1, Math.max(0, v));
    app.style.setProperty('--pattern', `url("${A.patron}")`);
    app.style.setProperty('--veil', `rgba(244, 250, 245, ${(1 - c(A.patronOpacidad)).toFixed(2)})`);
    app.style.setProperty('--hero-a', (1 - c(A.patronOpacidadHero)).toFixed(2));
    app.classList.add('has-pattern');
  };
  img.src = A.patron;
})();

renderIntro();