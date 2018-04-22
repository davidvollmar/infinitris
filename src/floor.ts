import { Piece } from './piece';
import { Coordinate } from './coordinate';

export class Floor {
    private scene;
    private width: integer;
    private height: integer;
    private missingPieces: integer;

    private floor = Array<Piece>();

    
    private buildingFloor: Array<Piece>;
    private tried: Array<Piece>;

    private floorSolved = false;
    private maxPieces;

    constructor(scene, width, height, missingPieces) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.missingPieces = missingPieces;

        this.floor = [];
        this.buildingFloor = [];

        this.solve();
        //now buildingFloor can become floor.
        this.floor = this.floor.concat(this.buildingFloor);
        this.floor.forEach(element => {
            // console.log("enabling draw for: " + element.toString());
            element.enableDraw();
        });

        this.maxPieces = width;//assuming height == 4
    }

    private debug = 0;

    solve() {
        if (this.isFull(this.buildingFloor) && this.isValid(this.buildingFloor)) {
            //solution found, we are done
        } else {
            let nextPosition: Coordinate = this.getNextPosition();
            
            this.debug++;            
            if(this.debug > 10) { let p:Piece = null; p.getLetter();}//crash
            
            console.log("next empty position: " + nextPosition.toString());
            let letters = Piece.getAllLetters(); //TODO randomize the order??
            for(var l = 0; l<letters.length; l++) {
                let letter = letters[l];
                for (var i = 0; i<Piece.getNumberOfOrientations(letter); i++) {
                    let p:Piece = new Piece(this.scene, letter, Piece.pickColor(),
                    nextPosition.x, nextPosition.y, false, i);

                    //try to place 
                    if(this.isValid(this.buildingFloor.concat([p]))) {
                        //if valid, lpace
                        this.buildingFloor.push(p);

                        this.solve(); //now recursively solve rest of puzzle

                        //if we get here, then there are no solutions in the current configuration
                        //so we must pop the previous try.
                        this.buildingFloor.pop();
                    }                    
                }                    
           }
       }
    }

    //get topleft most 'free' position to try next piece
    getNextPosition(): Coordinate {
        let filledCoordinates = [];
        this.buildingFloor.forEach(element => {
            filledCoordinates = filledCoordinates.concat(element.getTetrisCoordinates());
        });

        console.log("filled Coordinates: " + filledCoordinates.length);
        filledCoordinates.forEach(element => {
            console.log("piece on coordinate: " + element.toString());            
        });

        let toReturn: Coordinate = new Coordinate(0, 11);//y (0-15) but floor is at (11-15)  

        if (filledCoordinates.length > 0) {
            let filled: boolean = false;
            let done: boolean = false;
            for (var x = 0; x < this.width && !done; x++) {
                // console.log("trying x: " + x);
                for (var y = 11; y < this.height + 11 && !done; y++) {//y (0-15) but floor is at (11-15)                
                    // console.log("trying y: " + y);
                    filled = false;
                    for (var i = 0; i < filledCoordinates.length && !filled; i++) {
                        let toCheck: Coordinate = filledCoordinates[i];
                        // console.log("comparing " + toCheck.toString() + " to " + x + " y" + y);
                        if (toCheck.x == x && toCheck.y == y) {
                            //x,y is filled
                            filled = true;
                        }
                    }
                    if (!filled) {
                        toReturn = new Coordinate(x, y);
                        // console.log("found empty " + toReturn.toString());
                        done = true;
                    }
                }
            }
        }

        return toReturn;
    }

    isValid(buildingFloor: Array<Piece>): boolean {//check only latest addition
        let a: Piece = buildingFloor[buildingFloor.length - 1];
        // console.log("isvalid? " + buildingFloor.length + " " + a.getLetter());
        if (this.outOfBounds(a)) {
            return false;
        } else {
            for (var i = 0; i < buildingFloor.length - 1; i++) {
                if (Piece.overlaps(a, buildingFloor[i])) {
                    // console.log("OVERLAP! i: " + buildingFloor[i].toString() + " j: " + buildingFloor[j].toString());
                    return false;
                }
            }
        }

        return true;
    }

    outOfBounds(a: Piece): boolean {
        a.getTetrisCoordinates().forEach(element => {
            // console.log("comparing " + element.toString() + " to bounds");
            if (element.x < 0 || element.x > this.width - 1 || element.y < 0 + 11 || element.y > this.height - 1 + 11) {
                return true;
            }
        });
        return false;
    }

    isFull(buildingFloor: Array<Piece>): boolean {
        //assuming that valid, done can be defined as "fitted 16 pieces in"
        console.log("checking done: " + buildingFloor.length + " max: " + this.maxPieces);
        return buildingFloor.length == this.maxPieces;
    }
}
