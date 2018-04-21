import { World } from '../world'
import { GameObjects } from 'phaser';

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private world: World;
  private man: GameObjects.Sprite;

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
    this.load.spritesheet('man', '../assets/graphics/tetrisman/sprites/spritesheet.png', spritesheetconfig, null);

    this.load.image('background', '../assets/graphics/Background/Background.png');
    this.load.image('sun', '../assets/graphics/Background/Sun.png');
    this.load.image('cloud1', '../assets/graphics/Background/Cloud1.png');
    this.load.image('cloud1', '../assets/graphics/Background/Cloud2.png');
  }



  create(): void {
    
    this.world = new World(30, 30);

    this.add.image(400,400,'background');

    this.man = this.add.sprite(100,700,'man');
    this.man.setScale(0.2, 0.2);
    var walk = this.anims.create({
      key: 'manimation',
      frames: this.anims.generateFrameNames('man', {start: 0, end: 5}),
      frameRate: 6,
      repeat: Phaser.FOREVER}
    );
  
    this.man.anims.play('manimation')

  }

  

  update(time: number, delta: number): void {
    let ptr = this.input.mouse.manager.activePointer;
    if (ptr.isDown) {
      console.log("Left Button: " + ptr.position.x + ", " + ptr.position.y);
      this.man.anims.play('manimation')
      console.log(this.man.anims.isPlaying)
    }
  }
}
