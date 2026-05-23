/* ───────────────────────────────────────────
   CONTENT — edit everything in this section
─────────────────────────────────────────── */

const CORRECT_PW = 'bff4eva';

const LETTER = `Dear Imaan,

happy birthday to my favourite person ever.

Now that you're 21 you're lowkey an official adult. I'm so proud of the woman you're becoming and will continue to grow into.
Every day I wind up so grateful to have met the most wonderful person ever. You continuously enrich my life with your endless jokes, wisdom, and willingness to listen. 
I can always count on you to make me feel most like myself. I think your god-given talent on earth is to love. I hope I can show you a fraction of the love you put out into the world. 
Come 10 years time, even if we're in different cities and jobs, I know we gonna have a ki every time we see each other, and I know that this friendship is one that lasts for life.
I'm excited to see what the next few years bring for us. 

Love you always twin. To the best friend I could ever ask for

Love,
Ziyaad <3`;

const REASONS = [
  "you're the funniest person I know",
  "people would kill to be as beautiful as you",
  "I love how much you love the earth",
  "I love how Caleb is ur spirit animal",
  "i love how we can talk about anything",
  "when you lowkey have a friend",
  "TEAM BUENOS 4EVA",
  "you're more nb to me than jane remover",
  "what's the time? yomamaPM",
  "you happy you rude?",
  "i thought you was an alien",
  "is that dua lipa????",
  "WERKSMANS BADDIE",
  "bababoyeeee! 🍌",
  "not 'n vok. julle moet 3m apart wees."
];

// For real photos: replace emoji with an empty string and set
// src to your image path e.g. "assets/photos/us_at_beach.jpg"
const PHOTOS = [
  { src: "assets/photos/butt.JPG", emoji: "🌸", caption: "i'll do anything with you wherever" },
  { src: "assets/photos/dupromo.JPG", emoji: "🌻", caption: "even if it's some DU BS" },
  { src: "assets/photos/duosuprema.JPG", emoji: "🌈", caption: "as long as its us" },
  { src: "assets/photos/imaaaan.JPG", emoji: "📸", caption: "love u forever" },
];

// Add Spotify / YouTube links in the url field
const TRACKS = [
  { title: "forever - Charli XCX", url: "https://open.spotify.com/track/5GsJIVCBFjhCcUwJaTW2sB?si=4b0ff66ea5a143d3" },
  { title: "Livin' Loose - George Clanton", url: "https://open.spotify.com/track/2USTVgd20XRLMAhiYNklN8?si=77ee9a111a804c23" },
  { title: "B2b featuring tinashe - Charli XCX, Tinashe", url: "https://open.spotify.com/track/2xsvVV9DXvYtqXId9Uf2ra?si=ed7d2d14dd034882" },
  { title: "Affection - Crystal Castles", url: "https://open.spotify.com/track/3AFpIlNR4DEJ1WC7qyOHU8?si=b3d6e151fd3d479b" },
  { title: "Take Me Home - Pinkpantheress", url: "https://open.spotify.com/track/26AmP3ukYC4Zs9lSGlh55I?si=a8efaf79543f4a3a" },
];

const WRONG_MESSAGES = [
 "girl its in the damn readme.txt I gave u."
];

/* ───────────────────────────────────────────
   LOGIN
─────────────────────────────────────────── */
let wrongCount = 0;

function tryLogin() {
  const val = document.getElementById('pw-input').value;
  const card = document.querySelector('.login-card');
  const err  = document.getElementById('login-error');

  if (val === CORRECT_PW) {
    const loginScreen = document.getElementById('login-screen');
    loginScreen.style.opacity = '0';
    setTimeout(() => {
      loginScreen.style.display = 'none';
      startBoot();
    }, 7);
  } else {
    err.textContent = WRONG_MESSAGES[wrongCount % WRONG_MESSAGES.length];
    wrongCount++;
    card.classList.remove('shake');
    void card.offsetWidth; // force reflow to restart animation
    card.classList.add('shake');
    document.getElementById('pw-input').value = '';
  }
}

document.getElementById('pw-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
});

/* ───────────────────────────────────────────
   BOOT SEQUENCE
─────────────────────────────────────────── */
function startBoot() {
  const boot = document.getElementById('boot-screen');
  boot.classList.add('active');
  const fill = document.getElementById('progress-fill');
  fill.style.animation = 'fillbar 2.2s ease forwards';

  setTimeout(() => {
    boot.style.opacity = '0';
    setTimeout(() => { boot.style.display = 'none'; }, 800);
    typeText(document.getElementById('letter-body'), LETTER);
  }, 2600);
}

/* ───────────────────────────────────────────
   WINDOW MANAGEMENT
─────────────────────────────────────────── */
let zTop = 10;

function openWin(id, chipId) {
  const win = document.getElementById(id);
  win.style.display = 'flex';
  win.style.zIndex = ++zTop;

  let chip = document.getElementById(chipId);
  if (!chip) {
    chip = document.createElement('div');
    chip.className = 'taskbar-chip';
    chip.id = chipId;
    chip.textContent = id.replace('-win', '');
    chip.onclick = () => {
      win.style.display === 'none' ? openWin(id, chipId) : closeWin(id, chipId);
    };
    document.getElementById('taskbar-apps').appendChild(chip);
  }
}

function closeWin(id, chipId) {
  document.getElementById(id).style.display = 'none';
  const chip = document.getElementById(chipId);
  if (chip) chip.remove();
}

function openCatRun() {
  openWin('catrun-win', 'catrun-chip');
  document.addEventListener('keydown', window._catrunKeyHandler);
}

function closeCatRun() {
  closeWin('catrun-win', 'catrun-chip');
  document.removeEventListener('keydown', window._catrunKeyHandler);
}

function makeDraggable(winEl, barId) {
  const bar = document.getElementById(barId);
  let ox, oy, drag = false;

  bar.addEventListener('mousedown', e => {
    drag = true;
    ox = e.clientX - winEl.offsetLeft;
    oy = e.clientY - winEl.offsetTop;
    winEl.style.zIndex = ++zTop;
  });
  document.addEventListener('mousemove', e => {
    if (drag) {
      winEl.style.left = (e.clientX - ox) + 'px';
      winEl.style.top  = (e.clientY - oy) + 'px';
    }
  });
  document.addEventListener('mouseup', () => drag = false);
}

['letter', 'photos', 'reasons', 'playlist', 'catrun', 'tama'].forEach(n => {
  makeDraggable(document.getElementById(n + '-win'), n + '-bar');
});

/* ───────────────────────────────────────────
   LETTER — typewriter effect
─────────────────────────────────────────── */
function typeText(el, text, i = 0) {
  if (i < text.length) {
    el.innerHTML = text.slice(0, i + 1).replace(/\n/g, '<br>') +
      '<span id="cursor">|</span>';
    setTimeout(() => typeText(el, text, i + 1), 18);
  }
}

/* ───────────────────────────────────────────
   REASONS — slot machine
─────────────────────────────────────────── */
let lastReason = -1;

function spinReason() {
  const btn     = document.getElementById('spin-btn');
  const display = document.getElementById('reason-display');
  btn.disabled  = true;
  let ticks = 0;

  const interval = setInterval(() => {
    display.textContent = REASONS[Math.floor(Math.random() * REASONS.length)];
    ticks++;
    if (ticks > 10) {
      clearInterval(interval);
      let pick;
      do { pick = Math.floor(Math.random() * REASONS.length); }
      while (pick === lastReason);
      lastReason = pick;
      display.textContent = REASONS[pick];
      btn.disabled = false;
    }
  }, 80);
}

/* ───────────────────────────────────────────
   PHOTOS — polaroid wall
─────────────────────────────────────────── */
function buildPolaroids() {
  const grid = document.getElementById('polaroid-grid');
  PHOTOS.forEach(p => {
    const div = document.createElement('div');
    div.className = 'polaroid';
    div.style.transform = `rotate(${(Math.random() - 0.5) * 8}deg)`;

    const imgDiv = document.createElement('div');
    imgDiv.className = 'polaroid-img';

    if (p.src) {
      const img = document.createElement('img');
      img.src = p.src;
      img.alt = p.caption;
      imgDiv.appendChild(img);
    } else {
      imgDiv.textContent = p.emoji;
    }

    const caption = document.createElement('div');
    caption.className = 'polaroid-caption';
    caption.textContent = p.caption;

    div.appendChild(imgDiv);
    div.appendChild(caption);
    grid.appendChild(div);
  });
}

/* ───────────────────────────────────────────
   PLAYLIST — imaanamp
─────────────────────────────────────────── */
function buildPlaylist() {
  const list = document.getElementById('track-list');
  TRACKS.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'track-item';
    li.innerHTML = `<span class="track-num">${String(i + 1).padStart(2, '0')}</span>${t.title}`;
    li.onclick = () => { if (t.url !== '#') window.open(t.url, '_blank'); };
    list.appendChild(li);
  });

  const vis = document.getElementById('visualiser');
  for (let i = 0; i < 20; i++) {
    const bar = document.createElement('div');
    bar.className = 'vis-bar';
    bar.style.height = '4px';
    vis.appendChild(bar);
  }
  setInterval(() => {
    vis.querySelectorAll('.vis-bar').forEach(b => {
      b.style.height   = (4 + Math.random() * 20) + 'px';
      b.style.transition = 'height 0.15s';
    });
  }, 200);
}

/* ───────────────────────────────────────────
   CLOCK
─────────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');
}
updateClock();
setInterval(updateClock, 10000);

/* ───────────────────────────────────────────
   INIT
─────────────────────────────────────────── */
buildPolaroids();
buildPlaylist();