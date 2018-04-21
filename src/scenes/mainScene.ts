import { World } from '../world'
import { GameObjects } from 'phaser';

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private world: World;
  private man: GameObjects.Sprite;
  private bgtile: GameObjects.TileSprite;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    let spritesheetconfig = {
      frameWidth: 512,
      frameHeight: 512,
      startFrame: 0,
      endFrame: 5,
      margin: 0,
      spacing: 0
    };
    this.load.spritesheet('man', '../assets/graphics/tetrisman/sprites/spritesheet.png', spritesheetconfig);

    this.load.image('green-block-dark', '../assets/graphics/blocks-dark/block-green.png');

    this.load.image('background', '../assets/graphics/Background/Background.png');
    this.load.image('sun', '../assets/graphics/Background/Sun.png');
    this.load.image('cloud1', '../assets/graphics/Background/Cloud1.png');
    this.load.image('cloud1', '../assets/graphics/Background/Cloud2.png');
  }

  create(): void {
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    this.man = this.add.sprite(100, 672, 'man');
    this.man.setScale(0.25, 0.25);
    let walk = this.anims.create({
      key: 'manimation',
      frames: this.anims.generateFrameNames('man', { start: 0, end: 5 }),
      frameRate: 6,
      repeat: Phaser.FOREVER
    }
    );

    this.man.anims.play('manimation')

    this.bgtile = this.add.tileSprite(0, 736, 3200, 256, 'green-block-dark');
    this.bgtile.setOrigin(0, 0);
    this.bgtile.setScale(0.25);

    let cam = this.cameras.main;
    cam.setViewport(0, 0, 800, 800);
  }

  update(time: number, delta: number): void {

    this.bgtile.tilePositionX += 2;

    let ptr = this.input.mouse.manager.activePointer;
    if (ptr.isDown) {
      console.log("Left Button: " + ptr.position.x + ", " + ptr.position.y);

    }

  }
}
