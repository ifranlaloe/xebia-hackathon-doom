// MapManager is responsible for map data and collision detection
import { MapData } from "./types.ts";

export class MapManager {
  private map: MapData;
  
  constructor(mapData: MapData) {
    this.map = mapData;
  }

  get width(): number {
    return this.map[0].length;
  }
  
  get height(): number {
    return this.map.length;
  }
  
  /**
   * Checks if a position contains a wall
   */
  isWall(x: number, y: number): boolean {
    const mx = Math.floor(x);
    const my = Math.floor(y);
    return this.map[my]?.[mx] === 1;
  }
  
  /**
   * Gets the map data
   */
  getMapData(): MapData {
    return this.map;
  }
}
