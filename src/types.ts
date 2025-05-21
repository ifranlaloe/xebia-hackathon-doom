// Types for the game
export type MapData = number[][];

export interface PlayerState {
  x: number;
  y: number;
  dir: number;
  speed: number;
  rotSpeed: number;
}

export interface InputState {
  [key: string]: boolean;
}

export interface GameConfig {
  tileSize: number;
}
