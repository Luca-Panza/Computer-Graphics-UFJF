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

// Reset spheres positions and controls
function resetSpheres() {
  sphere1.position.set(-5, 0.2, -2);
  sphere2.position.set(-5, 0.2, 2);
  lerpSphere1.move = false;
  lerpSphere2.move = false;

  // Reset GUI controls and update display
  moveSphere1Control.setValue(false);
  moveSphere2Control.setValue(false);
}
// Linear interpolation control objects for spheres
const lerpSphere1 = { destination: new THREE.Vector3(5, 0.2, -2), alpha: 0.01, move: false };
const lerpSphere2 = { destination: new THREE.Vector3(5, 0.2, 2), alpha: 0.005, move: false };

// Initialize GUI controls reference
let moveSphere1Control, moveSphere2Control;

// Build GUI interface
function buildInterface() {
  let gui = new GUI();
  moveSphere1Control = gui.add(lerpSphere1, "move").name("Move Sphere 1");
  moveSphere2Control = gui.add(lerpSphere2, "move").name("Move Sphere 2");
  gui.add({ reset: resetSpheres }, "reset").name("Reset Spheres");
}

// Render loop
function render() {
  trackballControls.update();

  // Sphere movement
  if (lerpSphere1.move) sphere1.position.lerp(lerpSphere1.destination, lerpSphere1.alpha);
  if (lerpSphere2.move) sphere2.position.lerp(lerpSphere2.destination, lerpSphere2.alpha);

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

buildInterface();
render();
