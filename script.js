// Basic Three.js setup
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5).normalize();
scene.add(light);

// Cube (representing the car)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Track the state of keys
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Update key state on keydown
document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

// Update key state on keyup
document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// Cube movement
let cubeSpeed = 0.05;

function moveCube() {
    if (keys.ArrowUp) {
        cube.position.z -= cubeSpeed;
    }
    if (keys.ArrowDown) {
        cube.position.z += cubeSpeed;
    }
    if (keys.ArrowLeft) {
        cube.position.x -= cubeSpeed;
    }
    if (keys.ArrowRight) {
        cube.position.x += cubeSpeed;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    moveCube();
    renderer.render(scene, camera);
}

// Responsive canvas
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start the animation loop
animate();
