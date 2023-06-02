// Imports ----------------------------
import "../css/style.css";

import * as THREE from "three";
import * as dat from "dat.gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// ------------------------------------

// Init Setup -------------------------
const gui = new dat.GUI();
const scene = new THREE.Scene();
const render = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
// ------------------------------------

// Resize Handler ---------------------

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
});

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
          sizes.width / -2,
          sizes.width / 2,
          sizes.height / 2,
          sizes.height / -2,
          90,
          100
        );
        camera.position.set(0, 0, 0);
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

  let skyboxGeo = new THREE.BoxGeometry(100, 100, 100);
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
gui
  .add(ambientLight, "intensity")
  .name("Ambient Light")
  .max(0.075)
  .min(0)
  .step(0.075);

const directionalLight = new THREE.DirectionalLight(0xfae9b8, 0.25);
directionalLight.position.set(0, 5, 0);
gui
  .add(directionalLight, "intensity")
  .name("Directional Light")
  .max(0.25)
  .min(0)
  .step(0.25);

const pointLight = new THREE.PointLight(0xe79f8c, 1, 5, 0.5);
pointLight.position.set(-3, 2, -3.3);
gui.add(pointLight, "intensity").name("Point Light").max(0.3).min(0).step(0.3);

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
// ------------------------------------

// Font Test---------------------------

const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();

ttfLoader.load("assets/fonts/Bungee-Regular.ttf", (json) => {
  // First parse the font.
  const BungeeFont = fontLoader.parse(json);
  // Use parsed font as normal.
  const textGeometry = new TextGeometry("CapiRush", {
    height: 0.3,
    size: 1,
    font: BungeeFont,
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = -3.7;
  textMesh.position.y = 1.3;
  textMesh.position.z = 0;
  scene.add(textMesh);
});

// ------------------------------------


// Add Objects ------------------------

let loadedModel;
const glftLoader = new GLTFLoader();
glftLoader.load("./assets/models/poste/scene.gltf", (gltfScene) => {
  loadedModel = gltfScene;
  gltfScene.scene.position.set(-2.3, -1, -2);
  gltfScene.scene.scale.set(1, 1.2, 1);
  scene.add(gltfScene.scene);
});

var tree = createTree();
scene.add(tree);
tree.position.x = 2;

// ------------------------------------


// Moving -----------------------------
// ------------------------------------

function animate() {
  requestAnimationFrame(animate); // First

  // ------------------------------------
  if (loadedModel && loadedModel.scene) {
    if (loadedModel.scene.position.z > 10) {
      loadedModel.scene.position.z = -10;
      pointLight.position.z = -11.3;
    }
    loadedModel.scene.position.z += 0.05;
    pointLight.position.z += 0.05;
  }

  if(tree.position.z > 7){
    tree.position.z = -7;
  }
  tree.position.z += 0.05;

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

function createTree() {
  var tree;

  var geometry = new THREE.BoxGeometry(1, 1, 1);

  const leafTexture = new THREE.TextureLoader().load(
    "./assets/textures/folha.jpg"
  );
  const troncoTexture = new THREE.TextureLoader().load(
    "./assets/textures/tree.jpg"
  );

  var folhaMaterial = new THREE.MeshPhongMaterial({ map: leafTexture });
  var troncoMaterial = new THREE.MeshPhongMaterial({ map: troncoTexture });
  var tronco = new THREE.Mesh(geometry, troncoMaterial);
  tronco.position.set(0, 0, 0);
  tronco.scale.set(0.3, 1.5, 0.3);

  var folha01 = new THREE.Mesh(geometry, folhaMaterial);
  folha01.position.set(0.5, 1.6, 0.5);
  folha01.scale.set(0.8, 0.8, 0.8);

  var folha02 = new THREE.Mesh(geometry, folhaMaterial);
  folha02.position.set(-0.4, 1.3, -0.4);
  folha02.scale.set(0.7, 0.7, 0.7);

  var folha03 = new THREE.Mesh(geometry, folhaMaterial);
  folha03.position.set(0.4, 1.7, -0.5);
  folha03.scale.set(0.7, 0.7, 0.7);

  var folha04 = new THREE.Mesh(geometry, folhaMaterial);
  folha04.position.set(0, 1.2, 0);
  folha04.scale.set(1, 2, 1);

  var folha05 = new THREE.Mesh(geometry, folhaMaterial);
  folha05.position.set(0, 1.2, 0);
  folha05.scale.set(1.1, 0.5, 1.1);

  tree = new THREE.Group();

  tree.add(folha01);
  tree.add(folha02);
  tree.add(folha03);
  tree.add(folha04);
  tree.add(folha05);
  tree.add(tronco);

  tree.rotation.y = 1;
  tree.position.z = 0;

  return tree;
}
