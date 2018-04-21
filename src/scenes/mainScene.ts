import { World } from '../world'
import { GameObjects } from 'phaser';

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private world: World;
  private man: GameObjects.Sprite;

  private x: int = 0;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    //this.load.image("logo", "../assets/fff.png");
    var spritesheetconfig = {
      frameWidth: 512,
      frameHeight: 512,
      startFrame: 0,
      endFrame: 5,
      margin: 0,
      spacing: 0
    };
    this.load.spritesheet('man', '../assets/graphics/tetrisman/sprites/spritesheet.png', spritesheetconfig);

    this.load.image('green-block-dark', '../assets/graphics/blocks-dark/block-green.png');
    this.load.image('green-block-light', '../assets/graphics/blocks-light/block-green.png');
  }



  create(): void {

    this.world = new World(30, 30);

    this.man = this.add.sprite(100, 400, 'man');
    var walk = this.anims.create(
      {
        key: 'manimation',
        frames: this.anims.generateFrameNames('man', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: Phaser.FOREVER
      }
    );

    this.man.anims.play('manimation')

    for (var i = 0; i < 6; i += 2) {
      this.add.sprite(i * 256, 780, 'green-block-dark');
      this.add.sprite((i + 1) * 256, 780, 'green-block-light');
    }
  }



  update(time: number, delta: number): void {
    let ptr = this.input.mouse.manager.activePointer;
    if (ptr.isDown) {
      console.log("Left Button: " + ptr.position.x + ", " + ptr.position.y);

    }
  }
}
