// Basic Three.js setup
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Set background color to gray
renderer.setClearColor(0x808080); // Gray color

// Create a scene
const scene = new THREE.Scene();

// Setup Orthographic Camera for 2D view
const aspectRatio = window.innerWidth / window.innerHeight;
const zoomFactor = 2; // Adjust this value to control zoom level

const camera = new THREE.OrthographicCamera(
    -aspectRatio * zoomFactor, // left
    aspectRatio * zoomFactor,  // right
    zoomFactor,                // top
    -zoomFactor,               // bottom
    0.1,                       // near plane
    10                         // far plane
);
camera.position.z = 5;

// Load map texture and create map plane
const loader = new THREE.TextureLoader();
loader.load('assets/map.svg', (texture) => {
    const mapWidth = 20;  // Width of the map
    const mapHeight = 10; // Height of the map
    const mapGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
    const mapMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const mapPlane = new THREE.Mesh(mapGeometry, mapMaterial);
    mapPlane.position.z = -1; // Ensure map is behind the car
    scene.add(mapPlane);

    // Update boundary values after the map is loaded
    mapBoundaries = {
        left: -mapWidth / 2,
        right: mapWidth / 2,
        top: mapHeight / 4.5,
        bottom: -mapHeight / 4.5
    };
}, undefined, (error) => {
    console.error('Error loading texture:', error);
});

// Create 2D Car using texture
const carWidth = 1;
const carHeight = 0.5;

// Car body texture
const carTexture = new THREE.TextureLoader().load('assets/car.png'); // Use your PNG texture here
const bodyGeometry = new THREE.PlaneGeometry(carWidth, carHeight);
const bodyMaterial = new THREE.MeshBasicMaterial({ map: carTexture, side: THREE.DoubleSide });
const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);

// Create a group to hold the car body
const carGroup = new THREE.Group();
carGroup.add(carBody);
carGroup.position.z = 0; // Ensure car is in front of the map
scene.add(carGroup);

// Track the state of keys
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// Movement and drifting variables
let velocityX = 0;
let velocityY = 0;
const acceleration = 0.003;
const friction = 0.98;
const driftFactor = 1;

// Map boundaries
let mapBoundaries = {
    left: -10,
    right: 10,
    top: 10,
    bottom: -10
};

function moveCar() {
    if (keys.ArrowUp) {
        velocityY += acceleration;
    }
    if (keys.ArrowDown) {
        velocityY -= acceleration;
    }
    if (keys.ArrowLeft) {
        velocityX -= acceleration;
    }
    if (keys.ArrowRight) {
        velocityX += acceleration;
    }

    velocityX *= driftFactor;
    velocityY *= driftFactor;

    // Update car position
    carGroup.position.x += velocityX;
    carGroup.position.y += velocityY;

    // Check and limit the car within map boundaries
    carGroup.position.x = Math.max(Math.min(carGroup.position.x, mapBoundaries.right), mapBoundaries.left);
    carGroup.position.y = Math.max(Math.min(carGroup.position.y, mapBoundaries.top), mapBoundaries.bottom);

    velocityX *= friction;
    velocityY *= friction;

    // Update car rotation to simulate movement
    const angle = Math.atan2(velocityY, velocityX);
    carGroup.rotation.z = angle;

    // Update camera position to follow the car
    camera.position.x = carGroup.position.x;
    camera.position.y = carGroup.position.y;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    moveCar();
    renderer.render(scene, camera);
}

// Responsive canvas
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera.left = -aspectRatio * zoomFactor; // Adjust zoom factor
    camera.right = aspectRatio * zoomFactor; // Adjust zoom factor
    camera.top = zoomFactor; // Adjust zoom factor
    camera.bottom = -zoomFactor; // Adjust zoom factor
    camera.updateProjectionMatrix();
});

// Start the animation loop
animate();
