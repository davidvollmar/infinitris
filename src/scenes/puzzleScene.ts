import { World } from '../world'
import { GameObjects } from 'phaser';

export class PuzzleScene extends Phaser.Scene {

    private piece: GameObjects.Sprite;    
    private man: GameObjects.Sprite;
    private bgtile: GameObjects.TileSprite;

    
    constructor() {
        super({
          key: "PuzzleScene"
        });

        //do some random generations
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
        this.load.image('piece', '../assets/graphics/piece.png');
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

        //now create the hole
        this.piece = this.add.sprite((200 + Math.random()*400), 200, 'piece');
        this.piece.setScale(0.25,0.25);
    
    }

    update(time: number, delta: number): void {

        let ptr = this.input.mouse.manager.activePointer;
        if (ptr.isDown) {
            this.scene.start('MainScene');
        }
    }
}