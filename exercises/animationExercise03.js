import * as THREE from "three";
import Stats from "../build/jsm/libs/stats.module.js";
import GUI from "../libs/util/dat.gui.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import { initRenderer, initCamera, onWindowResize, initDefaultSpotlight } from "../libs/util/util.js";

var stats = new Stats(); // To show FPS information
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(5, 5, 7)); // Init camera in this position
var trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultSpotlight(scene, new THREE.Vector3(2, 4, 2)); // Use default light

var angle = 0;
var angle2 = 0;
var speed = 0.05;
var animationOn = true; // Control if animation is on or off

// Show world axes
var axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// Base sphere
var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial({ color: "rgb(180,180,255)", shininess: "40", specular: "rgb(255,255,255)" });
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
// Set initial position of the sphere
sphere.translateX(1.0).translateY(1.0).translateZ(1.0);

// Cylinder attached to the sphere
var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
var cylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(100,255,100)" });
var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
sphere.add(cylinder);

// Second cylinder (red) attached to the first cylinder
var cylinderGeometry2 = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 25);
var cylinderMaterial2 = new THREE.MeshLambertMaterial({ color: "rgb(255,100,100)" });
var cylinder2 = new THREE.Mesh(cylinderGeometry2, cylinderMaterial2);
cylinder.add(cylinder2);

// New yellow cylinders at the tips of the red cylinder
var yellowCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.07, 1, 25);
var yellowCylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,255,0)" });
var yellowCylinder1 = new THREE.Mesh(yellowCylinderGeometry, yellowCylinderMaterial);
var yellowCylinder2 = new THREE.Mesh(yellowCylinderGeometry, yellowCylinderMaterial);
cylinder2.add(yellowCylinder1);
cylinder2.add(yellowCylinder2);

// Listen to window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

buildInterface();
render();

function rotateCylinder() {
  // Disable the automatic matrix update
  cylinder.matrixAutoUpdate = false;
  cylinder2.matrixAutoUpdate = false;
  yellowCylinder1.matrixAutoUpdate = false;
  yellowCylinder2.matrixAutoUpdate = false;

  if (animationOn) {
    angle += speed;
    angle2 += speed * 2;

    var mat4 = new THREE.Matrix4();
    cylinder.matrix.identity(); // Reset cylinder matrix
    cylinder2.matrix.identity(); // Reset second cylinder matrix
    yellowCylinder1.matrix.identity(); // Reset yellow cylinder matrix
    yellowCylinder2.matrix.identity(); // Reset yellow cylinder matrix

    // Rotation of the first cylinder (green)
    cylinder.matrix.multiply(mat4.makeRotationZ(angle));
    cylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // Move to the top of the sphere

    // Rotation of the second cylinder (red)
    cylinder2.matrix.multiply(mat4.makeRotationY(angle2));
    cylinder2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // Move to the top of the green cylinder
    cylinder2.matrix.multiply(mat4.makeRotationX(THREE.MathUtils.degToRad(90))); // Adjust orientation to match the green cylinder

    // Rotation of the yellow cylinders
    yellowCylinder1.matrix.multiply(mat4.makeRotationY(angle2));
    yellowCylinder1.matrix.multiply(mat4.makeTranslation(0.0, 0.5, 0.0)); // Move to the top of the red cylinder
    yellowCylinder1.matrix.multiply(mat4.makeRotationX(THREE.MathUtils.degToRad(90))); // Adjust orientation to match the red cylinder

    yellowCylinder2.matrix.multiply(mat4.makeRotationY(-angle2));
    yellowCylinder2.matrix.multiply(mat4.makeTranslation(0.0, -0.5, 0.0)); // Move to the bottom of the red cylinder
    yellowCylinder2.matrix.multiply(mat4.makeRotationX(THREE.MathUtils.degToRad(90))); // Adjust orientation to match the red cylinder
  }
}

function buildInterface() {
  var controls = new (function () {
    this.onChangeAnimation = function () {
      animationOn = !animationOn;
    };
    this.speed = 0.05;

    this.changeSpeed = function () {
      speed = this.speed;
    };
  })();

  // GUI interface
  var gui = new GUI();
  gui.add(controls, "onChangeAnimation", true).name("Animation On/Off");
  gui
    .add(controls, "speed", 0.05, 0.5)
    .onChange(function (e) {
      controls.changeSpeed();
    })
    .name("Change Speed");
}

function render() {
  stats.update(); // Update FPS
  trackballControls.update();
  rotateCylinder();
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}
