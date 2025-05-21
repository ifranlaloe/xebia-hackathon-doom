// Unit tests for Doom Minimal game logic
// Uses Deno's built-in test runner

// --- Collision Check ---
function isWall(map: number[][], x: number, y: number): boolean {
  const mx = Math.floor(x), my = Math.floor(y);
  return map[my]?.[mx] === 1;
}

Deno.test('isWall detects walls and empty spaces', () => {
  const map = [
    [1,1,1],
    [1,0,1],
    [1,1,1],
  ];
  // Inside wall
  if (!isWall(map, 0, 0)) throw new Error('Should be wall');
  if (!isWall(map, 2, 2)) throw new Error('Should be wall');
  // Inside empty
  if (isWall(map, 1, 1)) throw new Error('Should be empty');
  // Out of bounds
  if (isWall(map, -1, 1)) throw new Error('Should be out of bounds (not wall)');
  if (isWall(map, 1, 3)) throw new Error('Should be out of bounds (not wall)');
});

Deno.test('Player movement blocked by wall', () => {
  const map = [
    [1,1,1],
    [1,0,1],
    [1,1,1],
  ];
  let player = { x: 1, y: 1 };
  // Try to move into wall
  let nx = player.x + 1, ny = player.y;
  if (!isWall(map, nx, player.y)) player.x = nx;
  if (player.x !== 1) throw new Error('Player should not move into wall');
});

Deno.test('Player movement allowed in open space', () => {
  const map = [
    [1,1,1],
    [1,0,1],
    [1,1,1],
  ];
  let player = { x: 1, y: 1 };
  // Move right (should be blocked)
  let nx = player.x + 1, ny = player.y;
  if (!isWall(map, nx, player.y)) player.x = nx;
  if (player.x !== 1) throw new Error('Player should not move into wall');
  // Move left (should be blocked)
  nx = player.x - 1;
  if (!isWall(map, nx, player.y)) player.x = nx;
  if (player.x !== 1) throw new Error('Player should not move into wall');
  // Move up (should be blocked)
  let ny2 = player.y - 1;
  if (!isWall(map, player.x, ny2)) player.y = ny2;
  if (player.y !== 1) throw new Error('Player should not move into wall');
  // Move down (should be blocked)
  ny2 = player.y + 1;
  if (!isWall(map, player.x, ny2)) player.y = ny2;
  if (player.y !== 1) throw new Error('Player should not move into wall');
});

Deno.test('Player moves forward and backward in open space', () => {
  const map = [
    [1,1,1],
    [1,0,1],
    [1,1,1],
  ];
  let player = { x: 1.5, y: 1.5, dir: 0, speed: 0.2 };
  // Move forward (right, dir=0)
  let dx = Math.cos(player.dir) * player.speed;
  let dy = Math.sin(player.dir) * player.speed;
  let nx = player.x + dx, ny = player.y + dy;
  if (!isWall(map, nx, player.y)) player.x = nx;
  if (!isWall(map, player.x, ny)) player.y = ny;
  if (player.x <= 1.5 + 1e-6) throw new Error('Player should move forward (increase x)');
  // Move backward (left, dir=π)
  player.dir = Math.PI;
  dx = Math.cos(player.dir) * player.speed;
  dy = Math.sin(player.dir) * player.speed;
  nx = player.x + dx; ny = player.y + dy;
  if (!isWall(map, nx, player.y)) player.x = nx;
  if (!isWall(map, player.x, ny)) player.y = ny;
  if (player.x >= 1.5 - 1e-6) throw new Error('Player should move backward (decrease x)');
});
