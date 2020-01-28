import { CSS3DObject } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';

export const WALLSIZE = 500;
const HALFWALLSIZE = WALLSIZE / 2;

var WallSection = function (w, h, x, y, z, d, color) {
    let wall = document.createElement("div");
    //wall.innerHTML = "<iframe width=\"200\" height=\"200\" src=\"https://www.youtube.com/embed/20sAkiGbIWY?controls=0\" frameborder=\"0\" autoplay; encrypted-media; picture-in-picture\"></iframe>";
    //wall.innerHTML = "<img width=\"" + WALLSIZE + "\" height=\"" + WALLSIZE +"\" src=\"https://compote.slate.com/images/697b023b-64a5-49a0-8059-27b963453fb1.gif\"></img>";
    wall.style.textAlign = "center";
    wall.style.fontSize = '1rem';
    let r = 0;
    switch (d) {
        case 0: {
            r = 0;
            z = z - HALFWALLSIZE; //Fix this
        } break;
        case 1: {
            r = -Math.PI / 2;
            x = x + HALFWALLSIZE; //Fix this
        } break;
        case 2: {
            r = Math.PI;
            z = z + HALFWALLSIZE; //Fix this
        } break;
        case 3: {
            r = Math.PI / 2;
            x = x - HALFWALLSIZE; //Fix this
        } break;

    }
    wall.style.width = (w + 2) + 'px';
    wall.style.height = (h + 2) + 'px';
    wall.style.backgroundColor = color;
    let object = new CSS3DObject(wall);
    object.position.set(x, y, z);
    object.rotation.y = r;
    object.direction = d;
    return object;
};

export function makeCoordinatePoint (x, y, heading) {
    return { type:'coord', x: x * WALLSIZE, y: y * WALLSIZE, o: heading };
};
export function makeCommandPoint (command, value) {
    return { type: command, value: value };
};


export class Map {
    constructor(map, scene, pageMappings) {
        this.map = map;
        this.scene = scene;
        this.cooridors = [];
        //BUILD THE MAP
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                let mapelement = map[y][x];
                if (typeof mapelement === 'string') {
                    let m = mapelement.split('-');
                    let dirmapping = {};
                    if (m[1].includes(',')) {
                        m[1].split(',').forEach(d => {
                            let dirpair = d.split(':');
                            dirmapping[dirpair[0]] = dirpair[1];
                        });
                    }
                    else {
                        let dirpair = m[1].split(':');
                        dirmapping[dirpair[0]] = dirpair[1];
                    }
                    let c = this.makeCooridor(parseInt(m[0]), x, y, 'green');
                    c.forEach(a => {
                        if (dirmapping[a.direction] !== undefined) {
                            a.element.appendChild(pageMappings[dirmapping[a.direction]]);
                        }
                        scene.add(a);
                    });
                } else {
                    let c = this.makeCooridor(mapelement, x, y, 'green');
                    this.cooridors.push(c);
                    c.forEach(a => { scene.add(a); });
                }
            }
        }
    }//constructor
    makeCooridor(type, x, y, color) {
        switch (type) {
            case 1: { //Horizontal
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 0, color), new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 2, color)];
            }
            case 2: { //Vertical
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 3, color), new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 1, color)];
            }
            case 3: { //Up Right
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 3, color), new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 0, color)];
            }
            case 4: {//Up Left
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 1, color), new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 0, color)];
            }
            case 5: {//Down Left
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 1, color), new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 2, color)];
            }
            case 6: {//Down Right
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 3, color), new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 2, color)];
            }
            case 7: { //Gap Right
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 3, color)];
            }
            case 8: { //Gap Left
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 1, color)];
            }
            case 9: { //Gap Top
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 2, color)];
            }
            case 10: { //Gap Bottom
                return [new WallSection(WALLSIZE, WALLSIZE, x * WALLSIZE, 0, y * WALLSIZE, 0, color)];
            }
        }
        return [];
    }

}

//TO-DO CLEAN THIS UP YOU ANIMAL!

export class CameraMover {
    constructor(camera, routes) {
        this.routes = routes;
        this.camera = camera;
        this.heading = 0;
        this.nextHeading = 0;
        this.state = 'heading';
        this.speed = WALLSIZE/20;
        this.stepCount = 0;
        this.currentRoute = undefined;
        this.routePointIdx = 0;
        this.routePoint = undefined;
    }
    getNextPoint() {
        if (this.currentRoute !== undefined) {
            let nextIdx = 0;
            if ((this.routePointIdx + 1) < this.currentRoute.length) {
                nextIdx = this.routePointIdx + 1;                
            }
            return { idx: nextIdx, point: this.currentRoute[nextIdx] };
        }
        return undefined;
    }
    nextState() {
        let next = this.getNextPoint();
        if (next !== undefined) {
            this.routePoint = next.point;
            this.routePointIdx = next.idx;
        }
        if (this.routePoint.type === 'coord') {
            this.state = 'move';
            this.nextHeading = this.routePoint.o;
        }
        else {
            this.state = this.routePoint.type;
            if (this.state === 'heading') {
                this.nextHeading = this.routePoint.value;
            }
            else {
                this.stepCount = 0;
            }
        }
    }
    setRoute(routename) {
        this.currentRoute = this.routes[routename];
        this.camera.rotation.x = 0;
        this.camera.rotation.y = 0;
        this.camera.rotation.z = 0;
        this.routePointIdx = -1;
        this.nextState();        
    }
    setPosition(routepoint) {
        this.camera.position.set(routepoint.x, 0, routepoint.y);
        this.nextHeading = routepoint.o;
        this.heading = this.nextHeading;
        this.camera.rotation.y = this.heading * -(Math.PI / 2);
        //this.camera.rotation.y = this.heading * -(Math.PI/2);
    }
    update() {
        switch (this.state) {
            case 'set': {
                this.setPosition(this.routePoint.value);
                this.nextState();
            } break;
            case 'heading': {
                if ((this.heading < this.nextHeading - 0.01) || (this.heading > this.nextHeading + 0.01)) {
                    if (this.heading === 3 && this.nextHeading === 0) { this.nextHeading = 4; }
                    if (this.nextHeading > this.heading) {
                        this.heading += 0.1;
                    } else if (this.nextHeading < this.heading) {
                        this.heading -= 0.1;
                    }
                    this.camera.rotation.y = this.heading * -(Math.PI / 2);
                    return;
                }
                this.heading = Math.round(this.heading) % 4;
                this.nextHeading = this.heading;
                this.nextState();
            } break;
            case 'move': {
                switch (this.heading) {
                    case 0: this.camera.position.z -= this.speed; break;
                    case 1: this.camera.position.x += this.speed; break;
                    case 2: this.camera.position.z += this.speed; break;
                    case 3: this.camera.position.x -= this.speed; break;
                }
                this.stepCount += this.speed;
                if (this.routePoint.type === 'coord') {
                    if (this.camera.position.x === this.routePoint.x && this.camera.position.z === this.routePoint.y) {
                        this.state = 'heading';
                    }
                }
                else {
                    if ((this.stepCount/WALLSIZE) >= this.routePoint.value) {
                        this.nextState();
                    }
                }
            } break;
            case 'stop': {
                break;
            }

        }

        


    }
}
