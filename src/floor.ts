import { Piece } from './piece';

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

        this.floor = this.solve(this.floor);
        this.floor.forEach(element => {
            // console.log("enabling draw for: " + element.toString());
            element.enableDraw();
        });

        this.maxpieces = (width/height) * 4;
    }

    solve(buildingFloor:Array<Piece>):Array<Piece> {
        while(!this.floorSolved) {
            buildingFloor = this.addPiece(buildingFloor);
            if(this.isValid(buildingFloor)) {
                if(this.isDone(buildingFloor)) {
                    this.floorSolved = true;
                    console.log("solved");
                    return buildingFloor;
                } else {
                    this.solve(buildingFloor);
                }
            }
            if(!this.floorSolved) {
                buildingFloor.pop();
            }
        }
        return buildingFloor;
    }

    addPiece(buildingFloor: Array<Piece>):Array<Piece> {
        let p = new Piece(this.scene,
                            Piece.pickLetter(), 
                            Piece.pickColor(), 
                            Math.floor(Math.random()*this.width),
                            Math.floor(Math.random()*this.height + 11), //for a floor of 4 pieces, it will be on y coords 11-15 //TODO make this a less magic number
                            false);
        // console.log("added piece: " + p.toString());
        buildingFloor.push(p);

        return buildingFloor;
    }


    isValid(buildingFloor: Array<Piece>):boolean {//check only latest addition
        let a = buildingFloor[buildingFloor.length-1];
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
            if(element.x < 0 || element.x > this.width-1 || element.y < 0 || element.y > this.height -1) {
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
