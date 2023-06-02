// Imports ----------------------------
import "./style.css";

import * as THREE from "three";

import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// ------------------------------------

// Init Setup -------------------------
const scene = new THREE.Scene();
const render = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
// ------------------------------------

// Resize Handler ---------------------

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  render.setSize(sizes.width, sizes.height);
  render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// ------------------------------------


// Camera Setup -----------------------
var camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
var camPos = 1;

function camSetup() {
  camera.position.set(0, 0, 5.3);
}

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyC":
      if (camPos == 1) {
        // Camera 2 - Longe Cima
        scene.remove(camera);
        camera = new THREE.OrthographicCamera(
          window.innerWidth / -10,
          window.innerWidth / 10,
          window.innerHeight / 10,
          window.innerHeight / -10,
          1,
          100000
        );
        camera.position.set(0, 0, 7);
        scene.add(camera);
        camPos = 2;
      } else if (camPos == 2) {
        // Camera 1 - Perto Tras
        scene.remove(camera);
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          10000
        );
        camera.position.set(0, 0, 0);
        scene.add(camera);
        camPos = 1;
      }
      break;
  }
});

// ------------------------------------

// Render Setup -----------------------

render.setPixelRatio(window.devicePixelRatio);
render.setSize(window.innerWidth, window.innerHeight);
render.render(scene, camera);

// ------------------------------------

// Scenario ---------------------------
class Box extends THREE.Mesh {
  constructor({
    width,
    height,
    depth,
    texture = "",
    velocity = { x: 0, y: 0, z: 0 },
    position = { x: 0, y: 0, z: 0 },
  }) {
    super(new THREE.BoxGeometry(width, height, depth));

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
  }
}

function scenarioSetup() {
  // Skybox ---------------------------
  let materialArray = [];

  // Load das texturas
  let texture_ft = new THREE.TextureLoader().load(
    "assets/textures/skybox/meadow_ft.jpg"
  );
  let texture_bk = new THREE.TextureLoader().load(
    "assets/textures/skybox/meadow_bk.jpg"
  );
  let texture_up = new THREE.TextureLoader().load(
    "assets/textures/skybox/meadow_up.jpg"
  );
  let texture_dn = new THREE.TextureLoader().load(
    "assets/textures/skybox/meadow_dn.jpg"
  );
  let texture_rt = new THREE.TextureLoader().load(
    "assets/textures/skybox/meadow_rt.jpg"
  );
  let texture_lf = new THREE.TextureLoader().load(
    "assets/textures/skybox/meadow_lf.jpg"
  );

  // Basic Material Para n precisar de luz para se ver
  materialArray.push(new THREE.MeshPhongMaterial({ map: texture_ft }));
  materialArray.push(new THREE.MeshPhongMaterial({ map: texture_bk }));
  materialArray.push(new THREE.MeshPhongMaterial({ map: texture_up }));
  materialArray.push(new THREE.MeshPhongMaterial({ map: texture_dn }));
  materialArray.push(new THREE.MeshPhongMaterial({ map: texture_rt }));
  materialArray.push(new THREE.MeshPhongMaterial({ map: texture_lf }));

  // Ver o interior do cubo
  for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

  let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  let skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
  // ----------------------------------

  // Road -----------------------------
  const road = new Box({
    width: 5,
    height: 0.5,
    depth: 50,
    position: { x: 0, y: -1.5, z: 0 },
  });
  const roadTexture = new THREE.TextureLoader().load(
    "./assets/textures/road.jpg"
  );
  const roadMaterial = new THREE.MeshPhongMaterial({ map: roadTexture });
  road.material = roadMaterial;
  road.material.map.wrapS = THREE.RepeatWrapping;
  road.material.map.wrapT = THREE.RepeatWrapping;
  road.material.map.repeat.set(3, 40);
  scene.add(road);
  // ----------------------------------
}
// ------------------------------------

// Light ------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.075);

const directionalLight = new THREE.DirectionalLight(0xfae9b8, 0.25);
directionalLight.position.set(0, 5, 0);

const pointLight = new THREE.PointLight(0xe79f8c, 1, 5, 0.3);
pointLight.position.set(-3, 2, -5);

function lightSetup() {
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(pointLight);
}

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyI": // Ambient Light
      if (ambientLight.intensity == 0) {
        // Liga a luzi
        ambientLight.intensity = 0.075;
      } else {
        // Desliga a luz
        ambientLight.intensity = 0;
      }
      break;
    case "KeyO": // Directional Light
      if (directionalLight.intensity == 0) {
        // Liga a luzi
        directionalLight.intensity = 0.25;
      } else {
        // Desliga a luz
        directionalLight.intensity = 0;
      }
    break;
      case "KeyP": // Point Light
      if (pointLight.intensity == 0) {
        // Liga a luzi
        pointLight.intensity = 0.3;
      } else {
        // Desliga a luz
        pointLight.intensity = 0;
      }
      break;
  }
});

// ------------------------------------

// Test Model -------------------------

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshNormalMaterial();
const capi = new THREE.Mesh(boxGeometry, boxMaterial);
capi.position.set(0, -0.5, 3);
//scene.add(capi);

// ------------------------------------

// Font Test---------------------------

const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();

ttfLoader.load("assets/fonts/Bungee-Regular.ttf", (json) => {
  // First parse the font.
  const BungeeFont = fontLoader.parse(json);
  // Use parsed font as normal.
  const textGeometry = new TextGeometry("CapiRush", {
    height: 2,
    size: 10,
    font: BungeeFont,
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -40;
  textMesh.position.z = -50;
  scene.add(textMesh);
});

// ------------------------------------

// Move -------------------------------
// ------------------------------------

function animate() {
  requestAnimationFrame(animate); // First

  // ------------------------------------

  // ------------------------------------

  render.render(scene, camera); // Last
}

function start() {
  camSetup();
  scenarioSetup();
  lightSetup();
  animate();
}

start();
