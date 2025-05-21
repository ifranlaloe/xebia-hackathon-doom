// Renderer handles drawing the game state
import { MapData, PlayerState, GameConfig } from "./types.ts";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  
  constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context from canvas');
    }
    
    this.ctx = context;
    this.config = config;
  }
  
  /**
   * Renders the current game state
   */
  render(mapData: MapData, player: PlayerState): void {
    const { ctx, config } = this;
    const { tileSize } = config;
    
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    this.drawMap(mapData, tileSize);
    this.drawPlayer(player, tileSize);
  }
  
  /**
   * Draws the map
   */
  private drawMap(mapData: MapData, tileSize: number): void {
    const mapHeight = mapData.length;
    const mapWidth = mapData[0].length;
    
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        this.ctx.fillStyle = mapData[y][x] === 1 ? '#444' : '#222';
        this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
  
  /**
   * Draws the player
   */
  private drawPlayer(player: PlayerState, tileSize: number): void {
    const { ctx } = this;
    
    ctx.save();
    ctx.translate(player.x * tileSize, player.y * tileSize);
    ctx.rotate(player.dir);
    
    // Draw player body
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(0, 0, tileSize/4, 0, Math.PI*2);
    ctx.fill();
    
    // Draw facing direction
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tileSize/2, 0);
    ctx.stroke();
    
    ctx.restore();
  }
}
