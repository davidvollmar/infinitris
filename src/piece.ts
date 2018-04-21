export class Piece {

    private type;
    private offsetX;
    private offsetY;
    private coordinates;
    private orientations;
    private orientation;

    private conversionFactor = 64;

    constructor(type: string, offsetX: integer, offsetY: integer) {
        switch(type) {
            case 'I':
                this.orientations = [
                    [new Coordinate(0,1), new Coordinate(1,1), new Coordinate(2,1), new Coordinate(3,1)],
                    [new Coordinate(1,0), new Coordinate(1,1), new Coordinate(1,2), new Coordinate(1,3)]
                ];
        }
    }

    rotateleft():void {
        this.orientation--;
        if(this.orientation < 0) {
            this.orientation = this.orientations.length -1;
        }
    }

    rotateright():void {
        this.orientation--;
        if(this.orientation < 0) {
            this.orientation = this.orientations.length -1;
        }
    }

    getWorldCoordinates() {
        return this.convert(this.offset(this.orientations));
    }

    offset(inputCoordinates) {
        return inputCoordinates.array.forEach(element => {
            element.x += this.offsetX;
            element.y += this.offsetY;
        });
    }

    convert(inputCoordinates) {
        return inputCoordinates.array.forEach(element => {
            element.x *= this.conversionFactor;
            element.y *= this.conversionFactor;
        });
    }
}

class Coordinate {
    public x;
    public y;

    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

