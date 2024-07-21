import * as THREE from "three";
import GUI from "../libs/util/dat.gui.module.js";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { initRenderer, setDefaultMaterial, initDefaultBasicLight, onWindowResize, createLightSphere } from "../libs/util/util.js";
import { loadLightPostScene } from "../libs/util/utilScenes.js";

let scene, renderer, camera, orbit, material;
scene = new THREE.Scene(); // Create main scene
material = setDefaultMaterial();
renderer = initRenderer(); // View function in util/utils
renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(5, 5, 5);
camera.up.set(0, 1, 0);
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

let positions = [
  { x: 4.0, y: 1.0, z: 0.0 },
  { x: 2.0, y: 1.0, z: 2.0 },
  { x: 2.0, y: 1.0, z: -2.0 },
];

let cubeGeometry = new THREE.BoxGeometry(0.5, 2.0, 0.5);

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(3);
axesHelper.visible = false;
scene.add(axesHelper);

// Set dir light
let dirPosition = new THREE.Vector3(-1, 3, -1);
const dirLight = new THREE.DirectionalLight("white", 0.2);
dirLight.position.copy(dirPosition);
dirLight.castShadow = true;
scene.add(dirLight);

// Set ambient light
let ambientColor = "rgb(80,80,80)";
const ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

// Set spot light
let spotPosition = new THREE.Vector3(1.0, 1.0, 0.0);
const spotLight = new THREE.SpotLight("white", 1);
spotLight.position.copy(spotPosition);
spotLight.angle = THREE.MathUtils.degToRad(120);
spotLight.castShadow = true;
spotLight.target.position.set(2, 0, 0);
spotLight.target.updateMatrixWorld();
scene.add(spotLight);

// Initially hide ambient and spot lights
ambientLight.visible = false;
spotLight.visible = false;

// Load default scene
loadLightPostScene(scene);

for (let i = 0; i < positions.length; i++) {
  let cube = new THREE.Mesh(cubeGeometry, material);
  cube.position.set(positions[i].x, positions[i].y, positions[i].z);
  cube.castShadow = true; // Indica que o cubo projetará sombras
  cube.receiveShadow = true; // Indica que o cubo receberá sombras
  scene.add(cube);
}

//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface() {
  // GUI interface
  let gui = new GUI();

  const lightOptions = {
    "Directional Light": () => setLightVisibility(true, false, false),
    "Ambient Light": () => setLightVisibility(false, true, false),
    "Spot Light": () => setLightVisibility(false, false, true),
  };

  gui.add(lightOptions, "Directional Light");
  gui.add(lightOptions, "Ambient Light");
  gui.add(lightOptions, "Spot Light");
}

function setLightVisibility(dir, ambient, spot) {
  dirLight.visible = dir;
  ambientLight.visible = ambient;
  spotLight.visible = spot;
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
