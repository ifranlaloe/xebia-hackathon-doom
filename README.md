# Deno Hello World

This is a minimal Deno project that prints 'Hello, World!' to the console.

## Run

To start the game server, run:

```
deno run --allow-net main.ts
```

Then open your browser and go to:

```
http://localhost:8080/
```

## Controls

- **Move Forward:** W or ↑ (Up Arrow)
- **Move Backward:** S or ↓ (Down Arrow)
- **Turn Left:** A or ← (Left Arrow)
- **Turn Right:** D or → (Right Arrow)

## Doom Recreation: Core Features for Hackathon

For a short hackathon, focus on these essential features:

### 1. Player Movement

- Implement basic first-person controls (WASD or arrow keys).
- Allow the player to turn left/right and move forward/backward.
- Prevent the player from moving through walls (collision detection).

### 2. Simple Level Rendering

- Create a grid-based map representing walls and open spaces.
- Render the map in the browser using 2D or simple 2.5D graphics.
- Visually distinguish walls from open areas.
- Update the rendered view as the player moves or turns.

Expand only if time permits!
