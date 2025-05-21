// Game class is the main controller that ties everything together
import { PlayerState, GameConfig } from "./types.ts";
import { MapManager } from "./map-manager.ts";
import { InputManager } from "./input-manager.ts";
import { PlayerController } from "./player-controller.ts";
import { Renderer } from "./renderer.ts";

export class Game {
  private mapManager: MapManager;
  private inputManager: InputManager;
  private playerController: PlayerController;
  private renderer: Renderer;
  private animationFrameId: number | null = null;
  
  constructor(
    canvas: HTMLCanvasElement,
    mapData: number[][],
    initialPlayerState: PlayerState,
    config: GameConfig
  ) {
    // Initialize all components
    this.mapManager = new MapManager(mapData);
    
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
    this.inputManager = new InputManager(validKeys);
    
    this.playerController = new PlayerController(
      initialPlayerState,
      this.mapManager,
      this.inputManager
    );
    
    this.renderer = new Renderer(canvas, config);
  }
  
  /**
   * Starts the game loop
   */
  start(): void {
    if (this.animationFrameId !== null) {
      return; // Game is already running
    }
    
    const loop = () => {
      this.update();
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    
    loop();
  }
  
  /**
   * Stops the game loop
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Updates game state
   */
  private update(): void {
    this.playerController.update();
  }
  
  /**
   * Renders current game state
   */
  private render(): void {
    this.renderer.render(
      this.mapManager.getMapData(),
      this.playerController.getPlayerState()
    );
  }
}
