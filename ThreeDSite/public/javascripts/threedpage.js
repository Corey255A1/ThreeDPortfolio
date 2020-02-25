import * as THREE from '/javascripts/threejs/build/three.module.js';
//import { OrbitControls } from '/javascripts/threejs/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from '/javascripts/threejs/examples/jsm/renderers/CSS3DRenderer.js';
import { Map } from './map.js';
import { CameraMover } from './camera.js';
import { Carousel } from './carousel.js';
import { Navigator } from './navigation.js';

let WALLSIZE = 1000;

let sceneGL = new THREE.Scene();
let rendererGL = new THREE.WebGLRenderer({ alpha: true } );
//rendererGL.setPixelRatio(window.devicePixelRatio);
rendererGL.setSize(window.innerWidth, window.innerHeight);
rendererGL.domElement.style.position = 'absolute';
rendererGL.domElement.style.zIndex = 10;
document.body.appendChild(rendererGL.domElement);
let geom = new THREE.PlaneBufferGeometry(11000, 11000);
let imageloader = new THREE.TextureLoader();
let texture = imageloader.load('imgs/YN.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);
let mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture });

let mesh = new THREE.Mesh(geom, mat);
mesh.position.set(5000, -400, 5000);
mesh.rotateX(-Math.PI/2);
sceneGL.add(mesh);

var cubePaths = [
    'imgs/XP.png',
    'imgs/XN.png',
    'imgs/YP.png',
    'imgs/YN.png',
    'imgs/ZN.png',
    'imgs/ZP.png'
];
let cubeloader = new THREE.CubeTextureLoader();


//cubemap.format = THREE.RGBFormat;
sceneGL.background = cubeloader.load(cubePaths);

//let geom2 = new THREE.PlaneBufferGeometry(120000, 120000);
//let mat2 = new THREE.MeshPhongMaterial({ color: 0x111144 });
//let mesh2 = new THREE.Mesh(geom2, mat2);
//mesh2.position.set(0, 1000, 0);
//mesh2.rotateX(Math.PI / 2);
//sceneGL.add(mesh2);

//let light = new THREE.DirectionalLight(0xffffff, 0.4 );

//light.position.set(0, 100, 0);

//sceneGL.add(light);

let amblight = new THREE.AmbientLight(0xffffff, 0.5);
sceneGL.add(amblight);

let scene = new THREE.Scene();
let renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = 0;
document.body.append(renderer.domElement);
let camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);

camera.position.set(0, 0, 0);

var geometry = new THREE.BoxBufferGeometry(100, 100, 100);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
sceneGL.add(cube);


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
    sceneGL.add(w.webGLObj);
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
};
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
    rendererGL.setSize(window.innerWidth, window.innerHeight);

}

//camera.position.y = 10000;
//camera.rotateX(-Math.PI / 2);

function animate() {
    carousel.animate();
    cameraMover.update();
    //camera.rotation.x = -Math.PI / 2;
    //camera.rotation.y = 0;
    //camera.rotation.z = 0;
    //camera.position.multiplyScalar(10);
    rendererGL.render(sceneGL, camera);
    //camera.position.divideScalar(10);
    renderer.render(scene, camera);
    //camera.position.y += (1);

    //camera.rotateX(0.01);
    
    requestAnimationFrame(animate);
}
animate();

