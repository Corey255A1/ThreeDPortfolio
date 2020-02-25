//WunderVision 2020
//A 3D Carousel of DIVs using Three.JS
import { CSS3DObject } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';
import * as THREE from '/javascripts/threejs/build/three.module.js';
export class Carousel {

    constructor(planesize, position, rotation, overrides) {
        this.angle = Math.PI / 4;
        this.planesize = planesize;
        this.circlesize = (this.planesize / 2) / Math.tan(this.angle / 2);

        this.group = new THREE.Group();
        let p = 0;
        for (let r = 0; r < 2 * Math.PI; r += this.angle) {
            let wall = document.createElement("div");
            wall.style.textAlign = "center";
            wall.style.fontSize = '1rem';
            wall.style.width = (this.planesize) + 'px';
            wall.style.height = (this.planesize) + 'px';
            wall.style.backgroundColor = 'teal';
            if (overrides.length > p) {
                wall.appendChild(overrides[p]);
            }
            let object = new CSS3DObject(wall);
            object.position.set(0, Math.sin(r) * this.circlesize, Math.cos(r - Math.PI) * this.circlesize);
            object.rotation.x = r;
            object.rotation.y = Math.PI;
            this.group.add(object);
            p++;
        }
        this.group.position.set(position.x, 0, position.y);
        this.group.rotateY(rotation.y);
        this.enabled = false;
        this.freespin = false;
        window.addEventListener("wheel", (e) => { this.scrollWheel(e); });
    }

    scrollWheel(e) {
        if (this.enabled) {
            console.log(e.deltaY);
            this.group.rotateX(e.deltaY * Math.PI / 100);
        }
    }

    animate() {
        if (this.freespin) {
            this.group.rotateX((Math.PI) / 500);
        }
    }

}