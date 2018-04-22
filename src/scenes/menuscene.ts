export class MenuScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MenuScene"
        });
    }

    preload() {

    }

    create() {
        this.input.once('pointerdown', function (a: MenuScene) {

            console.log('From SceneA to SceneB');

            a.scene.start('MainScene');

        }, this);
    }

    update() {

    }
}