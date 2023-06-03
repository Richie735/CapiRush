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
          0,
          1000
        );
        camera.position.set(500, -100, -200);
        camera.lookAt(0, 10, 0);
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

const directionalLight = new THREE.DirectionalLight(0xfae9b8, 0.1);
directionalLight.position.set(0, 5, 0);
gui
  .add(directionalLight, "intensity")
  .name("Directional Light")
  .max(0.3)
  .min(0)
  .step(0.1);

const pointLight = new THREE.PointLight(0xe79f8c, 1, 5, 1);
pointLight.position.set(-3.1, 1, -2.1);
gui.add(pointLight, "intensity").name("Point Light").max(1).min(0).step(0.1);

//const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
//scene.add(pointLightHelper);

function lightSetup() {
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(pointLight);
}

function toggleAmbientLight() {
  if (ambientLight.intensity == 0) {
    ambientLight.intensity = 0.075;
  } else {
    ambientLight.intensity = 0;
  }
}
function toggleDirectionalLight() {
  if (directionalLight.intensity == 0) {
    directionalLight.intensity = 0.25;
  } else {
    directionalLight.intensity = 0;
  }
}
function togglePointLight() {
  if (pointLight.intensity == 0) {
    pointLight.intensity = 1;
  } else {
    pointLight.intensity = 0;
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyI": // Ambient Light
      toggleAmbientLight();
      break;
    case "KeyO": // Directional Light
      toggleDirectionalLight();
      break;
    case "KeyP": // Point Light
      togglePointLight();
      break;
  }
});

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

// Add Obstacles ----------------------
var ball = createBall();
scene.add(ball);

var car = createCar();
scene.add(car);
car.position.x -= 1.65;
//car.rotation.y = Math.PI / 2;
// ------------------------------------

// Obstacles Moving -------------------

function movingObstacles() {
  if (loadedModel && loadedModel.scene) {
    if (ball.position.z > 10) {
      ball.position.z = -15;
    }
    if (car.position.z > 10) {
      car.position.z = -15;
    }

    ball.position.z += objSpeed;
    ball.rotation.x += objSpeed;
    car.position.z += objSpeed;
  }
}

// ------------------------------------

// Add Objects ------------------------

let loadedModel;
const glftLoader = new GLTFLoader();
glftLoader.load("./assets/models/poste/scene.gltf", (gltfScene) => {
  loadedModel = gltfScene;
  gltfScene.scene.position.set(-2.8, -1.3, -2);
  gltfScene.scene.scale.set(1, 1.2, 1);
  scene.add(gltfScene.scene);
});

var tree = createSquareTree();
scene.add(tree);
tree.position.x = 3;
tree.position.z = -10;

var tree2 = createTree2();
scene.add(tree2);
tree2.position.x = 0;
tree2.position.z = -5;

var bush = createBush();
scene.add(bush);

// ------------------------------------

// Out Obj Moving ---------------------
var objSpeed = 0.03;
var randomPos;

function posOutObj(outObj) {
  randomPos = Math.floor(Math.random() * 2);

  if (randomPos == 1) {
    switch (outObj) {
      case "poste":
        loadedModel.scene.position.z = -15;
        loadedModel.scene.position.x = -2.8;
        pointLight.position.z = -15;
        pointLight.position.x = -2.8;
        break;
      case "tree":
        tree.position.z = -20;
        tree.position.x = -2.8;
        break;
      case "tree2":
        tree2.position.z = -18;
        tree2.position.x = 0;
        break;
      case "bush":
        bush.position.z = -21;
        bush.position.x = -7.5;
        break;
    }
  } else {
    switch (outObj) {
      case "poste":
        loadedModel.scene.position.z = -15;
        loadedModel.scene.position.x = 2.8;
        pointLight.position.z = -15;
        pointLight.position.x = 2.8;
        break;
      case "tree":
        tree.position.z = -20;
        tree.position.x = 2.8;
        break;
      case "tree2":
        tree2.position.z = -18;
        tree2.position.x = 7;
        break;
      case "bush":
        bush.position.z = -21;
        bush.position.x = 0;
        break;
    }
  }
}

function movingOutObj() {
  if (loadedModel && loadedModel.scene) {
    // Check to front
    if (loadedModel.scene.position.z > 10) {
      posOutObj("poste");
    }
    if (tree.position.z > 7) {
      posOutObj("tree");
    }
    if (tree2.position.z > 7.5) {
      posOutObj("tree2");
    }
    if (bush.position.z > 7.5) {
      posOutObj("bush");
    }

    // Moving
    loadedModel.scene.position.z += objSpeed;
    pointLight.position.z += objSpeed;
    tree.position.z += objSpeed;
    tree2.position.z += objSpeed;
    bush.position.z += objSpeed;
  }
}

// ------------------------------------

function animate() {
  requestAnimationFrame(animate); // First

  // ------------------------------------
  movingObstacles();
  movingOutObj();
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

function createBall() {
  const geometry = new THREE.SphereBufferGeometry(0.5, 16, 16);

  const material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("assets/textures/smile.png"),
  });

  const ball = new THREE.Mesh(geometry, material);
  ball.rotateY(-Math.PI / 2);

  ball.position.set(0, -0.75, 0);

  return ball;
}

function createRoda() {
  const roda = new THREE.Group();

  const geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
  const jante = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);

  const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
  const material_2 = new THREE.MeshPhongMaterial({ color: 0x1b1e23 });

  const tire = new THREE.Mesh(geometry, material);
  const tire2 = new THREE.Mesh(jante, material_2);

  tire.position.set(0, -1, 0);
  tire.scale.set(0.4, 0.4, 0.4);
  tire2.position.set(0, -1.02, 0);
  tire2.scale.set(0.5, 0.5, 0.5);

  roda.add(tire);
  roda.add(tire2);

  roda.rotateZ(Math.PI / 2);
  roda.position.y = -0.8;

  return roda;
}

function createCar() {
  const car = new THREE.Group();

  const roda1 = createRoda();
  roda1.scale.set(0.9, 0.9, 0.9);
  roda1.position.x = -1.45;
  roda1.position.z = 0.6;

  const roda2 = createRoda();
  roda2.scale.set(0.9, 0.9, 0.9);
  roda2.position.x = -1.45;
  roda2.position.z = -0.6;

  const roda3 = createRoda();
  roda3.scale.set(0.9, 0.9, 0.9);
  roda3.position.x = -0.35;
  roda3.position.z = 0.6;

  const roda4 = createRoda();
  roda4.scale.set(0.9, 0.9, 0.9);
  roda4.position.x = -0.35;
  roda4.position.z = -0.6;

  car.add(roda1);
  car.add(roda2);
  car.add(roda3);
  car.add(roda4);

  const shape = new THREE.Shape();
  shape.lineTo(0, 0.4);
  shape.lineTo(1, 0.4);
  shape.lineTo(1, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 3,
    bevelEnabled: true,
    bevelThickness: 0.7,
    bevelSize: 0.2,
    bevelOffset: 0,
    bevelSegments: 3,
  };

  const main = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, extrudeSettings),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  main.scale.set(0.7, 0.7, 0.53);
  main.position.set(-0.35, -0.7, -0.8);
  car.add(main);

  const top = new THREE.Mesh(
    new THREE.SphereGeometry(10, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  top.scale.set(0.045, 0.04, 0.08);
  top.position.set(0, -0.3, 0);
  car.add(top);

  car.position.set(0, -0.1, 0);

  return car;
}

function createTrunkMaterial() {
  const trunkMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("./assets/textures/tree.jpg"),
  });
  return trunkMaterial;
}

function createFolhaMaterial() {
  const folhaMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("./assets/textures/folha.jpg"),
  });
  return folhaMaterial;
}

function createSquareTree() {
  var tree;

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var trunk = new THREE.CylinderGeometry(0.2, 0.4, 4, 4);

  var folhaMaterial = createFolhaMaterial();
  var troncoMaterial = createTrunkMaterial();
  var tronco = new THREE.Mesh(trunk, troncoMaterial);
  tronco.position.set(0, 0.5, 0);
  tronco.scale.set(0.5, 0.8, 0.5);

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
  tree.position.y = -0.2;

  return tree;
}

function createTree2() {
  const tree2 = new THREE.Group();

  // Criação da geometria da árvore
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4, 8); // Geometria do tronco
  const leafGeometry = new THREE.SphereGeometry(1.3, 8, 6); // Geometria da folha
  const leafGeometry_s = new THREE.SphereGeometry(0.8, 4, 8); //Geomatria da folha pequena

  // Criação dos materiais
  const trunkMaterial = createTrunkMaterial();
  const leafMaterial = createFolhaMaterial();

  // Criação das malhas
  const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial); // Malha do tronco
  const leafMesh1 = new THREE.Mesh(leafGeometry, leafMaterial); // Malha da primeira folha
  const leafMesh2 = new THREE.Mesh(leafGeometry, leafMaterial); // Malha da segunda folha
  const leafMesh3 = new THREE.Mesh(leafGeometry_s, leafMaterial); // Malha da terceira folha

  // Posicionamento das malhas
  trunkMesh.position.set(-3.5, 0, 0); // Posição do tronco
  leafMesh1.position.set(-4, 1.6, 0); // Posição da primeira folha
  leafMesh2.position.set(-3, 1.9, 0); // Posição da segunda folha
  leafMesh3.position.set(-3, 0.6, 0); //Posição da terceira folha

  // Adição das malhas à cena
  tree2.add(trunkMesh);
  tree2.add(leafMesh1);
  tree2.add(leafMesh2);
  tree2.add(leafMesh3);

  tree2.position.x = 0;
  tree2.position.y = 0.5;

  return tree2;
}

function createBush(scene) {
  const tree3 = new THREE.Group();

  // Criação da geometria da árvore
  const leafGeometry = new THREE.SphereGeometry(0.5, 8, 6);
  // Criação dos materiais
  const leafMaterial = createFolhaMaterial();

  // Criação das malhas
  const leafMesh1 = new THREE.Mesh(leafGeometry, leafMaterial);
  const leafMesh2 = new THREE.Mesh(leafGeometry, leafMaterial);
  const leafMesh3 = new THREE.Mesh(leafGeometry, leafMaterial);
  const leafMesh4 = new THREE.Mesh(leafGeometry, leafMaterial);

  leafMesh1.castShadow = true;
  leafMesh2.castShadow = true;
  leafMesh3.castShadow = true;
  leafMesh4.castShadow = true;
  leafMesh1.receiveShadow = true;
  leafMesh2.receiveShadow = true;
  leafMesh3.receiveShadow = true;
  leafMesh4.receiveShadow = true;

  // Posicionamento das malhas
  leafMesh1.position.set(4, -0.9, 0.7);
  leafMesh2.position.set(3.6, -1, 0.3);
  leafMesh2.scale.set(1, 0.8, 1);
  leafMesh3.position.set(4.2, -0.6, 0);
  leafMesh4.position.set(4.5, -1, 0.4);
  leafMesh4.scale.set(1, 0.7, 1);

  // Adição das malhas à cena
  tree3.add(leafMesh1);
  tree3.add(leafMesh2);
  tree3.add(leafMesh3);
  tree3.add(leafMesh4);

  tree3.position.x = 0;

  return tree3;
}
