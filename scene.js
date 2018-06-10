//if (!Detector.webgl) Detector.addGetWebGLMessage();
//FIELDS
var mouseX = 0,
    mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
//SCENE
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

//CAM
var camera = new THREE.PerspectiveCamera(75, (window.innerWidth / 2) / (window.innerHeight / 2), 1, 1000);
camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

//RENDERERER
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//CAM CONTROLS
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//DIRECTIONAL LIGHT
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.88);
directionalLight.position.set(-80, 80, 80);
directionalLight.lookAt(new THREE.Vector3(0, 0, 0));

//SPHERE
const RADIUS = 50;
const SEGMENTS = 16;
const RINGS = 16;
const sphereMaterial =
    new THREE.MeshLambertMaterial({
        color: 0xff00ff,
    });

const sphere = new THREE.Mesh(

    new THREE.SphereGeometry(
        RADIUS,
        SEGMENTS,
        RINGS),

    sphereMaterial);

sphere.position.z = -100;
//POINT LIGHT
const pointLight =
    new THREE.PointLight(0xFFFFFF);

pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

var geometry = new THREE.BufferGeometry();

var vertices = [];

for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
        for (var z = 0; z < 0; z++) {
            vertices.push(new THREE.Vector3(x, y, z));
        }
    }
}

geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
var sprite = new THREE.TextureLoader().load('./particle.png');
var material = new THREE.PointsMaterial({
    size: 35,
    sizeAttenuation: false,
    map: sprite,
    alphaTest: 0.5,
    transparent: false,
});
var particles = new THREE.Points(geometry, material);

scene.add(pointLight);
scene.add(particles);
scene.add(sphere);
scene.add(directionalLight);

//EVENTS

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);
document.addEventListener('touchmove', onDocumentTouchMove, false);
//
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
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}


function update() {
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

(function gameLoop() {
    requestAnimationFrame(gameLoop);

    update();
    render();
})();

/* pick stuff here
// var geometry = new THREE.BufferGeometry();

// var vertices = [];

// for (var x = 0; x < 10; x++) {
//     for (var y = 0; y < 10; y++) {
//         for (var z = 0; z < 0; z++) {
//             vertices.push(x, y, z);
//         }
//     }
// }

// geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// var sprite = new THREE.TextureLoader().load('./particle.png');
// var material = new THREE.PointsMaterial({
//     size: 35,
//     sizeAttenuation: false,
//     map: sprite,
//     alphaTest: 0.5,
//     transparent: true,
// });
// var particles = new THREE.Points(geometry, material);
// var light1 = new THREE.DirectionalLight(0xffffff);
// light1.position.set(1, 1, 1);
// var light2 = new THREE.DirectionalLight(0x002288);
// light2.position.set(-1, -1, -1);

// var light3 = new THREE.AmbientLight(0x222222);

// scene.add(directionalLight);
// scene.add(light1);
// scene.add(light2);
// scene.add(light3);
// scene.add(particles);
// scene.add(camHelper);
*/