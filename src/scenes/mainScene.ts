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
    this.load.image("logo", "../assets/fff.png");
  }

  create(): void {
    // this.phaserSprite = this.add.sprite(400, 300, "logo");
    this.world = new World(30, 30);

    //this.add.image(0, 0, 'logo');

    this.world.map.map(
      (value, index, array) => {
        let pos = [index % this.world.worldWidth, Math.floor(index / this.world.worldWidth)];
        // console.log("pos = (" + pos[0] + ", " + pos[1] + ")");

        let xy = [10 + pos[0] * 20, 10 + pos[1] * 20];
        let sprite = this.add.sprite(xy[0], xy[1], 'logo');

        // console.log(sprite.x);
        // console.log(sprite.y);
      }
    );
  }

  update(time: number, delta: number): void {
    let ptr = this.input.mouse.manager.activePointer;
    if (ptr.isDown) {
      console.log("Left Button: " + ptr.position.x + ", " + ptr.position.y);
    }
  }
}
