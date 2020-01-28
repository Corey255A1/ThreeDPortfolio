import * as THREE from '/javascripts/threejs/build/three.module.js';
import { CSS3DRenderer } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';
//import { OrbitControls } from '/javascripts/threejs/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from '/javascripts/threejs/examples/jsm/controls/FirstPersonControls.js';
import { CameraMover, Map, makeCommandPoint, makeCoordinatePoint, WALLSIZE } from './map.js';
import { Carousel } from './carousel.js';
let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(0, 0, 0);
let scene = new THREE.Scene();
let renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);


let map = [
    ['3-0:home', 1, 1, 1, 1, 10, 1, 1, 1, '4-1:about'],
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

var pageMappings = {
    home: document.getElementById('homesection'),
    about: document.getElementById('aboutsection')
};

var Routes = {
    HOME: [
        makeCommandPoint('set', { x: 0 * WALLSIZE, y: 1 * WALLSIZE, o: 0 }),
        makeCommandPoint('stop', 0)
    ],
    ABOUT: [
        makeCommandPoint('set', { x: 8 * WALLSIZE, y: 0 * WALLSIZE, o: 1 }),
        makeCommandPoint('stop', 0)
    ],
    PROJECTS: [
        makeCommandPoint('set', { x: 2 * WALLSIZE, y: 4 * WALLSIZE, o: 1 }),
        makeCommandPoint('stop', 0)
    ],
    ROAM: [
        makeCommandPoint('set', { x: 0, y: 1 * WALLSIZE, o: 0 }),
        makeCoordinatePoint(0, 0, 1),
        makeCoordinatePoint(9, 0, 2),
        makeCoordinatePoint(9, 9, 3),
        makeCoordinatePoint(0, 9, 0),
        makeCoordinatePoint(0, 4, 1),
        makeCommandPoint('move', 2)//,
        //new CommandPoint('stop', 0)
    ],
    Roaming: [
        makeCommandPoint('heading', 1),
        makeCommandPoint('move', 9),
        makeCommandPoint('heading', 2),
        makeCommandPoint('move', 9),
        makeCommandPoint('heading', 3),
        makeCommandPoint('move', 9),
        makeCommandPoint('heading', 0),
        makeCommandPoint('move', 5)
    ]
};

var projects = document.querySelectorAll("#projects > .project");

var carousel = new Carousel(scene, WALLSIZE, { x: 5 * WALLSIZE, y: 4 * WALLSIZE }, { x: 0, y: Math.PI / 2, z: 0 }, projects);

var mapcontroller = new Map(map, scene, pageMappings);
var cameraMover = new CameraMover(camera, Routes);
cameraMover.setRoute("PROJECTS");

document.querySelectorAll(".navigation > button").forEach((btn) => {
    btn.addEventListener("click", () => {
        console.log(btn.textContent);
        cameraMover.setRoute(btn.textContent);
    });
});

//const aboutBtn = document.getElementById("about");
//const homeBtn = document.getElementById("home");

//aboutBtn.addEventListener("click", () => {
//    cameraMover.setRoute("About");
//});
//homeBtn.addEventListener("click", () => {
//    cameraMover.setRoute("Home");
//});


//let elm = document.createElement("p");
//elm.style.backgroundColor="blue";
//elm.textContent = "WUNDERVISION";
//let object = new CSS3DObject( elm );
//object.position.set(100, -15, 100);
//object.rotation.y = -Math.PI / 2;
//scene.add(object);

//var controls = new OrbitControls(camera, renderer.domElement);
var controls = new FirstPersonControls(camera, renderer.domElement);
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