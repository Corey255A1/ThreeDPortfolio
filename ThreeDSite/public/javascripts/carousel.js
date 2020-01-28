import { CSS3DObject } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';
import * as THREE from '/javascripts/threejs/build/three.module.js';
export class Carousel {

    constructor(scene, planesize, position, rotation, overrides) {
        this.scene = scene;

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
        this.scene.add(this.group);
         
        //let wall = document.createElement("div");
        //wall.style.textAlign = "center";
        //wall.style.fontSize = '1rem';
        //wall.style.width = (500 + 2) + 'px';
        //wall.style.height = (500 + 2) + 'px';
        //wall.style.backgroundColor = 'teal';
        //let object = new CSS3DObject(wall);
        //object.position.set(0, 0, 500 - Math.cos(0) * 500);
        //object.rotation.x = 0;
        //this.scene.add(object);

        //wall = document.createElement("div");
        //wall.style.textAlign = "center";
        //wall.style.fontSize = '1rem';
        //wall.style.width = (500 + 2) + 'px';
        //wall.style.height = (500 + 2) + 'px';
        //wall.style.backgroundColor = 'yellow';
        //object = new CSS3DObject(wall);
        
        //object.rotation.x = 2 * Math.PI / 8;
        ////soh cah toa        
        //object.position.set(0, Math.sin(2 * Math.PI / 8) * 500, 500 - Math.cos(2 * Math.PI / 8) * 500);//(2 * 500) + (Math.cos(2 * Math.PI / 8)*500)/2
        //this.scene.add(object);

        //wall = document.createElement("div");
        //wall.style.textAlign = "center";
        //wall.style.fontSize = '1rem';
        //wall.style.width = (500 + 2) + 'px';
        //wall.style.height = (500 + 2) + 'px';
        //wall.style.backgroundColor = 'pink';
        //object = new CSS3DObject(wall);

        //object.rotation.x = 2*2 * Math.PI / 8;
        ////soh cah toa        
        //object.position.set(0, Math.sin(4 * Math.PI / 8)*500, 500-(Math.cos(4 * Math.PI / 8)*500));
        //this.scene.add(object);
    }

    animate() {
        this.group.rotateX((Math.PI)/500);
    }

}