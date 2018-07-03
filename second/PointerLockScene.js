if (!Detector.webgl) Detector.addGetWebGLMessage();

//TODO: 

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          FIELDS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

let mouseX = 0,
    mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const clock = new THREE.Clock();
let deltaTime = 0;
const INV_MAX_FPS = 1 / 60; //multiplicative inverse of desired fps, used for Physics Update


const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SCENE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          CAM
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const camera = new THREE.PerspectiveCamera(75, (windowHalfX) / (windowHalfY), 1, 10000);

// camera.position.x = -600;
// camera.position.y = 400;
// camera.position.z = 500;


//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          RENDERERER
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          STATS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const stats = new Stats();
stats.showPanel(0); // diplay modes for stats graph; 0 = fps,1 =  ms, 2 = mb
document.body.appendChild(stats.dom);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          CAM CONTROLS / POINTERLOCK
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

let controls = new THREE.PointerLockControls(camera);

let controlsEnabled = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let objects = [];
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let vertex = new THREE.Vector3();
let color = new THREE.Color();

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

scene.add(controls.getObject());

if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function(event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = 'block';
            instructions.style.display = '';
        }
    };
    var pointerlockerror = function(event) {
        instructions.style.display = '';
    };
    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
    instructions.addEventListener('click', function(event) {
        instructions.style.display = 'none';
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
    }, false);
} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

var onKeyDown = function(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true;
            break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;
    }
};
var onKeyUp = function(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }
};
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

prevTime = performance.now();
controls.movementSpeed = 5;
controls.lookSpeed = 0.2;
controls.update = () => {

    if (controlsEnabled === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;
        var intersections = raycaster.intersectObjects(objects);
        var onObject = intersections.length > 0;
        var time = performance.now();
        var delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * controls.movementSpeed * delta;
        velocity.z -= velocity.z * controls.movementSpeed * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions, as in strafing and moving forward at the same time does not have an additive effect on movementspeed
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);
        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        prevTime = time;
    }
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SCENE LIGHTS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          DIRECTIONAL LIGHT
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const directionalLight = new THREE.DirectionalLight(0xff0000, 0.88);
directionalLight.position.set(-80, 180, 0);
directionalLight.lookAt(new THREE.Vector3(0, 0, 0));

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          POINT LIGHT
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const pointLight = new THREE.PointLight(0x0000FF);
pointLight.intensity = 1;
pointLight.position.x = -100;
pointLight.position.y = 0;
pointLight.position.z = -100;

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SCENE OBJECTS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          GRID
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

const size = 5000,
    step = 100;
const geometry = new THREE.Geometry();

for (var i = -size; i <= size; i += step) {

    geometry.vertices.push(new THREE.Vector3(-size, 0, i));
    geometry.vertices.push(new THREE.Vector3(size, 0, i));

    geometry.vertices.push(new THREE.Vector3(i, 0, -size));
    geometry.vertices.push(new THREE.Vector3(i, 0, size));
}

const material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    opacity: 1,
    linewidth: 3
});

const grid = new THREE.LineSegments(geometry, material); //Third optional parameter is "mode" with which you can switch between the Line and LineSegment types.
const smallgrid_size = 5000,
    smallgrid_step = 10;
const smallgrid_geometry = new THREE.Geometry();

for (var i = -smallgrid_size; i <= smallgrid_size; i += smallgrid_step) {
    if (i % 100 == 0) { continue };
    smallgrid_geometry.vertices.push(new THREE.Vector3(-smallgrid_size, 0, i));
    smallgrid_geometry.vertices.push(new THREE.Vector3(smallgrid_size, 0, i));

    smallgrid_geometry.vertices.push(new THREE.Vector3(i, 0, -smallgrid_size));
    smallgrid_geometry.vertices.push(new THREE.Vector3(i, 0, smallgrid_size));
}

const smallgrid_material = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    opacity: 1,
    linewidth: 1
});

const smallgrid = new THREE.LineSegments(smallgrid_geometry, smallgrid_material);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          SCNENE EVENTS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);
document.addEventListener('touchmove', onDocumentTouchMove, false);
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}


//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          EXPERIMENT
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/



//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          POPULATE SCENE
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

scene.add(grid);
scene.add(pointLight);
scene.add(directionalLight);

scene.add(smallgrid);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//          CORE FUNCTIONS
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/


function update(timeStep) { //state updates and logic
    controls.update();
    stats.update(timeStep);
}

function render() { //render state changes
    renderer.render(scene, camera);
}

(function loop() {
    requestAnimationFrame(loop);

    update(clock.getDelta());

    render();
})();