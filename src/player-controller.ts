// PlayerController handles player movement and physics
import { PlayerState } from "./types.ts";
import { MapManager } from "./map-manager.ts";
import { InputManager } from "./input-manager.ts";

export class PlayerController {
  private player: PlayerState;
  private mapManager: MapManager;
  private inputManager: InputManager;
  
  constructor(initialState: PlayerState, mapManager: MapManager, inputManager: InputManager) {
    this.player = initialState;
    this.mapManager = mapManager;
    this.inputManager = inputManager;
  }
  
  /**
   * Updates player position and rotation based on input
   */
  update(): void {
    this.handleRotation();
    this.handleMovement();
  }
  
  /**
   * Handles player rotation based on input
   */
  private handleRotation(): void {
    if (this.inputManager.isKeyPressed('ArrowLeft') || this.inputManager.isKeyPressed('a')) {
      this.player.dir -= this.player.rotSpeed;
    }
    
    if (this.inputManager.isKeyPressed('ArrowRight') || this.inputManager.isKeyPressed('d')) {
      this.player.dir += this.player.rotSpeed;
    }
  }
  
  /**
   * Handles player movement based on input
   */
  private handleMovement(): void {
    let move = 0;
    
    if (this.inputManager.isKeyPressed('ArrowUp') || this.inputManager.isKeyPressed('w')) {
      move = 1;
    }
    
    if (this.inputManager.isKeyPressed('ArrowDown') || this.inputManager.isKeyPressed('s')) {
      move = -1;
    }
    
    const dx = Math.cos(this.player.dir) * this.player.speed * move;
    const dy = Math.sin(this.player.dir) * this.player.speed * move;
    
    this.applyMovementWithCollision(dx, dy);
  }
  
  /**
   * Applies movement with collision detection
   */
  private applyMovementWithCollision(dx: number, dy: number): void {
    const newX = this.player.x + dx;
    const newY = this.player.y + dy;
    
    if (!this.mapManager.isWall(newX, this.player.y)) {
      this.player.x = newX;
    }
    
    if (!this.mapManager.isWall(this.player.x, newY)) {
      this.player.y = newY;
    }
  }
  
  /**
   * Gets the current player state
   */
  getPlayerState(): PlayerState {
    return { ...this.player };
  }
}
