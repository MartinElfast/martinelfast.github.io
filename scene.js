//if (!Detector.webgl) Detector.addGetWebGLMessage();
//FIELDS
let mouseX = 0,
    mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
//SCENE
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

//CAM
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / 2) / (window.innerHeight / 2), 1, 10000);
camera.position.z = 80;
camera.position.y = 80;
camera.lookAt(new THREE.Vector3(0, 0, -1000));

//RENDERERER
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//STATS
const stats = new Stats();
stats.showPanel(0); //fps, ms, mb
document.body.appendChild(stats.dom);

//CAM CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);

//DIRECTIONAL LIGHT
const directionalLight = new THREE.DirectionalLight(0xff0000, 0.88);
directionalLight.position.set(-80, 180, 0);
directionalLight.lookAt(new THREE.Vector3(0, 0, 0));

//SPHERE
const radius = 50;
const segments = 16;
const rings = 16;
const sphereMaterial =
    new THREE.MeshLambertMaterial({
        color: 0xff00ff,
    });

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
        radius,
        segments,
        rings),
    sphereMaterial);
sphere.position.z = -100;
sphere.position.x = 50;

//POINT LIGHT
const pointLight = new THREE.PointLight(0x0000FF);
pointLight.intensity = 1;
pointLight.position.x = -100;
pointLight.position.y = -50;
pointLight.position.z = -100;

//GRID
const size = 500,
    step = 100;
const geometry = new THREE.Geometry();
for (var i = -size; i <= size; i += step) {

    geometry.vertices.push(new THREE.Vector3(-size, 0, i));
    geometry.vertices.push(new THREE.Vector3(size, 0, i));

    geometry.vertices.push(new THREE.Vector3(i, 0, -size));
    geometry.vertices.push(new THREE.Vector3(i, 0, size));
}

const material = new THREE.LineBasicMaterial({ color: 0x008800, opacity: 1, linewidth: 3 });

const line = new THREE.LineSegments(geometry, material); //Third parameter is "mode" with which you can switch between the Line and LineSegment types.
scene.add(line);
// var geometry = new THREE.BufferGeometry();
// var vertices = [];

// for (var x = 0; x < 10; x++) {
//     for (var y = 0; y < 10; y++) {
//         for (var z = 0; z < 0; z++) {
//             this.vertices.add(new THREE.Vector3(x, y, z));
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
//     transparent: false,
// });
// var particles = new THREE.Points(geometry, material);
//scene.add(particles);
scene.add(pointLight);

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


function update() { //state changes, logic
    controls.update();
    stats.update();
}

function render() { //render changes
    renderer.render(scene, camera);
}

(function loop() {
    requestAnimationFrame(loop);

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