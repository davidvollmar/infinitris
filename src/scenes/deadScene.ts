export class DeadScene extends Phaser.Scene {

    constructor() {
        super({
            key: "DeadScene"
        });
    }

    preload(): void {
        this.load.image('background', 'assets/graphics/Background/Background.png');
        this.load.image('cloud-big', 'assets/graphics/Background/Cloud-big.png');
        this.load.image('tilesprite', 'assets/graphics/block-floor.png');
    }

    create(): void {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        this.add.sprite(512 + 256, 256, 'cloud-big').setScale(0.5);

        this.add.text(256 + 64, 256 + 128, "You died, thanks for playing\n\nClick to go back to the menu");

        this.add.tileSprite(0, 896, 1024 * 16, 1024, 'tilesprite').setScale(0.25);

        this.input.once('pointerdown', function () {

            // @ts-ignore 
            this.scene.start('MenuScene');            

        }, this);
    }
}
