import { CSS3DObject } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';

var DirectionsMap = {
    0: [5],
    1: [1, 3],
    2: [0, 2],
    3: [1, 2],
    4: [3, 2],
    5: [0, 3],
    6: [0, 1],
    7: [0, 1, 2],
    8: [0, 2, 3],
    9: [0, 1, 3],
    10: [1, 2, 3]
};

export var CSS3DObjectCreator;

export class Map {
    constructor(map, wallwidth, wallheight) {
        this.map = map;
        this.mapcells = [];
        this.walls = [];
        this.WallWidth = wallwidth;
        this.WallHeight = wallheight;
        //BUILD THE MAP
        for (let y = 0; y < 10; y++) {
            this.mapcells.push([]);
            for (let x = 0; x < 10; x++) {
                this.mapcells[y].push({});
                let mapelement = map[y][x];
                let c = this.makeCooridor(mapelement, x, y, 'green');
                c.forEach(a => {
                    this.mapcells[y][x][a.direction] = a;
                    this.walls.push(a);
                });
            }
        }
    }//constructor

    makeWall(x, y, r, c) {
        return new WallSection(this.WallWidth, this.WallHeight, x * this.WallWidth, 0, y * this.WallWidth, r, c);
    }

    makeCooridor(type, x, y, color) {
        switch (type) {
            case 1: { //Horizontal
                return [this.makeWall(x, y, 0, color), this.makeWall(x, y, 2, color)];
            }
            case 2: { //Vertical
                return [this.makeWall(x, y, 3, color), this.makeWall(x, y, 1, color)];
            }
            case 3: { //Up Right
                return [this.makeWall(x, y, 3, color), this.makeWall(x, y, 0, color)];
            }
            case 4: {//Up Left
                return [this.makeWall(x, y, 1, color), this.makeWall(x, y, 0, color)];
            }
            case 5: {//Down Left
                return [this.makeWall(x, y, 1, color), this.makeWall(x, y, 2, color)];
            }
            case 6: {//Down Right
                return [this.makeWall(x, y, 3, color), this.makeWall(x, y, 2, color)];
            }
            case 7: { //Gap Right
                return [this.makeWall(x, y, 3, color)];
            }
            case 8: { //Gap Left
                return [this.makeWall(x, y, 1, color)];
            }
            case 9: { //Gap Top
                return [this.makeWall(x, y, 2, color)];
            }
            case 10: { //Gap Bottom
                return [this.makeWall(x, y, 0, color)];
            }
        }
        return [];
    }

    getDirectionOptions(x, y) {
        return DirectionsMap[this.map[Math.floor(y / this.WallWidth)][Math.floor(x / this.WallWidth)]];
    }
    getNextPoint(x, y, o) {
        switch (o) {
            case 0: {
                if ((y - this.WallWidth) < 0) return undefined;
                else return { x: x, y: y - this.WallWidth };
            }
            case 1: {
                if (Math.floor((x + this.WallWidth) / this.WallWidth) >= this.map[0].length) return undefined;
                else return { x: x + this.WallWidth, y: y};
            }
            case 2: {
                if (Math.floor((y + this.WallWidth) / this.WallWidth)>=this.map.length) return undefined;
                else return { x: x, y: y + this.WallWidth };
            }
            case 3: {
                if ((x- this.WallWidth) < 0) return undefined;
                else return { x: x - this.WallWidth, y: y };
            }
        }
    }
}

class WallSection {
    constructor(w, h, x, y, z, d, color) {
        this.domElem = document.createElement("div");
        this.domElem.style.textAlign = "center";
        this.domElem.style.fontSize = '1rem';
        this.direction = d;
        let r = 0;
        switch (d) {
            case 0: {
                r = 0;
                z = z - w/2;
            } break;
            case 1: {
                r = -Math.PI / 2;
                x = x + w/2;
            } break;
            case 2: {
                r = Math.PI;
                z = z + w/2;
            } break;
            case 3: {
                r = Math.PI / 2;
                x = x - w/2;
            } break;
        }
        this.domElem.style.width = (w + 2) + 'px';
        this.domElem.style.height = (h + 2) + 'px';
        this.domElem.style.backgroundColor = color;
        this.threejsObj = new CSS3DObject(this.domElem);
        this.threejsObj.position.set(x, y, z);
        this.threejsObj.rotation.y = r;
        this.threejsObj.direction = d;
    }
}

