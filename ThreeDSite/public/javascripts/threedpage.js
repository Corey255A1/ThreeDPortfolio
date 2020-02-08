import * as THREE from '/javascripts/threejs/build/three.module.js';
//import { OrbitControls } from '/javascripts/threejs/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';
import { Map } from './map.js';
import { CameraMover } from './camera.js';
import { Carousel } from './carousel.js';
import { Navigator } from './navigation.js';

let WALLSIZE = 1000;

let scene = new THREE.Scene();
let renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);
let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(0, 0, 0);



//Initialize the Map
let mapdef = [
    [3, 1, 1, 1, 1, 10, 1, 1, 1, 4],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [7, 1, 1, 0, 0, 0, 0, 0, 0, 8],
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

var projects = document.querySelectorAll("#projects > .project");
var carousel = new Carousel(WALLSIZE, { x: 5 * WALLSIZE, y: 4 * WALLSIZE }, { x: 0, y: Math.PI / 2, z: 0 }, projects);
scene.add(carousel.group);

map.mapcells[0][0][0].domElem.appendChild(document.getElementById('homesection'));
map.mapcells[0][9][1].domElem.appendChild(document.getElementById('aboutsection'));
var pointsOfInterest = {
    'HOME': { x: 0, y: 1 * WALLSIZE, o: 0 },
    'ABOUT': { x: 8 * WALLSIZE, y: 0, o: 1 },
    'PROJECTS': { x: 2 * WALLSIZE, y: 4 * WALLSIZE, o: 1 }
}; 

//Initialize Camera and Navigator
var cameraMover = new CameraMover(camera, WALLSIZE / 20);
cameraMover.doCommand({ type: 'set', value: { x: 0, y: 3 * WALLSIZE, o: 0 } });
cameraMover.update();
var nav = new Navigator(map);
cameraMover.routeStopped = (routeName) => {
    switch (routeName) {
        case "HOME": break;
        case "ABOUT": break;
        case "PROJECTS": carousel.enabled = true; break;
    }
}
cameraMover.setRoute(nav.findRoute(cameraMover.getPosition(), pointsOfInterest['HOME']));

//Connect the Buttons
document.querySelectorAll(".navigation > button").forEach((btn) => {
    btn.addEventListener("click", () => {
        console.log(btn.textContent);
        carousel.enabled = false;
        let route = nav.findRoute(cameraMover.getPosition(), pointsOfInterest[btn.textContent]);
        cameraMover.setRoute(route, btn.textContent);
    });
});

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    carousel.animate();
    cameraMover.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

