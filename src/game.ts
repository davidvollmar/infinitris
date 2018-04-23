/// <reference path="phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";
import { MenuScene } from "./scenes/menuscene";
import { DeadScene } from "./scenes/deadScene";

// main game configuration
const config: GameConfig = {
  width: 1024,
  height: 1024,
  type: Phaser.AUTO,
  parent: "game",
  scene: [MenuScene, MainScene, DeadScene],
  input: {
    mouse: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(GameConfig: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
