import { Piece } from './piece';
import { Coordinate } from './Coordinate';
import { GameObjects } from 'phaser';

export class Floor {
    private scene: Phaser.Scene;
    private magicGlobalOffsetY = 12;

    private width: integer;
    private height: integer;
    private missingPieces: integer;

    private floor = Array<Piece>();

    private buildingFloor: Array<Piece>;

    private floorSolved = false;
    private maxPieces: number;

    private selectedPiece: Piece;

    private bottomRight: integer;
    private offset: integer;
    private xOffset: integer; //this is the x-offset in tetris coordinates

    constructor(scene: Phaser.Scene, width: number, height: number, missingPieces: number, offset: integer) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.missingPieces = missingPieces;

        this.floor = [];
        this.buildingFloor = [];

        this.maxPieces = width;//assuming height == 4        

        //bottom right
        this.offset = offset;
        this.xOffset = offset * this.width;
        this.bottomRight = 1024 + (1024 * offset);

        //fill up the floor
        this.solve();
        console.log("solved");
        //now buildingFloor can become floor.
        this.buildingFloor.forEach(element => {
            // console.log("enabling draw for: " + element.toString());
            element.enableDraw();
        });

        // console.log("floor+ " + this.floor);
        // console.log("buildingfloor+ ", this.buildingFloor);
        let puzzlePiece = this.buildingFloor[this.selectPuzzlePiece(this.buildingFloor)];
        // console.log(lastPiece)

        puzzlePiece.takeOutOfPuzzle();

        this.selectedPiece = puzzlePiece;
    }

    getSelectedPiece() {
        return this.selectedPiece;
    }

    // private debug = 0;
    private solved = false;

    solve() {
        if (this.isFull(this.buildingFloor) && this.isValid(this.buildingFloor)) {
            //solution found, we are done
            this.solved = true;
            return;
        } else {
            let nextPosition: Coordinate = this.getNextPosition();

            // this.debug++;            
            // if(this.debug > 10) { let p:Piece = null; p.getLetter();}//crash

            // console.log("next empty position: " + nextPosition.toString());
            let letters = Piece.getAllLetters();
            Phaser.Utils.Array.Shuffle(letters);//randomizing s.t. we get other solution than just I-piece everwhere
            for (var l = 0; l < letters.length; l++) {
                let letter = letters[l];
                for (var i = 0; i < Piece.getNumberOfOrientations(letter); i++) {
                    let p: Piece = new Piece(this.scene, letter, Piece.pickColor(),
                        nextPosition.x, nextPosition.y, false, i);

                    //try to place 
                    if (this.isValid(this.buildingFloor.concat([p]))) {
                        //if valid, lpace
                        this.buildingFloor.push(p);

                        this.solve(); //now recursively solve rest of puzzle

                        //if we get here, then there are no solutions in the current configuration
                        //so we must pop the previous try.
                        if (!this.solved) {
                            this.buildingFloor.pop();
                        }
                    }
                }
            }
        }
    }

    //get topleft most 'free' position to try next piece
    getNextPosition(): Coordinate {
        let filledCoordinates: Coordinate[] = [];
        this.buildingFloor.forEach(element => {
            filledCoordinates = filledCoordinates.concat(element.getTetrisCoordinates());
        });

        // console.log("filled Coordinates: " + filledCoordinates.length);
        filledCoordinates.forEach(element => {
            // console.log("piece on coordinate: " + element.toString());            
        });

        let toReturn: Coordinate = new Coordinate(0 + this.xOffset, this.magicGlobalOffsetY);//y (0-15) but floor is at (11-15)  

        if (filledCoordinates.length > 0) {
            let filled: boolean = false;
            let done: boolean = false;
            for (var x = 0 + this.xOffset; x < this.width + this.xOffset && !done; x++) {
                // console.log("trying x: " + x);
                for (var y = this.magicGlobalOffsetY; y < this.height + this.magicGlobalOffsetY && !done; y++) {//y (0-15) but floor is at (11-15)                
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
                    return false;
                }
            }
        }

        return true;
    }

    outOfBounds(a: Piece): boolean {
        let tetrisCoordinates = a.getTetrisCoordinates();
        for (var i = 0; i < tetrisCoordinates.length; i++) {
            let c = tetrisCoordinates[i];
            if (c.x < 0 + this.xOffset || c.x >= this.width + this.xOffset || c.y < this.magicGlobalOffsetY || c.y >= this.magicGlobalOffsetY + this.height) {
                return true;
            }
        }

        return false;
    }

    isFull(buildingFloor: Array<Piece>): boolean {
        //assuming that valid, done can be defined as "fitted 16 pieces in"
        // console.log("checking done: " + buildingFloor.length + " max: " + this.maxPieces);
        return buildingFloor.length == this.maxPieces;
    }

    drift(movementSpeed: number) {
        this.bottomRight -= movementSpeed;
        this.buildingFloor.forEach(p => p.drift(movementSpeed))
    }

    getBottomRight() {
        return this.bottomRight;
    }

    destroy() {       
        this.buildingFloor.forEach(p => {
            p.destroy();
        });
    }

    selectPuzzlePiece(buildingFloor: Array<Piece>): integer {
        //idea: pick 'toprightmost' piece
        //so, select the piece that fills the topright coordinate in the box
        let topRightMost:Coordinate = new Coordinate(-1, this.height+this.magicGlobalOffsetY+1);

        //initial implementation, just pick the last one that was put in place
        let toReturn:integer = buildingFloor.length - 1;

        for(var i = 0; i < buildingFloor.length; i++) {
            let p:Piece = buildingFloor[i];
            p.getTetrisCoordinates().forEach(c => {
                if(c.y <= topRightMost.y && c.x >= topRightMost.x) {
                    topRightMost = new Coordinate(c.x, c.y);
                    toReturn = i;
                }
            });
        }

        return toReturn;
    }
}
