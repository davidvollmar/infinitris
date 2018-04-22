import { GameObjects } from 'phaser';
import { Piece } from '../piece';
import { Floor } from '../floor';

export class MainScene extends Phaser.Scene {
  //graphics
  private phaserSprite: Phaser.GameObjects.Sprite | null = null;
  private man: GameObjects.Sprite | null = null;
  private cloud: GameObjects.Sprite | null = null;
  private cloud2: GameObjects.Sprite | null = null;
  private tree: GameObjects.Sprite | null = null;
  private tree2: GameObjects.Sprite | null = null;
  
  private background: GameObjects.Sprite | null = null;
  // private graphics: GameObjects.Graphics;
  private instructionText: GameObjects.Text | null = null;

  //magic numbers
  private manX = 64;

  //gameplay
  private movementspeed = 1;

  //input handling  
  private downKey: Phaser.Input.Keyboard.Key | null = null;
  private leftKey: Phaser.Input.Keyboard.Key | null = null;
  private rightKey: Phaser.Input.Keyboard.Key | null = null;
  private zKey: Phaser.Input.Keyboard.Key | null = null;
  private xKey: Phaser.Input.Keyboard.Key | null = null;

  //things belonging to obstacle:  
  private piece: Piece | null = null;
  private pieceSprite: GameObjects.Sprite | null = null;
  private validSolutions: number[] = [];

  //tetris floors
  private currentFloor: Floor | null = null;
  private nextFloor: Floor | null = null;

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
    this.load.image('cloud-small', '../assets/graphics/Background/Cloud-small.png');
    this.load.image('cloud-big', '../assets/graphics/Background/Cloud-big.png');
    this.load.image('tree', '../assets/graphics/Background/tree.png');    
    this.load.image('tree2', '../assets/graphics/Background/tree2.png');

    this.load.image('block-red', '../assets/graphics/blocks-light/block-red.png');
    this.load.image('block-green', '../assets/graphics/blocks-light/block-green.png');
    this.load.image('block-blue', '../assets/graphics/blocks-light/block-blue.png');    
    this.load.image('block-yellow', '../assets/graphics/blocks-light/block-yellow.png');
    
    //deuntje 
    //CC-Stealing_Orchestra_-_05_-_Tetris_Beware_Boy_Videogames_Are_Evil
    //by-nc-nd/3.0/
    let audioconfig = {
      loop: true,
    };
    this.load.audio('theme', 'assets/audio/theme.mp3', audioconfig);
  }

  create(): void {
    //start music
    var music = this.sound.add('theme');
    music.loop = true;
    music.play();

    //initial graphics
    this.background = this.add.sprite(0, 0, 'background');
    this.background.setOrigin(0, 0);

    this.cloud = this.add.sprite(128, 128, 'cloud-small');
    this.cloud.setScale(0.5, 0.5);

    this.cloud2 = this.add.sprite(512, 256, 'cloud-big');
    this.cloud2.setScale(0.5, 0.5);

    this.tree = this.add.sprite(768, 1024-(4*64)-128, 'tree');
    this.tree.setScale(0.5);

    this.tree2 = this.add.sprite(768, 1024-(4*64)-128, 'tree2');
    this.tree2.setScale(0.5);

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

    this.piece = this.currentFloor.getSelectedPiece();
  }

  generateFloor(): Floor {    
    return new Floor(this, 16, 4, 0);
  }

  generateObstacle(): void {
    //let obstacle: Obstacle = new Obstacle(600 + Math.random()*400, 200, 'piece');
    this.piece = new Piece(this, Piece.pickLetter(), Piece.pickColor(), 8, 4, false);
    
    this.validSolutions = [1, 2];
  }

  update(time: number, delta: number): void {
    this.cloud!.x -= this.movementspeed;
    if (this.cloud!.x < -256) {
      this.cloud!.x = 1024 + Math.random() * 1024;
      this.cloud!.y = 128 + Math.random() * 256;
    }
    this.cloud2!.x -= this.movementspeed * 2;
    if (this.cloud2!.x < -256) {
      this.cloud2!.x = 1024 + Math.random() * 1024;
      this.cloud2!.y = 128 + Math.random() * 256;
    }

    this.tree!.x -= this.movementspeed;
    if (this.tree!.x < -256) {
      this.tree!.x = 1024 + Math.random() * 1024;
      this.tree!.y = 1024 - (4 * 64) - 128;
    }

    this.tree2!.x -= this.movementspeed;
    if (this.tree2!.x < -256) {
      this.tree2!.x = 1024 + Math.random() * 1024;
      this.tree2!.y = 1024 - (4 * 64) - 128;
    }

    if(this.instructionText) {
      this.instructionText.x--;
      if(this.instructionText.x < -1024) {
        this.instructionText.destroy;
      }
    }

    this.currentFloor!.drift(this.movementspeed);
    let piece = this.piece!;

    //piece.drift(this.movementspeed);    

    // if (this.piece.x < this.manX) {//TODO if obstacle solved, generate new else, die
    //   this.piece.destroy();
    //   this.generateObstacle();
    // }

    //handle input
    let keyboard = Phaser.Input.Keyboard;
    if (keyboard.JustDown(this.downKey!)) {
      piece.drop();
    }
    if (keyboard.JustDown(this.zKey!)) {
      piece.rotateleft();
    }
    if (keyboard.JustDown(this.xKey!)) {
      piece.rotateright();
    }
    if (keyboard.JustDown(this.leftKey!)) {
      piece.moveLeft();
    }
    if (keyboard.JustDown(this.rightKey!)) {
      piece.moveRight();
    }   
  }
}