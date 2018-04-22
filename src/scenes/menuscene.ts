export class MenuScene extends Phaser.Scene {
    
    constructor() {
        super({
            key: "MenuScene"
        });
    }

    preload() {

    }

    create ()
    {
        this.input.once('pointerdown', function () {

            console.log('From SceneA to SceneB');

            this.scene.start('MainScene');

        }, this);
    }

    update() {

    }
}