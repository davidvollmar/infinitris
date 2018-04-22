import { Piece } from './piece';
import { Coordinate } from './coordinate';

export class Floor {
    private scene;
    private width: integer;
    private height: integer;
    private missingPieces: integer;

    private floor = Array<Piece>();

    private floorSolved = false;
    private maxpieces;

    constructor(scene, width, height, missingPieces) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.missingPieces = missingPieces;

        this.floor = this.solve([], []);
        this.floor.forEach(element => {
            // console.log("enabling draw for: " + element.toString());
            element.enableDraw();
        });

        this.maxpieces = (width/height) * 4;
    }

    solve(buildingFloor:Array<Piece>, tried: Array<Piece>):Array<Piece> {
        while(!this.floorSolved) {
            let nextPiece:Piece = this.getNextPiece(buildingFloor, tried);
            // console.log("trying next piece: " + nextPiece.toString());
            buildingFloor.push(nextPiece);
            if (this.isValid(buildingFloor)) {
                if(this.isDone(buildingFloor)) {
                    this.floorSolved = true;
                    console.log("solved");
                    return buildingFloor;
                } else {
                    this.solve(buildingFloor, []);
                }
            } else {
                buildingFloor.pop();
                tried.push(nextPiece);
            }
        }
        return buildingFloor;
    }

    getNextPiece(buildingFloor:Array<Piece>, tried: Array<Piece>):Piece {
        let p;
        if(tried == null || tried.length == 0) {//if null we didn't try anything yet        
            let nextPosition:Coordinate = this.getNextPosition(buildingFloor);
            // console.log("next position: " + nextPosition.toString());
            p = new Piece(this.scene,
                Piece.pickLetter(),
                Piece.pickColor(),
                nextPosition.x,
                nextPosition.y,
                false);
        } else {
            let nextPosition:Coordinate = this.getNextPosition(buildingFloor);
            let lastTry:Piece = tried[tried.length-1];
            let o = lastTry.getNextOrientation();
            if(o == 0) {//if o == 0, we tried all orientations and try a new piece
                let triedLetters = [];
                tried.forEach(element => {
                    triedLetters.push(element.getLetter());
                });
                p = new Piece(this.scene,
                    Piece.pickLetterExcept(triedLetters),
                    Piece.pickColor(),                  
                    nextPosition.x,
                    nextPosition.y,
                    false);
            } else {//if o != 0, we try the next orientation
                let oldp = tried[tried.length-1];
                p = new Piece(this.scene,
                    oldp.getLetter(),
                    oldp.getColor(),
                    oldp.getOffsetX(),
                    oldp.getOffsetY(),
                    false,
                    oldp.getNextOrientation());
            }
        }

        return p;
    }

    //get topleft most 'free' position to try next piece
    getNextPosition(buildingFloor:Array<Piece>):Coordinate {
        let filledCoordinates = [];
        buildingFloor.forEach(element => {
            filledCoordinates = filledCoordinates.concat(element.getTetrisCoordinates());
        });

        // console.log("filled Coordinates: " + filledCoordinates.length);
        // filledCoordinates.forEach(element => {
        //     console.log("piece on coordinate: " + element.toString());            
        // });
        
        let toReturn:Coordinate = new Coordinate(0, 11);//y (0-15) but floor is at (11-15)  

        if(filledCoordinates.length > 0) {
            let filled:boolean = false;
            let done:boolean = false;
            for(var x = 0; x<this.width && !done; x++) {
                // console.log("trying x: " + x);
                for(var y = 11; y<this.height+11 && !done; y++) {//y (0-15) but floor is at (11-15)                
                    // console.log("trying y: " + y);
                    filled = false;
                    for(var i=0; i<filledCoordinates.length && !filled; i++) {
                        let toCheck:Coordinate = filledCoordinates[i];
                        // console.log("comparing " + toCheck.toString() + " to " + x + " y" + y);
                        if(toCheck.x == x && toCheck.y == y) {
                            //x,y is filled
                            filled = true;
                        }
                    }
                    if(!filled) {
                        toReturn = new Coordinate(x,y);
                        // console.log("found empty " + toReturn.toString());
                        done = true;
                    }
                }
            }
        }
        
        return toReturn;
    }

    isValid(buildingFloor: Array<Piece>):boolean {//check only latest addition
        let a:Piece = buildingFloor[buildingFloor.length-1];        
        // console.log("isvalid? " + buildingFloor.length + " " + a.getLetter());
        if(this.outOfBounds(a)) {
            return false;
        } else {
            for(var i = 0; i<buildingFloor.length-1; i++) {
                if(Piece.overlaps(a, buildingFloor[i])) {
                    // console.log("OVERLAP! i: " + buildingFloor[i].toString() + " j: " + buildingFloor[j].toString());
                    return false;
                }
            }
        }
        
        return true;
    }

    outOfBounds(a:Piece):boolean {
        a.getTetrisCoordinates().forEach(element => {
            // console.log("comparing " + element.toString() + " to bounds");
            if(element.x < 0 || element.x > this.width-1 || element.y < 0 + 11 || element.y > this.height -1 + 11) {
                return true;
            }
        });
        return false;
    }

    isDone(buildingFloor: Array<Piece>): boolean {
        //assuming that valid, done can be defined as "fitted 16 pieces in"
        // console.log("checking done: " + buildingFloor.length);
        return buildingFloor.length == this.maxpieces;
    }
}
