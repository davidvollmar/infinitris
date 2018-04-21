import { World } from '../world'

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private world: World;

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
      endFrame: 0,
      margin: 0,
      spacing: 0
    };
    this.load.spritesheet('man', '../assets/graphics/tetrisman/sprites/spritesheet.png', spritesheetconfig, null);
  }

  create(): void {
    
    this.world = new World(30, 30);

    var man = this.add.sprite(100,400,'man');
    var walk = man.anims.create({
      frames: man.anims.generateFrameNumbers('man', {start: 0, end: 5}),
      frameRate:6,
      repeat: -1
    })
  }

  update(time: number, delta: number): void {
    let ptr = this.input.mouse.manager.activePointer;
    if (ptr.isDown) {
      console.log("Left Button: " + ptr.position.x + ", " + ptr.position.y);
    }
  }
}
