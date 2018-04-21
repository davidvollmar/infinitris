import { World } from '../world'
import { GameObjects } from 'phaser';
import { PuzzleScene } from './puzzleScene';

export class MainScene extends Phaser.Scene {
  //graphics
  private phaserSprite: Phaser.GameObjects.Sprite;
  private man: GameObjects.Sprite;
  private cloud: GameObjects.Sprite;
  private cloud2: GameObjects.Sprite;
  private bgtile: GameObjects.TileSprite;
  private background: GameObjects.Sprite;

  //magic numbers
  private manX = 64;

  //gameplay
  private movementspeed = 1;

  //input handling  
  private downKey: Phaser.Input.Keyboard.Key;  
  private leftKey: Phaser.Input.Keyboard.Key;  
  private rightKey: Phaser.Input.Keyboard.Key;

  //things belonging to obstacle:  
  private piece: GameObjects.Sprite;
  private validSolutions = [];

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

    this.load.image('floor', '../assets/graphics/Background/floor.png');

    this.load.image('background', '../assets/graphics/Background/Background.png');
    this.load.image('sun', '../assets/graphics/Background/Sun.png');
    this.load.image('cloud1', '../assets/graphics/Background/Cloud1.png');
    this.load.image('cloud2', '../assets/graphics/Background/Cloud2.png');
    this.load.image('piece', '../assets/graphics/piece.png');
  }

  create(): void {
    
    this.background = this.add.sprite(0, 0, 'background');
    this.background.setOrigin(0, 0);

    this.cloud = this.add.sprite(100, 100, 'cloud1');
    this.cloud.setScale(0.5, 0.5);

    this.man = this.add.sprite(this.manX, 1024-(4*64)-64, 'man');
    this.man.setScale(0.25, 0.25);
    let walk = this.anims.create({
      key: 'manimation',
      frames: this.anims.generateFrameNames('man', { start: 0, end: 5 }),
      frameRate: 6,
      repeat: Phaser.FOREVER
    }
    );

    this.man.anims.play('manimation')

    this.bgtile = this.add.tileSprite(0, 1024-(4*64), 6400, 1024, 'floor');
    this.bgtile.setOrigin(0, 0);
    this.bgtile.setScale(0.25);

    let cam = this.cameras.main;
    cam.setViewport(0, 0, 1024, 1024);

    //now create the hole
    this.generateObstacle();

    //define keyboard input
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  generateObstacle(): void {    
    //let obstacle: Obstacle = new Obstacle(600 + Math.random()*400, 200, 'piece');
    this.piece = this.add.sprite(512, 256, 'piece');
    this.piece.setScale(0.25,0.25);
    this.piece.setOrigin(0,0);//TODO get proper origin for each piece for rotation, or make proper code
  
    this.validSolutions = [1,2];
  }

  update(time: number, delta: number): void {

    this.bgtile.tilePositionX += 2;
    this.cloud.x -= this.movementspeed;
    if (this.cloud.x < -256) {
      this.cloud.x = 1024 + Math.random() * 1000;
      this.cloud.y = 128 + Math.random() * 200;
    }

    this.piece.x -= this.movementspeed;

    if(this.piece.x < this.manX) {//TODO if obstacle solved, generate new else, die
      this.piece.destroy();
      this.generateObstacle();
    }

    //handle input
      if(Phaser.Input.Keyboard.JustDown(this.downKey))
      {
        this.piece.y += 64;//todo it would be nicer to create 'tetris' coordinates
      }
      if(Phaser.Input.Keyboard.JustDown(this.leftKey))
      {
        this.piece.rotation -= Math.PI/2;
      }
      if(Phaser.Input.Keyboard.JustDown(this.rightKey))
      {
        this.piece.rotation += Math.PI/2;
      }
  }

  
}