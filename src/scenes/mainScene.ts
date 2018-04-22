import { World } from '../world'
import { GameObjects } from 'phaser';
import { PuzzleScene } from './puzzleScene';
import { Piece } from '../piece';
import { Floor } from '../floor';

export class MainScene extends Phaser.Scene {
  //graphics
  private phaserSprite: Phaser.GameObjects.Sprite;
  private man: GameObjects.Sprite;
  private cloud: GameObjects.Sprite;
  private cloud2: GameObjects.Sprite;
  private tree: GameObjects.Sprite;
  // private bgtile: GameObjects.TileSprite;
  private background: GameObjects.Sprite;
  private graphics: GameObjects.Graphics;
  private instructionText: GameObjects.Text;

  //magic numbers
  private manX = 64;

  //gameplay
  private movementspeed = 1;

  //input handling  
  private downKey: Phaser.Input.Keyboard.Key;
  private leftKey: Phaser.Input.Keyboard.Key;
  private rightKey: Phaser.Input.Keyboard.Key;
  private zKey: Phaser.Input.Keyboard.Key;
  private xKey: Phaser.Input.Keyboard.Key;

  //things belonging to obstacle:  
  private piece: Piece;
  private pieceSprite: GameObjects.Sprite;
  private validSolutions = [];

  //tetris
  private tetrisWidth = 8;
  private field: Array<number> = new Array(this.tetrisWidth * 8)
  private tetrisOffset = 600;

  //tetris floors
  private currentFloor: Floor;
  private nextFloor: Floor;


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
    this.load.image('tree', '../assets/graphics/Background/tree.png');
    // this.load.image('piece', '../assets/graphics/piece.png');
    this.load.image('block-red', '../assets/graphics/blocks-light/block-red.png');
    this.load.image('block-green', '../assets/graphics/blocks-light/block-green.png');
    this.load.image('block-blue', '../assets/graphics/blocks-light/block-blue.png');
  }

  create(): void {

    //initial graphics
    this.background = this.add.sprite(0, 0, 'background');
    this.background.setOrigin(0, 0);

    this.cloud = this.add.sprite(128, 100, 'cloud1');
    this.cloud.setScale(0.5, 0.5);

    this.tree = this.add.sprite(768, 1024-(4*64)-128, 'tree');
    this.tree.setScale(0.5);

    this.instructionText = this.add.text(512, 128, "Z/X to rotate\nArrows to move blocks\n\nFix the road before you fall!");
    this.instructionText.setScale(2);

    //player animation
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

    //floor
    this.currentFloor = this.generateFloor();
    //this.nextFloor = this.generateFloor();

    // this.bgtile = this.add.tileSprite(0, 1024-(4*64), 4096, 1024, 'floor');
    // this.bgtile.setOrigin(0, 0);
    // this.bgtile.setScale(0.25);

    //camera
    let cam = this.cameras.main;
    cam.setViewport(0, 0, 1024, 1024);

    //now create the hole
    this.generateObstacle();

    //define keyboard input
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    this.graphics = this.add.graphics();
    //typescript has no fill() number[] ?!
    for (var i = 0; i < this.field.length; i++) {
      this.field[i] = 0;
    }
  }

  generateFloor(): Floor {    
    return new Floor(this, 16, 4, null);
  }

  generateObstacle(): void {
    //let obstacle: Obstacle = new Obstacle(600 + Math.random()*400, 200, 'piece');
    this.piece = new Piece(this, Piece.pickLetter(), Piece.pickColor(), 8, 4, false);
    
    this.validSolutions = [1, 2];
  }

  update(time: number, delta: number): void {
    // this.bgtile.tilePositionX += 2;

    this.cloud.x -= this.movementspeed;
    if (this.cloud.x < -256) {
      this.cloud.x = 1024 + Math.random() * 1024;
      this.cloud.y = 128 + Math.random() * 256;
    }

    this.tree.x -= this.movementspeed;
    if (this.tree.x < -256) {
      this.tree.x = 1024 + Math.random() * 1024;
      this.tree.y = 1024 - (4 * 64) - 128;
    }

    if(this.instructionText) {
      this.instructionText.x--;
      if(this.instructionText.x < -1024) {
        this.instructionText.destroy;
      }
    }


    this.piece.drift(this.movementspeed);

    // if (this.piece.x < this.manX) {//TODO if obstacle solved, generate new else, die
    //   this.piece.destroy();
    //   this.generateObstacle();
    // }

    //handle input
    let keyboard = Phaser.Input.Keyboard;
    if (keyboard.JustDown(this.downKey)) {
      this.piece.drop();
    }
    if (keyboard.JustDown(this.zKey)) {
      this.piece.rotateleft();
    }
    if (keyboard.JustDown(this.xKey)) {
      this.piece.rotateright();
    }
    if (keyboard.JustDown(this.leftKey)) {
      this.piece.moveLeft();
    }
    if (keyboard.JustDown(this.rightKey)) {
      this.piece.moveRight();
    }

    //this.renderTetris()
  }

  // renderTetris() {
  //   let blockSize = 56;
  //   this.tetrisOffset -= this.movementspeed;
  //   let offset = [this.tetrisOffset, 400];

  //   this.graphics.clear();
  //   this.field.map(
  //     (value, index) => {
  //       let pos = [index % this.tetrisWidth, Math.floor(index / this.tetrisWidth)];
  //       let xy = [offset[0] + (pos[0] * blockSize), offset[1] + (pos[1] * blockSize)];
  //       this.graphics.strokeRect(xy[0], xy[1], blockSize, blockSize)
  //     }
  //   );
  // }

}