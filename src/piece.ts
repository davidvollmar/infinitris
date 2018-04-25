import { MainScene } from "./scenes/mainScene";
import { GameObjects } from 'phaser';
import { Coordinate } from './Coordinate';

export type Letter = 'I' | 'L' | 'J' | 'S' | 'Z' | 'O' | 'T';

export class Piece {
    static letters: Letter[] = ['I', 'L', 'J', 'S', 'Z', 'O', 'T'];
    static colors = ['light-red', 'light-blue', 'light-green', 'light-yellow', 'dark-red', 'dark-blue', 'dark-green', 'dark-yellow'];

    private pieceType: Letter;
    private tetrisOffsetX: number;
    private drawOffsetX: number;
    private testrisOffsetY: number;
    private drawOffsetY: number;
    private orientations: Coordinate[][];
    private orientation: number;

    private conversionFactor = 64;

    private scene: Phaser.Scene;
    private sprites: GameObjects.Sprite[] = [];
    private color: string;
    private originalColor: string;
    private draw: boolean;

    constructor(scene: Phaser.Scene, pieceType: Letter, color: string, offsetX: number, offsetY: number, draw: boolean, drawOffset: number, orientation?: number) {
        this.scene = scene;
        this.pieceType = pieceType;
        this.color = color;
        this.originalColor = color;
        this.tetrisOffsetX = offsetX;
        this.drawOffsetX = drawOffset;
        this.testrisOffsetY = offsetY;
        this.drawOffsetY = 0;//no need for this?
        this.draw = draw;

        this.orientations = Piece.getOrientations(pieceType);

        if (orientation != null) {
            this.orientation = orientation;
        } else {
            this.orientation = Math.floor(Math.random() * this.orientations.length);
        }

        if (this.draw) {
            this.initSprite();
        }
    }

    public static pickColor(): string {
        return (Piece.colors[Math.floor(Math.random() * Piece.colors.length)]);
    }

    public static pickLetter(): Letter {
        return (Piece.letters[Math.floor(Math.random() * Piece.letters.length)]);
    }

    setOrientation(o: number) {
        this.orientation = o;
    }

    enableDraw() {
        this.draw = true;
        this.initSprite();
    }

    initSprite() {
        this.sprites = [];
        this.getWorldCoordinates().forEach(element => {
            let sprite = this.scene.add.sprite(element.x, element.y, this.color);
            sprite.setScale(0.25, 0.25);
            sprite.setOrigin(0, 0);//TODO get proper origin for each piece for rotation, or make proper code
            this.sprites.push(sprite);
        });
    }

    updateSprite() {
        if (this.draw) {
            // this.sprites.forEach(element => {
            //     element.destroy();
            // });
            // this.initSprite();
            let wcs = this.getWorldCoordinates();
            for(var i = 0; i<wcs.length; i++) {
                this.sprites[i].x = wcs[i].x;
                this.sprites[i].y = wcs[i].y;
            }

        }
    }

    moveOutOfPuzzle(): void {
        for (var i = 0; i < Math.floor(Math.random() * 4); i++) {
            this.rotateleft();
        }
        for (var i = 0; i < Math.floor(Math.random() * 2) + 6; i++) {
            this.moveUp();
        }
        if(Math.random() < 0.5) {
            for (var i = 0; i < Math.floor(Math.random() * 3); i++) {
                this.moveLeft();
            }
        } else {
            for (var i = 0; i < Math.floor(Math.random() * 3); i++) {
                this.moveRight();
            }
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
        this.tetrisOffsetX++;
        this.updateSprite();
    }

    moveLeft(): void {
        this.tetrisOffsetX--;
        this.updateSprite();
    }

    moveUp(): void {
        this.testrisOffsetY--;
        this.updateSprite();
    }

    drop(): void {
        this.testrisOffsetY++;
        this.updateSprite();
    }

    drift(speed: number): void {
        //this.offsetX -= speed / this.conversionFactor;
        this.drawOffsetX -= speed;
        this.updateSprite();
    }

    getWorldCoordinates(): Array<Coordinate> {
        let toCalc = new Array<Coordinate>();
        this.orientations[this.orientation].forEach(element => {
            toCalc.push(new Coordinate(element.x, element.y));
        });
        return this.convert(this.offset(toCalc));
    }

    getTetrisCoordinates(): Array<Coordinate> {
        let toCalc = new Array<Coordinate>();
        this.orientations[this.orientation].forEach(element => {
            toCalc.push(new Coordinate(element.x, element.y));
        });
        return this.offset(toCalc);
    }

    offset(inputCoordinates: Array<Coordinate>): Array<Coordinate> {
        return inputCoordinates.map(element => {
            element.x += this.tetrisOffsetX;
            element.y += this.testrisOffsetY;
            return new Coordinate(element.x, element.y);
        });
    }

    convert(inputCoordinates: Array<Coordinate>): Array<Coordinate> {
        return inputCoordinates.map(element => {
            let x = (element.x * this.conversionFactor) + this.drawOffsetX;
            let y = (element.y * this.conversionFactor) + this.drawOffsetY;
            return new Coordinate(x, y);
        });
    }

    static getAllLetters() {
        return this.letters;
    }

    static getNumberOfOrientations(letter: Letter) {
        return this.getOrientations(letter).length;
    }

    getLetter(): Letter {
        return this.pieceType;
    }

    getColor(): string {
        return this.color;
    }

    getOffsetX() {
        return this.tetrisOffsetX;
    }

    getOffsetY() {
        return this.testrisOffsetY;
    }

    static overlaps(a: Piece, b: Piece): boolean {
        let coordsa = a.getTetrisCoordinates();
        let coordsb = b.getTetrisCoordinates();

        for (var i = 0; i < coordsa.length; i++) {
            for (var j = 0; j < coordsb.length; j++) {
                let ca = coordsa[i];
                let cb = coordsb[j];
                if (Coordinate.overlaps(ca, cb)) {
                    return true;
                }
            }
        }

        return false;
    }

    toString(): string {
        return "letter: " + this.pieceType + " color: " + this.color + " orientation: " + this.orientation + " offsetX: " + this.tetrisOffsetX + " offsetY: " + this.testrisOffsetY;
    }

    static getOrientations(pieceType: String): Array<Array<Coordinate>> {
        let orientations;
        switch (pieceType) {
            case 'I':
                orientations = [
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(3, 0)],
                    [new Coordinate(0, -1), new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(0, 2)],
                    [new Coordinate(1, 0), new Coordinate(0, 0), new Coordinate(-1, 0), new Coordinate(-2, 0)],
                    [new Coordinate(0, 1), new Coordinate(0, 0), new Coordinate(0, -1), new Coordinate(0, -2)]
                ];
                break;
            case 'L':
                orientations = [
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(0, 2), new Coordinate(1, 2)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(0, 1)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(1, 2)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(2, -1)]
                ];
                break;
            case 'J':
                orientations = [
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(0, 2), new Coordinate(-1, 2)],
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(2, 1)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(0, 1), new Coordinate(0, 2)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(2, 1)]
                ];
                break;
            case 'S':
                orientations = [
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(1, -1), new Coordinate(2, -1)],
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(1, 2)]
                ];
                break;
            case 'Z':
                orientations = [
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(1, 1), new Coordinate(2, 1)],
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 0), new Coordinate(1, -1)]
                ];
                break;
            case 'O':
                orientations = [
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 0), new Coordinate(1, 1)]
                ];
                break;
            case 'T':
                orientations = [
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(1, 1)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(1, -1), new Coordinate(1, 1)],
                    [new Coordinate(0, 0), new Coordinate(1, 0), new Coordinate(2, 0), new Coordinate(1, -1)],
                    [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 1), new Coordinate(0, 2)]
                ];
                break;
            default:
                return new Array<Array<Coordinate>>();
        }
        return orientations
    }

    //only used for color changing
    setActive() {
        this.color = 'active-white';
        this.sprites.forEach(s => s.destroy());
        this.initSprite();
        this.sprites.forEach(s => s.setDepth(1));
    }

    setInActive() {
        this.color = this.originalColor;
        this.sprites.forEach(s => s.destroy());
        this.initSprite();
    }

}


