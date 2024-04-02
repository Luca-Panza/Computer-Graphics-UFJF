import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";
import { TeapotGeometry } from "../build/jsm/geometries/TeapotGeometry.js";
import { initRenderer, initDefaultSpotlight, createGroundPlaneXZ, SecondaryBox, onWindowResize } from "../libs/util/util.js";

let scene, renderer, light, camera, keyboard;
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // View function in util/utils
light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0)); // Use default light
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);
keyboard = new KeyboardState();

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create objects
createTeapot(2.0, 0.4, 0.0, Math.random() * 0xffffff);
createTeapot(0.0, 0.4, 2.0, Math.random() * 0xffffff);
createTeapot(0.0, 0.4, -2.0, Math.random() * 0xffffff);

let camPos = new THREE.Vector3(3, 4, 8);
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
var message = new SecondaryBox("");

// Main camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
camera.lookAt(camLook);

render();

// Create a cameraHolder and add the camera to it
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

// Update the initial position and orientation of the cameraHolder
cameraHolder.position.set(0.0, 0.5, 0.0);
camera.lookAt(new THREE.Vector3(0.0, 0.5, -1.0));

function keyboardUpdate() {
  keyboard.update();

  var translationSpeed = 0.1;
  var rotationSpeed = (1 * Math.PI) / 180; // Convert degrees to radians

  // Translations for cameraHolder
  if (keyboard.pressed("W")) cameraHolder.translateZ(-translationSpeed); // Move forward
  if (keyboard.pressed("S")) cameraHolder.translateZ(translationSpeed); // Move backward
  if (keyboard.pressed("A")) cameraHolder.translateX(-translationSpeed); // Move left
  if (keyboard.pressed("D")) cameraHolder.translateX(translationSpeed); // Move right

  // Rotations for cameraHolder
  if (keyboard.pressed("left")) cameraHolder.rotateY(rotationSpeed); // Rotate left
  if (keyboard.pressed("right")) cameraHolder.rotateY(-rotationSpeed); // Rotate right
  if (keyboard.pressed("up")) cameraHolder.rotateX(-rotationSpeed); // Rotate up
  if (keyboard.pressed("down")) cameraHolder.rotateX(rotationSpeed); // Rotate down
  if (keyboard.pressed("Q")) cameraHolder.rotateZ(rotationSpeed); // Tilt left
  if (keyboard.pressed("E")) cameraHolder.rotateZ(-rotationSpeed); // Tilt right

  // No need to call updateCamera here if we are not changing camera's position directly
}

function createTeapot(x, y, z, color) {
  var geometry = new TeapotGeometry(0.5);
  var material = new THREE.MeshPhongMaterial({ color, shininess: "200" });
  material.side = THREE.DoubleSide;
  var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(x, y, z);
  scene.add(obj);
}

function render() {
  requestAnimationFrame(render);
  keyboardUpdate();
  renderer.render(scene, camera); // Render scene
}
