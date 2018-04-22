import { MainScene } from "./scenes/mainScene";
import { GameObjects } from 'phaser';

export class Piece {

    private pieceType;
    private offsetX;
    private offsetY;
    //private coordinates;
    private orientations;
    private orientation;

    private conversionFactor = 64;

    private scene;
    private sprites = [];
    private sprite: GameObjects.Sprite;
    private color: string;
    private draw: boolean;

    constructor(scene, pieceType: string, color: string, offsetX, offsetY: integer, draw: boolean) {
        this.scene = scene;
        this.pieceType = pieceType;
        this.color = color;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.draw = draw;

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
            case 'J':
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
            case 'T':
                this.orientations = [
                    [new Coordinate(2, 0), new Coordinate(1, 1), new Coordinate(2, 1), new Coordinate(3, 1)],
                    [new Coordinate(1, -1), new Coordinate(2, 0), new Coordinate(1, 0), new Coordinate(1, 1)],
                    [new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(3, 0), new Coordinate(2, 1)],
                    [new Coordinate(1, 0), new Coordinate(2, 1), new Coordinate(2, 0), new Coordinate(2, -1)]
                ];
                break;
        }

        this.orientation = Math.floor(Math.random() * this.orientations.length);
        //console.log("letter: " + pieceType + " color: " + color + " orientation: " + this.orientation);

        if(this.draw) {
            this.initSprite();
        }
    }

    public static pickColor():string {    
        let colors = ['block-red','block-blue','block-green'];
        return(colors[Math.floor(Math.random()*colors.length)]);
      }
    
    public static pickLetter():string {
        let letters = ['I', 'L', 'J', 'S', 'Z', 'O', 'T'];
        return(letters[Math.floor(Math.random()*letters.length)]);
    }

    enableDraw() {
        this.draw = true;
        // console.log("going to draw"); 
        this.initSprite();
    }

    initSprite() {
        this.getWorldCoordinates().forEach(element => {
            // console.log("world coordinates: ");   
            // console.log(element.toString());     
            this.sprite = this.scene.add.sprite(element.x, element.y, this.color);
            this.sprite.setScale(0.25, 0.25);
            this.sprite.setOrigin(0, 0);//TODO get proper origin for each piece for rotation, or make proper code
            this.sprites.push(this.sprite);
        });
    }

    updateSprite() {
        if(this.draw) {
            this.sprites.forEach(element => {
                element.destroy();
            });        
            this.initSprite();
        }
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
        let toCalc = new Array<Coordinate>();
        this.orientations[this.orientation].forEach(element => {
            // console.log("tetris coordinates: " + element.x + " " + element.y);
            toCalc.push(new Coordinate(element.x, element.y));
        });
        return this.convert(this.offset(toCalc));
    }

    getTetrisCoordinates(): Array<Coordinate> {
        let toCalc = new Array<Coordinate>();
        this.orientations[this.orientation].forEach(element => {
            // console.log("tetris coordinates: " + element.x + " " + element.y);
            toCalc.push(new Coordinate(element.x, element.y));
        });
        return this.offset(toCalc);
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

    static overlaps(a: Piece, b: Piece): boolean {
        // console.log("comparing a: " + a.toString() + " to b: " + b.toString());
        let coordsa = a.getTetrisCoordinates();
        let coordsb = b.getTetrisCoordinates();

        for(var i = 0; i<coordsa.length; i++) {
            for(var j = 0; j<coordsb.length; j++) {
                let ca = coordsa[i];
                let cb = coordsb[j];
                // console.log("comparing a: " + ca.toString() + " to b: " + cb.toString());
                if(Coordinate.overlaps(ca,cb)) {
                    return true;
                }
            }
        }

        return false;
    }

    toString():string {        
        return "letter: " + this.pieceType + " color: " + this.color + " orientation: " + this.orientation + " offsetX: " + this.offsetX + " offsetY: " + this.offsetY;
    }

}

class Coordinate {
    public x: integer;
    public y: integer;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static overlaps(a: Coordinate, b:Coordinate):boolean {
        return ((a.x == b.x) && (a.y == b.y));
    }

    toString():string {
        return "x: " + this.x + " y: " + this.y;
    }
}

