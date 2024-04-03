import * as THREE from "three";
import GUI from "../libs/util/dat.gui.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import { initRenderer, initDefaultSpotlight, initCamera, createGroundPlane, onWindowResize } from "../libs/util/util.js";

// Initialize scene, renderer, and camera
let scene = new THREE.Scene();
let renderer = initRenderer();
let camera = initCamera(new THREE.Vector3(3.6, 4.6, 8.2));

// Add lighting
let light = initDefaultSpotlight(scene, new THREE.Vector3(7.0, 7.0, 7.0), 300);

// Setup trackball controls for the camera
let trackballControls = new TrackballControls(camera, renderer.domElement);

// Add axes helper
let axesHelper = new THREE.AxesHelper(5);
axesHelper.translateY(0.1);
scene.add(axesHelper);

// Add ground plane
let groundPlane = createGroundPlane(10, 10, 40, 40); // width, height, resolutionW, resolutionH
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Create spheres
let sphere1 = createSphere(-5, 0.2, -2);
let sphere2 = createSphere(-5, 0.2, 2);

// Sphere creation function
function createSphere(x, y, z) {
  let geometry = new THREE.SphereGeometry(0.2, 32, 16);
  let material = new THREE.MeshPhongMaterial({ color: "red", shininess: "200" });
  let sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.position.set(x, y, z);
  scene.add(sphere);
  return sphere;
}

// Movement control objects for spheres
const moveSphere1 = { destination: 5, speed: 0.05, move: false };
const moveSphere2 = { destination: 5, speed: 0.025, move: false };

// Update spheres positions
function updateSpherePositions() {
  if (moveSphere1.move && sphere1.position.x < moveSphere1.destination) {
    sphere1.position.x += moveSphere1.speed;
  }
  if (moveSphere2.move && sphere2.position.x < moveSphere2.destination) {
    sphere2.position.x += moveSphere2.speed;
  }
}

// Initialize GUI controls
let gui = new GUI();
gui.add(moveSphere1, "move").name("Move Sphere 1");
gui.add(moveSphere2, "move").name("Move Sphere 2");
gui.add({ reset: resetSpheres }, "reset").name("Reset Spheres");

// Reset spheres positions
function resetSpheres() {
  sphere1.position.set(-5, 0.2, -2);
  sphere2.position.set(-5, 0.2, 2);
  moveSphere1.move = false;
  moveSphere2.move = false;

  // Update GUI controls
  gui.__controllers.forEach((controller) => {
    if (controller.property === "move") {
      controller.setValue(false);
    }
  });
}

// Render loop
function render() {
  trackballControls.update();

  // Update spheres positions
  updateSpherePositions();

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Listen to window resize events
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

render();
