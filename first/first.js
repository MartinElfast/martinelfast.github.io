//if ( !Detector.webgl ) Detector.addGetWebGLMessage();

import { OrbitControls } from 'https://unpkg.com/three@<VERSION>/examples/jsm/controls/OrbitControls.js';

//TODO: 

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          FIELDS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

let mouseX = 0,
    mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let clock = new THREE.Clock();


let deltaTime = 0;
const INV_MAX_FPS = 1 / 60; //multiplicative inverse of desired fps, used for Physics Update

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SCENE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          CAM
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const camera = new THREE.PerspectiveCamera( 75, ( windowHalfX ) / ( windowHalfY ), 1, 10000 );
camera.position.z = 150;
camera.position.y = 150;
camera.position.x = -50;
camera.lookAt( new THREE.Vector3( 0, 10, -1000 ) );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          RENDERERER
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          STATS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const stats = new Stats();
stats.showPanel( 0 ); // diplay modes for stats graph; 0 = fps,1 =  ms, 2 = mb
document.body.appendChild( stats.dom );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          CAM CONTROLS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const controls = new OrbitControls( camera, renderer.domElement );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SCENE LIGHTS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          DIRECTIONAL LIGHT
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const directionalLight = new THREE.DirectionalLight( 0xFF00AA, 0.98 );
directionalLight.position.set( -80, 180, 0 );
directionalLight.lookAt( new THREE.Vector3( 0, 0, 0 ) );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          POINT LIGHT BLUE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const pointLight2 = new THREE.PointLight( 0x0000FF );
pointLight2.intensity = 2;
pointLight2.position.x = -100;
pointLight2.position.y = 0;
pointLight2.position.z = -50;

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          POINT LIGHT GREEN
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const pointLight = new THREE.PointLight( 0xAAFF00 );
pointLight.intensity = 1;
pointLight.position.x = 200;
pointLight.position.y = -80;
pointLight.position.z = 0;

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SCENE OBJECTS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SPHERE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const radius = 88;
const segments = 8;
const rings = 5;
const sphereMaterial =
    new THREE.MeshPhongMaterial( {
        color: 0xFFFFFF,
    } );

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
        radius,
        segments,
        rings ),
    sphereMaterial );
sphere.position.z = -100;
sphere.position.x = 50;

( sphere.init = () => {
    sphere.matrixAutoUpdate = true;
} )();

sphere.update = ( timeStep ) => {
    sphere.rotation.x = sphere.rotation.y += Math.sin( 0.8 * timeStep );
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          GRID
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const size = 500,
    step = 100;
const geometry = new THREE.Geometry();
for ( var i = -size; i <= size; i += step ) {

    geometry.vertices.push( new THREE.Vector3( -size, 0, i ) );
    geometry.vertices.push( new THREE.Vector3( size, 0, i ) );

    geometry.vertices.push( new THREE.Vector3( i, 0, -size ) );
    geometry.vertices.push( new THREE.Vector3( i, 0, size ) );
}

const material = new THREE.LineBasicMaterial( {
    color: 0x008800,
    opacity: 1,
    linewidth: 3
} );

const grid = new THREE.LineSegments( geometry, material ); //Third optional parameter is "mode" with which you can switch between the Line and LineSegment types.

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          Moving random vertex cube
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

scene.add( new THREE.Mesh( new THREE.CubeGeometry( 28, 28, 28 ), new THREE.MeshNormalMaterial() ) ); //Unnamed cube, experiment with manipulating mesh runtime.

let unNamedCube = scene.children[0];

( unNamedCube.init = () => {
    unNamedCube.material.wireframe = true;
} )();

unNamedCube.update = () => {
    //Selects a random vertex gives it a new random position
    unNamedCube.geometry.vertices[pickRandomVertex( unNamedCube )]
        .set( randomizeAndFloor( 24 ), randomizeAndFloor( 24 ), randomizeAndFloor( 24 ) );
    unNamedCube.geometry.verticesNeedUpdate = true
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          FUNCTIONS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

function pickRandomVertex( obj ) {
    return Math.min( Math.floor( Math.random() * obj.geometry.vertices.length ), obj.geometry.vertices.length - 1 );
}

function randomizeAndFloor( chaosAmount ) {
    return Math.floor( Math.random() * chaosAmount );
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          EVENTS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'touchmove', onDocumentTouchMove, false );
window.addEventListener( 'resize', onWindowResize, false );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          EVENT IMPL
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          POPULATE SCENE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

scene.add( grid );
scene.add( pointLight );
scene.add( pointLight2 );
scene.add( sphere );
scene.add( directionalLight );

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          CORE FUNCTIONS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

function update( timeStep ) { //state updates and logic
    controls.update( timeStep );
    stats.update( timeStep );
    unNamedCube.update( timeStep );
    sphere.update( timeStep );
}

function render() { //render state changes
    renderer.render( scene, camera );
}

( function loop() {
    requestAnimationFrame( loop );

    update( clock.getDelta() );

    render();
} )();
/*

// put below in the loop function
    deltaTime += clock.getDelta();
    while (deltaTime >= INV_MAX_FPS) {
        update(INV_MAX_FPS);
        deltaTime -= INV_MAX_FPS;
    }
//and this call in the update function
    KeyboardControls.update(timeStep);

    
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          INPUT HANDLING
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

function KeyboardControls(object, options) {
    this.object = object;
    options = options || {};
    this.domElement = options.domElement || document;
    this.moveSpeed = options.moveSpeed || 1;
    //this.jumpSpeed = options.jumpSpeed || 1; 
    this.domElement.addEventListener('keydown', this.onKeyDown.bind(this), false);
    this.domElement.addEventListener('keyup', this.onKeyUp.bind(this), false);

}
//KeyboardControls(camera, new Object(name = 'options',moveSpeed = 2));
KeyboardControls = {
        update: function() {
            if (this.moveForward) this.object.translateZ(-this.moveSpeed);
            if (this.moveBackward) this.object.translateZ(this.moveSpeed);
            if (this.moveLeft) this.object.translateX(-this.moveSpeed);
            if (this.moveRight) this.object.translateX(this.moveSpeed);
            //if (this.jump) this.object.translateX(this.jumpSpeed);
        },
        onKeyDown: function(event) {
            switch (event.keyCode) {
                case 38: // Up arrow key
                case 87: // W key
                    this.moveForward = true;
                    break;
                case 40: // Down arrow key
                case 83: // S key
                    this.moveBackward = true;
                    break;
                case 37: // Left arrow key
                case 65: // A key
                    this.moveLeft = true;
                    break;
                case 39: // Right arrow key
                case 68: // D key
                    this.moveRight = true;
                    break;
                    //case 32: // Space key
                    //this.jump = player.jump();
                    //break;
            }
        },
        onKeyUp: function(event) {
            switch (event.keyCode) {
                case 38:
                case 87:
                    this.moveForward = false;
                    break;
                case 37:
                case 65:
                    this.moveLeft = false;
                    break;
                case 40:
                case 83:
                    this.moveBackward = false;
                    break;
                case 39:
                case 68:
                    this.moveRight = false;
                    break;
                    //case 32: // Space key
                    //this.jump = player.jump();
                    //break;
            }
        }
    }
    //_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
    //          LATEST EXPERIMENTS - UNSORTED CODE
    //_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

*/
