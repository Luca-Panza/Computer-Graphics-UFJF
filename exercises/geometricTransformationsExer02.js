import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ,
} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(20, 20);
scene.add(plane);

const radius = 0.5;
const circleRadius = 8;
const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
const numberOfSpheres = 12;
const angleIncrement = (2 * Math.PI) / numberOfSpheres;

for (let i = 0; i < numberOfSpheres; i++) {
  const angle = i * angleIncrement;
  const x = circleRadius * Math.cos(angle);
  const z = circleRadius * Math.sin(angle);
  const sphere = new THREE.Mesh(sphereGeometry, material);
  sphere.position.set(x, radius, z);
  scene.add(sphere);
}

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}
