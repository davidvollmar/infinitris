export class Piece {

    private pieceType;
    private offsetX;
    private offsetY;
    private coordinates;
    private orientations;
    private orientation = 0;

    private conversionFactor = 64;

    constructor(pieceType: string, offsetX: integer, offsetY: integer) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        switch (pieceType) {
            case 'I':
                this.orientations = [
                    [new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(3, 1)],
                    [new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(1, 2), new Coordinate(1, 3)]
                ];
                break;
        }
    }

    rotateleft(): void {
        this.orientation--;
        if (this.orientation < 0) {
            this.orientation = this.orientations.length - 1;
        }
    }

    rotateright(): void {
        this.orientation--;
        if (this.orientation < 0) {
            this.orientation = this.orientations.length - 1;
        }
    }

    drop(): void {
        this.offsetY++;
    }

    drift(speed): void {
        this.offsetX -= speed / this.conversionFactor;
    }

    getWorldCoordinates(): Array<Coordinate> {
        console.log(this.offset(this.orientations))
        return this.convert(this.offset(this.orientations[this.orientation]));
    }

    offset(inputCoordinates: Array<Coordinate>): Array<Coordinate> {
        if (inputCoordinates) {
            return inputCoordinates.map(element => {
                element.x += this.offsetX;
                element.y += this.offsetY;
                return new Coordinate(element.x, element.y)
            });
        }
    }

    convert(inputCoordinates: Array<Coordinate>): Array<Coordinate> {
        if (inputCoordinates) {
            return inputCoordinates.map(element => {
                element.x *= this.conversionFactor;
                element.y *= this.conversionFactor;
                return new Coordinate(element.x, element.y)
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

