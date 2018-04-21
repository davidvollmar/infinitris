export class Piece {

    private pieceType;
    private offsetX;
    private offsetY;
    private coordinates;
    private orientations;
    private orientation = 0;

    private conversionFactor = 64;

    private scene;
    private sprites = [];
    private color: string;

    constructor(scene, pieceType: string, color: string, offsetX, offsetY: integer) {
        this.scene = scene;
        this.color = color;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        switch (pieceType) {
            case 'I':
                this.orientations = [
                    [new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(3, 1)],
                    [new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(1, 2), new Coordinate(1, 3)]
                ];
                break;
            case 'L':
                this.orientations = [
                    [new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(3, 1)],
                    [new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(1, 1), new Coordinate(1, 2)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(2, 1)],
                    [new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(2, 0), new Coordinate(2, -1)]
                ];
                break;
            case 'L2':
                this.orientations = [
                    [new Coordinate(3, 0), new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(3, 1)],
                    [new Coordinate(1, -1), new Coordinate(2, 1), new Coordinate(1, 0), new Coordinate(1, 1)],
                    [new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(3, 0), new Coordinate(1, 1)],
                    [new Coordinate(1, -1), new Coordinate(2, 1), new Coordinate(2, 0), new Coordinate(2, -1)]
                ];
                break;
            case 'S':
                this.orientations = [
                    [new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(0, 1), new Coordinate(1, 1)],
                    [new Coordinate(2, 2), new Coordinate(2, 1), new Coordinate(1, 0), new Coordinate(1, 1)]
                ];
                break;
            case 'Z':
                this.orientations = [
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(2, 1)],
                    [new Coordinate(1, 2), new Coordinate(2, 1), new Coordinate(2, 0), new Coordinate(1, 1)]
                ];
                break;
            case 'O':
                this.orientations = [
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 0), new Coordinate(1, 1)]
                ];
                break;
            case 'M':
                this.orientations = [
                    [new Coordinate(2, 0), new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(3, 1)],
                    [new Coordinate(1, -1), new Coordinate(2, 0), new Coordinate(1, 0), new Coordinate(1, 1)],
                    [new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(3, 0), new Coordinate(2, 1)],
                    [new Coordinate(1, 0), new Coordinate(2, 1), new Coordinate(2, 0), new Coordinate(2, -1)]
                ];
                break;
        }

        this.initSprite();
    }

    initSprite() {
        this.getWorldCoordinates().forEach(element => {
            let sprite = this.scene.add.sprite(element.x, element.y, this.color);
            sprite.setScale(0.25, 0.25);
            sprite.setOrigin(0, 0);//TODO get proper origin for each piece for rotation, or make proper code
            this.sprites.push(sprite);
        });
    }

    updateSprite() {
        this.sprites.forEach(element => {
            element.destroy();
        });
        this.initSprite();
    }

    rotateleft(): void {
        this.orientation--;
        if (this.orientation < 0) {
            this.orientation = this.orientations.length - 1;
        }
        this.updateSprite();
    }

    rotateright(): void {
        this.orientation++;
        if (this.orientation > this.orientations.length - 1) {
            this.orientation = 0;
        }
        this.updateSprite();
    }

    moveRight(): void {
        this.offsetX++;
        this.updateSprite();
    }

    moveLeft(): void {
        this.offsetX--;
        this.updateSprite();
    }

    drop(): void {
        this.offsetY++;
        this.updateSprite();
    }

    drift(speed): void {
        this.offsetX -= speed / this.conversionFactor;
        this.updateSprite();
    }

    getWorldCoordinates(): Array<Coordinate> {
        console.log(this.offset(this.orientations))
        let toCalc = new Array<Coordinate>();
        this.orientations[this.orientation].forEach(element => {
            toCalc.push(new Coordinate(element.x, element.y));
        });
        return this.convert(this.offset(toCalc));
    }

    offset(inputCoordinates: Array<Coordinate>): Array<Coordinate> {
        if (inputCoordinates) {
            return inputCoordinates.map(element => {
                element.x += this.offsetX;
                element.y += this.offsetY;
                return new Coordinate(element.x, element.y);
            });
        }
    }

    convert(inputCoordinates: Array<Coordinate>): Array<Coordinate> {
        if (inputCoordinates) {
            return inputCoordinates.map(element => {
                element.x *= this.conversionFactor;
                element.y *= this.conversionFactor;
                return new Coordinate(element.x, element.y);
            });
        }
    }


}

class Coordinate {
    public x: integer;
    public y: integer;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

