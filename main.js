// Imports ----------------------------
import "./style.css";

import * as THREE from "three";

import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// ------------------------------------


// Init Setup -------------------------
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
var camPos = 1;
const scene = new THREE.Scene();
const render = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

// ------------------------------------


// Camera Setup -----------------------
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
          window.innerWidth / -2,
          window.innerWidth / 2,
          window.innerHeight / 2,
          window.innerHeight / -2,
          1,
          1000
        );
        camera.position.set(0, 7, 7);
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
        camera.position.set(0, 0, 5.3);
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


// Test Model -------------------------
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshNormalMaterial();
const capi = new THREE.Mesh(boxGeometry, boxMaterial);
capi.position.set(0, -0.5, 3);
scene.add(capi);
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



function animate() {
  requestAnimationFrame(animate); // First

  // ------------------------------------

  // ------------------------------------

  render.render(scene, camera); // Last
}

function start() {
  camSetup();
  scenarioSetup();
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);
  animate();
}

start();