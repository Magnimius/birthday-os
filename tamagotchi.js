/* ───────────────────────────────────────────
   tamagotchi.js  —  Rooibos the Cat
   Drop this file next to main.js
   Sprite:  assets/photos/rooibos.png
─────────────────────────────────────────── */

(function () {

  /* ── STATE ───────────────────────────────── */
  var pet = {
    name    : 'rooibos',
    hunger  : 3,   // 0 = full, 10 = starving
    happiness: 7,  // 0 = miserable, 10 = ecstatic
    energy  : 8,   // 0 = exhausted, 10 = fully rested
    age     : 0,   // in minutes
    alive   : true,
    mood    : 'idle'  // idle | happy | sleepy | hungry | dead
  };

  /* ── TICK INTERVALS ──────────────────────── */
  var HUNGER_TICK    = 18000;  // +1 hunger every 18s
  var HAPPINESS_TICK = 22000;  // -1 happiness every 22s
  var ENERGY_TICK    = 25000;  // -1 energy every 25s
  var AGE_TICK       = 60000;  // +1 age every 60s

  /* ── DOM REFS ────────────────────────────── */
  function el(id) { return document.getElementById(id); }

  /* ── MOOD → SPRITE STATE ─────────────────── */
  function updateMood() {
    if (!pet.alive) { pet.mood = 'dead'; return; }
    if (pet.hunger  >= 8) { pet.mood = 'hungry';  return; }
    if (pet.energy  <= 2) { pet.mood = 'sleepy';  return; }
    if (pet.happiness >= 7 && pet.hunger <= 4) { pet.mood = 'happy'; return; }
    pet.mood = 'idle';
  }

  /* ── RENDER ──────────────────────────────── */
  function render() {
    if (!el('tama-hunger-fill')) return; // window not in DOM yet

    updateMood();

    // stat bars
    el('tama-hunger-fill').style.width    = (pet.hunger    / 10 * 100) + '%';
    el('tama-happiness-fill').style.width = (pet.happiness / 10 * 100) + '%';
    el('tama-energy-fill').style.width    = (pet.energy    / 10 * 100) + '%';

    // bar colours — hunger bar goes red when high
    el('tama-hunger-fill').style.background =
      pet.hunger >= 7 ? '#ff6b6b' : '#f8a5c2';
    el('tama-energy-fill').style.background =
      pet.energy <= 3 ? '#ffd54f' : '#a5d8f8';

    // age
    el('tama-age').textContent = pet.age + ' mins old';

    // sprite animation class
    var sprite = el('tama-sprite');
    if (sprite) {
      sprite.className = 'tama-sprite tama-' + pet.mood;
    }

    // mood message
    var messages = {
      idle   : ['just vibing 😌', 'purring softly...', '*slow blink*', 'content cat 🧡'],
      happy  : ['!!! 🎉', 'SO HAPPY rn', '*zooomies*', 'best day ever!!'],
      hungry : ['...feed me 👀', 'stomach = empty', 'meow. MEOW.', 'food pls 🍚'],
      sleepy : ['zzz... 😴', 'need nap NOW', '*yawns widely*', 'so tired omg'],
      dead   : ['💀 rooibos has left the chat', 'you forgot to feed me smh']
    };
    var pool = messages[pet.mood] || messages.idle;
    var msg  = pool[Math.floor(Date.now() / 4000) % pool.length];
    el('tama-message').textContent = msg;

    // button states
    if (!pet.alive) {
      el('tama-feed-btn').disabled  = true;
      el('tama-play-btn').disabled  = true;
      el('tama-sleep-btn').disabled = true;
    }
  }

  /* ── ACTIONS ─────────────────────────────── */
  window.tamaFeed = function () {
    if (!pet.alive) return;
    pet.hunger    = Math.max(0, pet.hunger - 3);
    pet.happiness = Math.min(10, pet.happiness + 1);
    bounce();
    render();
  };

  window.tamaPlay = function () {
    if (!pet.alive) return;
    pet.happiness = Math.min(10, pet.happiness + 3);
    pet.energy    = Math.max(0, pet.energy - 1);
    pet.hunger    = Math.min(10, pet.hunger + 1);
    bounce();
    render();
  };

  window.tamaSleep = function () {
    if (!pet.alive) return;
    pet.energy    = Math.min(10, pet.energy + 4);
    pet.happiness = Math.max(0, pet.happiness - 1);
    bounce();
    render();
  };

  function bounce() {
    var sprite = el('tama-sprite');
    if (!sprite) return;
    sprite.classList.remove('tama-bounce');
    void sprite.offsetWidth;
    sprite.classList.add('tama-bounce');
    setTimeout(function () {
      sprite.classList.remove('tama-bounce');
    }, 600);
  }

  /* ── DECAY TICKS ─────────────────────────── */
  function startTicks() {
    setInterval(function () {
      if (!pet.alive) return;
      pet.hunger = Math.min(10, pet.hunger + 1);
      if (pet.hunger >= 10 || pet.happiness <= 0 || pet.energy <= 0) {
        pet.alive = false;
      }
      render();
    }, HUNGER_TICK);

    setInterval(function () {
      if (!pet.alive) return;
      pet.happiness = Math.max(0, pet.happiness - 1);
      render();
    }, HAPPINESS_TICK);

    setInterval(function () {
      if (!pet.alive) return;
      pet.energy = Math.max(0, pet.energy - 1);
      render();
    }, ENERGY_TICK);

    setInterval(function () {
      if (!pet.alive) return;
      pet.age++;
      render();
    }, AGE_TICK);

    // re-render message on interval for variety
    setInterval(render, 4000);
  }

  /* ── INJECT HTML INTO WINDOW BODY ───────── */
  function init() {
    var body = el('tama-body');
    if (!body) return;

    body.innerHTML = [
      '<div class="tama-wrap">',

        // sprite
        '<div class="tama-stage">',
          '<img id="tama-sprite" class="tama-sprite tama-idle"',
          '     src="assets/photos/rooibos.png" alt="rooibos" />',
          '<div id="tama-message" class="tama-message">just vibing 😌</div>',
        '</div>',

        // stats
        '<div class="tama-stats">',
          '<div class="tama-stat-row">',
            '<span class="tama-stat-label">🍚 hunger</span>',
            '<div class="tama-bar-bg"><div id="tama-hunger-fill" class="tama-bar-fill"></div></div>',
          '</div>',
          '<div class="tama-stat-row">',
            '<span class="tama-stat-label">💖 happiness</span>',
            '<div class="tama-bar-bg"><div id="tama-happiness-fill" class="tama-bar-fill" style="background:#f8a5c2"></div></div>',
          '</div>',
          '<div class="tama-stat-row">',
            '<span class="tama-stat-label">⚡ energy</span>',
            '<div class="tama-bar-bg"><div id="tama-energy-fill" class="tama-bar-fill" style="background:#a5d8f8"></div></div>',
          '</div>',
        '</div>',

        // age
        '<div id="tama-age" class="tama-age">0 mins old</div>',

        // buttons
        '<div class="tama-btns">',
          '<button id="tama-feed-btn"  class="tama-btn" onclick="tamaFeed()">🍚 feed</button>',
          '<button id="tama-play-btn"  class="tama-btn" onclick="tamaPlay()">🎾 play</button>',
          '<button id="tama-sleep-btn" class="tama-btn" onclick="tamaSleep()">💤 sleep</button>',
        '</div>',

      '</div>'
    ].join('');

    render();
    startTicks();
  }

  // wait for DOM then init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
