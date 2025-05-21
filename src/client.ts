// Client-side entry point
import { Game } from "./game.ts";
import { PlayerState, GameConfig } from "./types.ts";

// Map Data (1 = wall, 0 = empty)
const mapData = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

// Initial player state
const initialPlayerState: PlayerState = {
  x: 2.5, // grid units
  y: 2.5,
  dir: 0, // radians, 0 = right
  speed: 0.08,
  rotSpeed: 0.07,
};

// Game configuration
const gameConfig: GameConfig = {
  tileSize: 40,
};

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  const game = new Game(canvas, mapData, initialPlayerState, gameConfig);
  game.start();
});
