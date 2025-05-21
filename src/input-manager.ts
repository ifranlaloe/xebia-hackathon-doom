// InputManager handles user input
import { InputState } from "./types.ts";

export class InputManager {
  private keys: InputState = {};
  
  constructor(validKeys: string[]) {
    // Initialize all valid keys to false
    validKeys.forEach(key => {
      this.keys[key] = false;
    });
    
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => { 
      if (e.key in this.keys) this.keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => { 
      if (e.key in this.keys) this.keys[e.key] = false;
    });
  }
  
  /**
   * Checks if a key is pressed
   */
  isKeyPressed(key: string): boolean {
    return this.keys[key] || false;
  }
  
  /**
   * Gets the current state of all keys
   */
  getInputState(): InputState {
    return { ...this.keys };
  }
}
