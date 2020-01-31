import { OrbitControls } from '/javascripts/threejs/examples/jsm/controls/OrbitControls.js';
//import { FirstPersonControls } from '/javascripts/threejs/examples/jsm/controls/FirstPersonControls.js';
import { CameraMover, Map, makeCommandPoint, makeCoordinatePoint, WALLSIZE } from './map.js';
import { Carousel } from './carousel.js';






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


var controls = new OrbitControls(camera, renderer.domElement);
//var controls = new FirstPersonControls(camera, renderer.domElement);
