export class World {

    constructor(x: int, y: int) {
        let dim = x * y;
        let arr: int[] = [];
        for (let i = 0; i < dim; i++) {
            arr.push(0);
        }

        this.map = arr;
        this.worldWidth = y;
    }

    map: Array<int>;
    worldWidth: int;

}

module Tiles {
    export enum Types {
        Empty = 0,
        Tower,
        Creep
    };
}