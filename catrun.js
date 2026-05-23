/* ───────────────────────────────────────────
   catrun.js  —  Calico Cat Runner
   Drop this file next to main.js
─────────────────────────────────────────── */

(function () {

  /* ── SPRITE SHEET CONFIG ─────────────────
     cat_run_strip.png is a 636×164px image
     containing 4 frames side-by-side (row 1
     from calico_model.jpg).
     Place it at:  assets/photos/cat_run_strip.png
  ─────────────────────────────────────────── */
  var SPRITE_SRC    = 'assets/photos/cat_run_strip.png';
  var FRAME_COUNT   = 4;
  var FRAME_W       = 159;   // px per frame in strip
  var FRAME_H       = 164;
  var CAT_RENDER_W  = 55;    // rendered size in canvas
  var CAT_RENDER_H  = 60;
  var FRAME_RATE    = 6;     // update sprite every N game frames

  /* ── CANVAS SETUP ────────────────────────── */
  var canvas  = document.getElementById('catrun-canvas');
  var ctx     = canvas.getContext('2d');
  var W       = canvas.width;
  var H       = canvas.height;

  /* ── SPRITE IMAGE ────────────────────────── */
  var spriteImg = new Image();
  spriteImg.src = SPRITE_SRC;

  /* ── HELPERS ─────────────────────────────── */
  function top(o)    { return o.y; }
  function bottom(o) { return o.y + o.height; }
  function left(o)   { return o.x; }
  function right(o)  { return o.x + o.width; }

  /* ── GROUND ──────────────────────────────── */
  var GROUND_Y = H - Math.floor(0.22 * H);

  /* ── CAT (player) ────────────────────────── */
  function Cat(x) {
    this.width        = CAT_RENDER_W;
    this.height       = CAT_RENDER_H;
    this.x            = x;
    this.y            = GROUND_Y - this.height;
    this.vy           = 0;
    this.jumpVelocity = -18;
    this.frame        = 0;
    this.frameTick    = 0;
    this.onGround     = true;
  }

  Cat.prototype.jump = function () {
    if (!this.onGround) return;
    this.vy       = this.jumpVelocity;
    this.onGround = false;
  };

  Cat.prototype.update = function (gravity) {
    this.y  += this.vy;
    this.vy += gravity;

    if (this.y >= GROUND_Y - this.height) {
      this.y        = GROUND_Y - this.height;
      this.vy       = 0;
      this.onGround = true;
    }

    // animate only while running on ground
    if (this.onGround) {
      this.frameTick++;
      if (this.frameTick >= FRAME_RATE) {
        this.frameTick = 0;
        this.frame = (this.frame + 1) % FRAME_COUNT;
      }
    } else {
      this.frame = 1; // mid-leap frame
    }
  };

  Cat.prototype.draw = function () {
    if (spriteImg.complete && spriteImg.naturalWidth) {
      ctx.drawImage(
        spriteImg,
        this.frame * FRAME_W, 0,   // source x, y in strip
        FRAME_W, FRAME_H,           // source w, h
        this.x, this.y,             // dest x, y
        this.width, this.height     // dest w, h
      );
    } else {
      // fallback while image loads
      ctx.fillStyle = '#e91e8c';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  /* ── CACTUS ──────────────────────────────── */
  function Cactus(runSpeed) {
    this.width  = 16;
    this.height = Math.random() > 0.5 ? 30 : 58;
    this.x      = W;
    this.y      = GROUND_Y - this.height;
    this.speed  = runSpeed;
    this.emoji  = '🌵';
  }

  Cactus.prototype.update = function () {
    this.x += this.speed;
  };

  Cactus.prototype.draw = function () {
    ctx.fillStyle = '#5a9e5a';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // little decorative emoji on top
    ctx.font = '14px serif';
    ctx.fillText(this.emoji, this.x - 3, this.y - 2);
  };

  /* ── CLOUD DECORATIONS ───────────────────── */
  var clouds = [];
  for (var c = 0; c < 4; c++) {
    clouds.push({
      x: Math.random() * W,
      y: 20 + Math.random() * (GROUND_Y * 0.4),
      speed: 0.4 + Math.random() * 0.5,
      size: 28 + Math.random() * 22
    });
  }

  function updateClouds() {
    clouds.forEach(function (cl) {
      cl.x -= cl.speed;
      if (cl.x + cl.size * 2 < 0) cl.x = W + cl.size;
    });
  }

  function drawClouds() {
    ctx.font = '28px serif';
    clouds.forEach(function (cl) {
      ctx.globalAlpha = 0.55;
      ctx.font = cl.size + 'px serif';
      ctx.fillText('☁️', cl.x, cl.y);
    });
    ctx.globalAlpha = 1;
  }

  /* ── GROUND STRIP ────────────────────────── */
  function drawGround() {
    // soft pink ground line
    ctx.fillStyle = '#f8a5c2';
    ctx.fillRect(0, GROUND_Y, W, 3);
    // tiny flower deco
    ctx.globalAlpha = 1;
  }

  /* ── GAME STATE ──────────────────────────── */
  var state = {
    cat        : new Cat(Math.floor(0.1 * W)),
    cacti      : [],
    gravity    : 1.5,
    runSpeed   : -7,
    frames     : 0,
    score      : 0,
    dead       : false,
    started    : false,
    jumpPressed: false,
    jumpDistance: 0
  };

  state.jumpDistance = Math.abs(
    state.runSpeed * (2 * state.cat.jumpVelocity) / state.gravity
  );

  /* ── INPUT ───────────────────────────────── */
  function handleJump() {
    if (state.dead) { resetGame(); return; }
    if (!state.started) state.started = true;
    state.cat.jump();
  }

  // keyboard — only active when canvas window is open
  function onKey(e) {
    if (e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleJump();
    }
  }

  // touch / click on the canvas
  canvas.addEventListener('click',     handleJump);
  canvas.addEventListener('touchstart', function(e){ e.preventDefault(); handleJump(); });

  // we attach/detach keydown based on window visibility
  window._catrunKeyHandler = onKey;

  /* ── RESET ───────────────────────────────── */
  function resetGame() {
    state.cat         = new Cat(Math.floor(0.1 * W));
    state.cacti       = [];
    state.frames      = 0;
    state.score       = 0;
    state.dead        = false;
    state.started     = false;
    state.runSpeed    = -7;
    state.jumpDistance = Math.abs(
      state.runSpeed * (2 * state.cat.jumpVelocity) / state.gravity
    );
  }

  /* ── CACTUS SPAWNING ─────────────────────── */
  function spawnCactus(prob) {
    if (Math.random() <= prob) {
      state.cacti.push(new Cactus(state.runSpeed));
    }
  }

  /* ── UPDATE ──────────────────────────────── */
  function update() {
    if (!state.started || state.dead) return;

    state.frames++;
    state.score = Math.floor(state.frames / 10);

    // speed up gradually
    if (state.frames % 300 === 0) {
      state.runSpeed = Math.max(state.runSpeed - 1, -18);
      state.jumpDistance = Math.abs(
        state.runSpeed * (2 * state.cat.jumpVelocity) / state.gravity
      );
    }

    state.cat.update(state.gravity);
    updateClouds();

    // remove off-screen cacti
    if (state.cacti.length > 0 && right(state.cacti[0]) < 0) {
      state.cacti.shift();
    }

    // spawn
    if (state.cacti.length === 0) {
      spawnCactus(0.4);
    } else {
      var last = state.cacti[state.cacti.length - 1];
      if (W - left(last) > state.jumpDistance + 150) {
        spawnCactus(0.04);
      }
    }

    // move cacti
    state.cacti.forEach(function (c) { c.update(); });

    // collision
    var cat = state.cat;
    var pad = 8; // forgiveness pixels
    for (var i = 0; i < state.cacti.length; i++) {
      var c = state.cacti[i];
      if (
        right(cat)  - pad >= left(c)  + pad &&
        left(cat)   + pad <= right(c) - pad &&
        bottom(cat) - pad >= top(c)
      ) {
        state.dead = true;
        break;
      }
    }
  }

  /* ── DRAW ────────────────────────────────── */
  function draw() {
    // pastel gradient background matching OS palette
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   '#fff6f9');
    grad.addColorStop(0.6, '#fff3c2');
    grad.addColorStop(1,   '#ffe0ec');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    drawClouds();
    drawGround();

    state.cacti.forEach(function (c) { c.draw(); });
    state.cat.draw();

    // score
    ctx.fillStyle   = '#c2185b';
    ctx.font        = 'bold 13px "Nunito", sans-serif';
    ctx.textAlign   = 'right';
    ctx.fillText('score: ' + state.score, W - 12, 22);
    ctx.textAlign   = 'left';

    // start prompt
    if (!state.started && !state.dead) {
      ctx.fillStyle = '#e91e8c';
      ctx.font      = 'bold 14px "Nunito", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('click or press space to start 🐱', W / 2, H / 2 - 10);
      ctx.textAlign = 'left';
    }

    // game over
    if (state.dead) {
      ctx.fillStyle    = 'rgba(255,240,248,0.82)';
      ctx.fillRect(W/2 - 110, H/2 - 36, 220, 68);
      ctx.strokeStyle  = '#f8a5c2';
      ctx.lineWidth    = 2;
      ctx.strokeRect(W/2 - 110, H/2 - 36, 220, 68);

      ctx.fillStyle  = '#c2185b';
      ctx.font       = 'bold 16px "Nunito", sans-serif';
      ctx.textAlign  = 'center';
      ctx.fillText('oh no! 🐾 score: ' + state.score, W / 2, H / 2 - 10);
      ctx.font       = '12px "Nunito", sans-serif';
      ctx.fillText('click or space to try again', W / 2, H / 2 + 16);
      ctx.textAlign  = 'left';
    }
  }

  /* ── LOOP ────────────────────────────────── */
  function loop() {
    update();
    draw();
    window._catrunRAF = requestAnimationFrame(loop);
  }

  // kick off
  loop();

})();
