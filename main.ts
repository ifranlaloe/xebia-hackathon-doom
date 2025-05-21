// Doom Recreation: Minimal Player Movement and Level Rendering
// Uses Deno, browser-based, ES modules

// --- Simple HTML/JS entry point ---
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Deno Doom Minimal</title>
  <style>
    body { background: #222; color: #fff; margin: 0; overflow: hidden; }
    canvas { display: block; margin: 0 auto; background: #111; }
    /* Start Menu Overlay Styles */
    #start-menu {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(20,20,20,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    #start-menu h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      color: #fff;
      letter-spacing: 0.1em;
    }
    #start-menu button {
      font-size: 1.5rem;
      padding: 0.75em 2em;
      border: none;
      border-radius: 8px;
      background: #800000;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s;
    }
    #start-menu button:hover {
      background: #a00;
    }
    /* Game Over Overlay Styles */
    #gameover-menu {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(20,20,40,0.97);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 20;
    }
    #gameover-menu h1 {
      color: #39f;
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    #gameover-menu button {
      font-size: 1.5rem;
      padding: 0.75em 2em;
      border: none;
      border-radius: 8px;
      background: #800000;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s;
    }
    #gameover-menu button:hover {
      background: #a00;
    }
  </style>
</head>
<body>
  <div id="start-menu">
    <h1>Deno Doom Minimal</h1>
    <button id="start-btn">Start Game</button>
  </div>
  <div id="gameover-menu" style="display:none;">
    <h1 style="color:#39f; font-size:3rem; margin-bottom:1.5rem;">Game Over</h1>
    <button id="retry-btn" style="font-size:1.5rem; padding:0.75em 2em; border:none; border-radius:8px; background:#800000; color:#fff; cursor:pointer;">Try Again</button>
  </div>
  <canvas id="game" width="1200" height="800" style="display:none;"></canvas>
  <script type="module">
    // --- Map Data (1 = wall, 0 = empty) ---
    // Generate a 1024x1024 map with walls around the border and random internal walls
    const MAP_W = 1024;
    const MAP_H = 1024;
    const map = Array.from({ length: MAP_H }, (_, y) =>
      Array.from({ length: MAP_W }, (_, x) =>
        (x === 0 || y === 0 || x === MAP_W - 1 || y === MAP_H - 1)
          ? 1 // border walls
          : (Math.random() < 0.08 ? 1 : 0) // sparse random internal walls
      )
    );
    const TILE = 40;

    // --- Enemy State ---
    let enemies = [];
    function randomEmptyPosition() {
      let x, y;
      do {
        x = Math.floor(Math.random() * (MAP_W - 2)) + 1;
        y = Math.floor(Math.random() * (MAP_H - 2)) + 1;
      } while (map[y][x] !== 0 || (Math.abs(x-1.5)<2 && Math.abs(y-1.5)<2));
      return { x: x + 0.5, y: y + 0.5 };
    }
    function spawnEnemies() {
      const count = Math.floor(Math.random() * 11) + 5; // 5-15 enemies
      enemies = [];
      for (let i = 0; i < count; i++) {
        enemies.push(randomEmptyPosition());
      }
    }

    // --- Player State ---
    let player;
    function resetPlayer() {
      player = {
        x: 1.5, // grid units (center of open space)
        y: 1.5,
        dir: 0, // radians, 0 = right
        speed: 0.2, // match test speed
        rotSpeed: 0.07,
      };
    }

    // --- Input State ---
    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };
    window.addEventListener('keydown', e => { if (e.key in keys) keys[e.key] = true; });
    window.addEventListener('keyup', e => { if (e.key in keys) keys[e.key] = false; });

    // --- Collision Check ---
    function isWall(x, y) {
      const mx = Math.floor(x), my = Math.floor(y);
      return map[my]?.[mx] === 1;
    }

    // --- Game State ---
    let gameOver = false;

    // --- Game Loop ---
    function update() {
      if (gameOver) return;
      // Rotation
      let move = 0;
      if (keys.ArrowLeft || keys.a) player.dir -= player.rotSpeed;
      if (keys.ArrowRight || keys.d) player.dir += player.rotSpeed;
      if (keys.ArrowUp || keys.w) move = 1;
      if (keys.ArrowDown || keys.s) move = -1;
      // Movement
      let dx = Math.cos(player.dir) * player.speed * move;
      let dy = Math.sin(player.dir) * player.speed * move;
      const nx = player.x + dx, ny = player.y + dy;
      // Collision
      let hitWall = false;
      if (!isWall(nx, player.y)) {
        player.x = nx;
      } else if (move !== 0) {
        hitWall = true;
      }
      if (!isWall(player.x, ny)) {
        player.y = ny;
      } else if (move !== 0) {
        hitWall = true;
      }
      // Game over if player touches a wall
      if (hitWall) {
        triggerGameOver();
        return;
      }
      // Enemy collision
      for (const enemy of enemies) {
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist < 0.4) {
          triggerGameOver();
          break;
        }
      }
    }

    // --- Render ---
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw map (only visible portion for performance)
      const viewTilesX = Math.ceil(canvas.width / TILE);
      const viewTilesY = Math.ceil(canvas.height / TILE);
      const offsetX = Math.max(0, Math.floor(player.x - viewTilesX / 2));
      const offsetY = Math.max(0, Math.floor(player.y - viewTilesY / 2));
      for (let y = offsetY; y < Math.min(MAP_H, offsetY + viewTilesY); y++) {
        for (let x = offsetX; x < Math.min(MAP_W, offsetX + viewTilesX); x++) {
          ctx.fillStyle = map[y][x] === 1 ? '#800000' : '#ddd';
          ctx.fillRect((x - offsetX) * TILE, (y - offsetY) * TILE, TILE, TILE);
        }
      }
      // Draw enemies (only those in view)
      ctx.save();
      ctx.fillStyle = '#39f';
      for (const enemy of enemies) {
        const ex = (enemy.x - offsetX) * TILE;
        const ey = (enemy.y - offsetY) * TILE;
        if (ex >= 0 && ex < canvas.width && ey >= 0 && ey < canvas.height) {
          ctx.beginPath();
          ctx.arc(ex, ey, TILE/4, 0, Math.PI*2);
          ctx.fill();
        }
      }
      ctx.restore();
      // Draw player (centered)
      ctx.save();
      ctx.translate((player.x - offsetX) * TILE, (player.y - offsetY) * TILE);
      ctx.rotate(player.dir);
      ctx.fillStyle = '#0f0';
      ctx.beginPath();
      ctx.arc(0, 0, TILE/4, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#0f0';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(TILE/2, 0);
      ctx.stroke();
      ctx.restore();
      // Draw player coordinates (debug info)
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.font = '16px monospace';
      ctx.fillText(\`x: \${player.x.toFixed(2)}, y: \${player.y.toFixed(2)}\`, 10, canvas.height - 20);
      ctx.restore();
    }

    function loop() {
      update();
      render();
      if (!gameOver) requestAnimationFrame(loop);
    }

    // --- Game Over Logic ---
    const startMenu = document.getElementById('start-menu');
    const gameoverMenu = document.getElementById('gameover-menu');
    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    function triggerGameOver() {
      gameOver = true;
      canvas.style.display = 'none';
      gameoverMenu.style.display = 'flex';
    }
    function startGame() {
      resetPlayer();
      spawnEnemies();
      gameOver = false;
      gameoverMenu.style.display = 'none';
      startMenu.style.display = 'none';
      canvas.style.display = 'block';
      loop();
    }
    startBtn.addEventListener('click', startGame);
    retryBtn.addEventListener('click', () => {
      startMenu.style.display = 'flex';
      gameoverMenu.style.display = 'none';
      canvas.style.display = 'none';
    });
  </script>
</body>
</html>
`;

// --- Serve HTML for browser ---
// Deno idiom: use import.meta.url to check main
if (import.meta.url === (globalThis.Deno?.mainModule ?? '')) {
  const port = 8080;
  const handler = (_req) => new Response(html, { headers: { 'content-type': 'text/html' } });
  // @ts-ignore: Deno namespace is available when running with Deno
  (globalThis.Deno ?? Deno).serve({ port: port }, handler);
  console.log('Deno Doom Minimal running at http://localhost:' + port + '/');
}
