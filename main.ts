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
  </style>
</head>
<body>
  <canvas id="game" width="1200" height="800"></canvas>
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

    // --- Player State ---
    let player = {
      x: 1.5, // grid units (center of open space)
      y: 1.5,
      dir: 0, // radians, 0 = right
      speed: 0.2, // match test speed
      rotSpeed: 0.07,
    };

    // --- Input State ---
    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };
    window.addEventListener('keydown', e => { if (e.key in keys) keys[e.key] = true; });
    window.addEventListener('keyup', e => { if (e.key in keys) keys[e.key] = false; });

    // --- Collision Check ---
    function isWall(x, y) {
      const mx = Math.floor(x), my = Math.floor(y);
      return map[my]?.[mx] === 1;
    }

    // --- Game Loop ---
    function update() {
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
      if (!isWall(nx, player.y)) player.x = nx;
      if (!isWall(player.x, ny)) player.y = ny;
      // Debug output
      console.log('Player:', {x: player.x, y: player.y, dir: player.dir.toFixed(2)});
      console.log('Move:', move, 'dx:', dx.toFixed(3), 'dy:', dy.toFixed(3));
      console.log('isWall(nx, player.y):', isWall(nx, player.y), 'isWall(player.x, ny):', isWall(player.x, ny));
    }

    // --- Render ---
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw map
      for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
          ctx.fillStyle = map[y][x] === 1 ? '#800000' : '#ddd'; // dark red for walls, light grey for walkable
          ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
      }
      // Draw player
      ctx.save();
      ctx.translate(player.x * TILE, player.y * TILE);
      ctx.rotate(player.dir);
      ctx.fillStyle = '#0f0';
      ctx.beginPath();
      ctx.arc(0, 0, TILE/4, 0, Math.PI*2);
      ctx.fill();
      // Draw facing direction
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
      requestAnimationFrame(loop);
    }
    loop();
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
