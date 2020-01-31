import * as THREE from '/javascripts/threejs/build/three.module.js';
//import { OrbitControls } from '/javascripts/threejs/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';
import { Map } from './map.js';
import { CameraMover } from './camera.js';
import { Carousel } from './carousel.js';

let WALLSIZE = 500;

let scene = new THREE.Scene();
let renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);
let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(0, 0, 0);

var projects = document.querySelectorAll("#projects > .project");

var carousel = new Carousel(scene, WALLSIZE, { x: 5 * WALLSIZE, y: 4 * WALLSIZE }, { x: 0, y: Math.PI / 2, z: 0 }, projects);

let mapdef = [
    [3, 1, 1, 1, 1, 10, 1, 1, 1, 4],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [7, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [6, 1, 1, 1, 1, 9, 1, 1, 1, 5]
];


var map = new Map(mapdef, WALLSIZE, WALLSIZE);
map.walls.forEach((w) => {
    scene.add(w.threejsObj);
});

map.mapcells[0][0][0].domElem.appendChild(document.getElementById('homesection'));
map.mapcells[0][9][1].domElem.appendChild(document.getElementById('aboutsection'));

function makeCommandPoint(command, value) {
    return { type: command, value: value };
}

let testroute = [
    {
        type: 'set', value: { x: 0, y: 0, o: 0 }
    },
    makeCommandPoint('heading', 1),
    makeCommandPoint('move', 9 * WALLSIZE),
    makeCommandPoint('heading', 2),
    makeCommandPoint('move', 9 * WALLSIZE),
    makeCommandPoint('heading', 3),
    makeCommandPoint('move', 9 * WALLSIZE),
    makeCommandPoint('heading', 0),
    makeCommandPoint('move', 5 * WALLSIZE),
    makeCommandPoint('heading', 1),
    makeCommandPoint('move', 5 * WALLSIZE)
]

var cameraMover = new CameraMover(camera, WALLSIZE / 20);
//cameraMover.doCommand({ type: 'set', value: { x: 2500, y: 2500, o: 1 } });
cameraMover.setRoute(testroute);
//var controls = new OrbitControls(camera, renderer.domElement);
//cameraMover.setRoute("PROJECTS");

document.querySelectorAll(".navigation > button").forEach((btn) => {
    btn.addEventListener("click", () => {
        console.log(btn.textContent);
        //cameraMover.setRoute(btn.textContent);
    });
});

function animate() {
    //object.rotation.y += 0.1;
    //camera.rotation.y += 0.01;
    carousel.animate();
    //controls.update(0.1);
    cameraMover.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}
animate();

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}