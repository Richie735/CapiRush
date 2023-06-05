// Imports ----------------------------
import "../css/style.css";

import * as THREE from "three";
import * as dat from "dat.gui";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// ------------------------------------

// Init Setup -------------------------
const gravForce = 0.05;
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

// Audio ------------------------------

const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
const audio = new THREE.Audio(listener);
const audio_point = new THREE.Audio(listener);
const audio_punch = new THREE.Audio(listener);

audioLoader.load("../assets/audio/song18.mp3", function (buffer) {
  audio.setBuffer(buffer);
  audio.setLoop(true);
  audio.setVolume(0.03);
  audio.play();
});

audioLoader.load("../assets/audio/point.wav", function (buffer) {
  audio_point.setBuffer(buffer);
  audio_point.setLoop(false);
  audio_point.setVolume(0.5);
});

audioLoader.load("../assets/audio/punch.wav", function (buffer) {
  audio_punch.setBuffer(buffer);
  audio_punch.setLoop(false);
  audio_punch.setVolume(0.5);
});

// ------------------------------------

// Add Player -------------------------

var loader = new FBXLoader();

var capi;
loader.load("./assets/models/capi/Capybara.fbx", function (object) {
  object.scale.set(0.0025, 0.0025, 0.0025);
  object.position.set(0, -1.1, 3);
  object.rotation.y = Math.PI;

  object.bottom = object.position.y - object.height / 2;
  object.top = object.position.y + object.height / 2;
  object.velocity = { x: 0, y: 0, z: 0 };
  object.gravity = gravForce;
  object.castShadow = true;

  capi = object;
  scene.add(capi);
});

var skate = createSkate();
scene.add(skate);

// ------------------------------------

// Player Movement --------------------

var movementSpeed = 0.05;
var moveLeft = false;
var moveRight = false;
var targetX = 0;

var jumpHeight = 2.5;
var jumpHeightSkate = 1.5;
var heightRotate = 0.5;
var jumpDuration = 700;
var isJumping = false;
var targetY = -1.1;
var targetYSkate = -1.1;

function playerMovement(goTo) {
  switch (goTo) {
    case "left":
      if (capi.position.x === 1.65) {
        moveLeft = true;
        targetX = 0;
        capi.rotation.y = Math.PI + 0.45;
        skate.rotation.y = +0.45;
      } else if (capi.position.x === 0) {
        moveLeft = true;
        targetX = -1.65;
        capi.rotation.y = Math.PI + 0.45;
        skate.rotation.y = +0.45;
      }
      break;
    case "right":
      if (capi.position.x === -1.65) {
        moveRight = true;
        targetX = 0;
        capi.rotation.y = Math.PI - 0.45;
        skate.rotation.y = -0.45;
      } else if (capi.position.x === 0) {
        moveRight = true;
        targetX = 1.65;
        capi.rotation.y = Math.PI - 0.45;
        skate.rotation.y = -0.45;
      }
      break;
    case "jump":
      if (!isJumping) {
        isJumping = true;
        targetY = capi.position.y + jumpHeight;
        targetYSkate = skate.position.y + jumpHeightSkate;
        capi.rotation.x = Math.PI * 2;
        skate.rotation.y = Math.PI * 2;
        setTimeout(function () {
          targetY = -1.1;
          targetYSkate = -1.1;
          isJumping = false;
          capi.rotation.x = 0;
          skate.rotation.y = 0;
        }, jumpDuration);
      }
      break;
  }
}

function checkPlayerMovement() {
  // Horizontal Movement
  if (moveLeft && capi.position.x > -1.65) {
    capi.position.x -= movementSpeed;
    skate.position.x -= movementSpeed;
  }

  if (moveRight && capi.position.x < 1.65) {
    capi.position.x += movementSpeed;
    skate.position.x += movementSpeed;
  }

  if (capi.position.x !== targetX) {
    var direction = Math.sign(targetX - capi.position.x);
    capi.position.x += direction * movementSpeed;
    skate.position.x += direction * movementSpeed;

    if (
      (direction > 0 && capi.position.x > targetX) ||
      (direction < 0 && capi.position.x < targetX)
    ) {
      capi.position.x = targetX;
      skate.position.x = targetX;
      capi.rotation.y = Math.PI;
      skate.rotation.y = 0;
    }
  }

  if (moveLeft === false && moveRight === false) {
    capi.rotation.y = Math.PI;
    skate.rotation.y = 0;
  }

  // Vertical Movement
  if (capi.position.y !== targetY) {
    var directionY = Math.sign(targetY - capi.position.y);
    capi.position.y += directionY * movementSpeed;

    if (directionY > 0 && capi.position.y > targetY) {
      capi.position.y = targetY;
    } else if (directionY < 0 && capi.position.y < targetY) {
      capi.position.y = targetY;
    }
  }
  if (skate.position.y !== targetYSkate) {
    var directionYSkate = Math.sign(targetYSkate - skate.position.y);
    skate.position.y += directionYSkate * movementSpeed;

    if (directionYSkate > 0 && skate.position.y > targetYSkate) {
      skate.position.y = targetYSkate;
    } else if (directionYSkate < 0 && skate.position.y < targetYSkate) {
      skate.position.y = targetYSkate;
    }
  }

  // Rotate capi and skate during the jump
  if (isJumping) {
    if (capi.position.y > heightRotate) capi.rotation.x += 0.089;
    skate.rotation.y += 0.093;
  }
}

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
    case "ArrowLeft":
      playerMovement("left");
      break;
    case "KeyD":
    case "ArrowRight":
      playerMovement("right");
      break;
    case "KeyW":
    case "ArrowUp":
      playerMovement("jump");
      break;
  }
});

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyA":
    case "ArrowLeft":
      moveLeft = false;
      if (!moveRight) targetX = 0;
      break;
    case "KeyD":
    case "ArrowRight":
      moveRight = false;
      if (!moveLeft) targetX = 0;
      break;
  }
});

// ------------------------------------

// Point ------------------------------

let score = 0;
var point = create_points();
point.scale.set(1.2, 1.2, 1.2);
point.position.z = 5;
scene.add(point);

function movingPoint() {
  var positions = [-1.65, 0, 1.65];
  if (point.position.z > 10) {
    var ranPos = Math.floor(Math.random() * 3);
    point.position.x = positions[ranPos];
    point.position.z = -15;
  }

  point.position.z += objSpeed;
  point.rotation.x += objSpeed;
}

function updateScore() {
  const scoreElement = document.getElementById("atualScore");
  scoreElement.innerText = "Score: " + score;
}

// ------------------------------------

// Add Obstacles ----------------------
// Bola
var ball = createBall();
scene.add(ball);
ball.position.x = -1.63;
ball.position.z = 5;

// Carro Vermelho
var car = createCar(0);
car.position.z += 6;
const roda1 = createRoda();
roda1.scale.set(0.9, 0.9, 0.9);
roda1.position.x = -1.45;
roda1.position.z = 6.6;
const roda2 = createRoda();
roda2.scale.set(0.9, 0.9, 0.9);
roda2.position.x = -1.45;
roda2.position.z = 5.4;
const roda3 = createRoda();
roda3.scale.set(0.9, 0.9, 0.9);
roda3.position.x = -0.35;
roda3.position.z = 6.6;
const roda4 = createRoda();
roda4.scale.set(0.9, 0.9, 0.9);
roda4.position.x = -0.35;
roda4.position.z = 5.4;
scene.add(car);
scene.add(roda1);
scene.add(roda2);
scene.add(roda3);
scene.add(roda4);

// Carro Verde
var carGreen = createCar(1);
carGreen.position.z += 7;
const rodaGreen1 = createRoda();
rodaGreen1.scale.set(0.9, 0.9, 0.9);
rodaGreen1.position.x = -1.45;
rodaGreen1.position.z = 7.6;
const rodaGreen2 = createRoda();
rodaGreen2.scale.set(0.9, 0.9, 0.9);
rodaGreen2.position.x = -1.45;
rodaGreen2.position.z = 6.4;
const rodaGreen3 = createRoda();
rodaGreen3.scale.set(0.9, 0.9, 0.9);
rodaGreen3.position.x = -0.35;
rodaGreen3.position.z = 7.6;
const rodaGreen4 = createRoda();
rodaGreen4.scale.set(0.9, 0.9, 0.9);
rodaGreen4.position.x = -0.35;
rodaGreen4.position.z = 6.4;
scene.add(carGreen);
scene.add(rodaGreen1);
scene.add(rodaGreen2);
scene.add(rodaGreen3);
scene.add(rodaGreen4);

// Roda
var roda = createRoda();
scene.add(roda);
roda.position.set(-3.6, -0.4, 5);
roda.scale.set(2, 2, 2);

// ------------------------------------

// Obstacles Moving -------------------

function movingObstacles() {
  var ranPos;
  var count = 0;
  var oldRandom;

  if (ball.position.z > 10) {
    ranPos = Math.floor(Math.random() * 3);
    obstaclesLane("ball", ranPos, count, oldRandom);
    count++;
    oldRandom = ranPos;
  }
  if (car.position.z > 10) {
    ranPos = Math.floor(Math.random() * 3);
    obstaclesLane("redCar", ranPos, count, oldRandom);
    count++;
    oldRandom = ranPos;
  }
  if (carGreen.position.z > 10) {
    ranPos = Math.floor(Math.random() * 3);
    obstaclesLane("greenCar", ranPos, count, oldRandom);
    count++;
    oldRandom = ranPos;
  }
  if (roda.position.z > 10) {
    ranPos = Math.floor(Math.random() * 3);
    obstaclesLane("roda", ranPos, count, oldRandom);
    count++;
    oldRandom = ranPos;
  }

  ball.position.z += objSpeed;
  ball.rotation.x += objSpeed;

  roda.position.z += objSpeed;
  roda.rotation.x += objSpeed;

  car.position.z += objSpeed;
  roda1.position.z += objSpeed;
  roda2.position.z += objSpeed;
  roda3.position.z += objSpeed;
  roda4.position.z += objSpeed;

  carGreen.position.z += objSpeed;
  rodaGreen1.position.z += objSpeed;
  rodaGreen2.position.z += objSpeed;
  rodaGreen3.position.z += objSpeed;
  rodaGreen4.position.z += objSpeed;

  roda1.rotation.x += objSpeed;
  roda2.rotation.x += objSpeed;
  roda3.rotation.x += objSpeed;
  roda4.rotation.x += objSpeed;

  rodaGreen1.rotation.x += objSpeed;
  rodaGreen2.rotation.x += objSpeed;
  rodaGreen3.rotation.x += objSpeed;
  rodaGreen4.rotation.x += objSpeed;
}

function carFrentex(flag) {
  switch (flag) {
    case "red":
      car.position.z = -25;
      roda1.position.z = -24.5;
      roda2.position.z = -25.7;
      roda3.position.z = -24.5;
      roda4.position.z = -25.7;
      break;
    case "green":
      carGreen.position.z = -15;
      rodaGreen1.position.z = -14.5;
      rodaGreen2.position.z = -15.7;
      rodaGreen3.position.z = -14.5;
      rodaGreen4.position.z = -15.7;
      break;
  }
}

function obstaclesLane(obj, position, count, oldRandom) {
  if (count == 1) {
    while (position == oldRandom) {
      position = Math.floor(Math.random() * 3);
    }
  } else if (count != 2) {
    switch (position) {
      case 0: // left
        switch (obj) {
          case "redCar":
            car.position.x = -1.45;
            roda1.position.x = -2.9;
            roda2.position.x = -2.9;
            roda3.position.x = -1.8;
            roda4.position.x = -1.8;
            carFrentex("red");
            break;
          case "greenCar":
            carGreen.position.x = -1.45;
            rodaGreen1.position.x = -2.9;
            rodaGreen2.position.x = -2.9;
            rodaGreen3.position.x = -1.8;
            rodaGreen4.position.x = -1.8;
            carFrentex("green");
            break;
          case "ball":
            ball.position.x = -1.63;
            ball.position.z = -17;
            break;
          case "roda":
            roda.position.x = -3.6;
            roda.position.z = -8;
            break;
        }
        break;
      case 1: // center
        switch (obj) {
          case "redCar":
            car.position.x = 0;
            roda1.position.x = -1.45;
            roda2.position.x = -1.45;
            roda3.position.x = -0.35;
            roda4.position.x = -0.35;
            carFrentex("red");
            break;
          case "greenCar":
            carGreen.position.x = 0;
            rodaGreen1.position.x = -1.45;
            rodaGreen2.position.x = -1.45;
            rodaGreen3.position.x = -0.35;
            rodaGreen4.position.x = -0.35;
            carFrentex("green");

            break;
          case "ball":
            ball.position.x = 0;
            ball.position.z = -15;
            break;
          case "roda":
            roda.position.x = -2;
            roda.position.z = -15;

            break;
        }
        break;
      case 2: // right
        switch (obj) {
          case "redCar":
            car.position.x = 1.45;
            roda1.position.x = 0;
            roda2.position.x = 0;
            roda3.position.x = 1.1;
            roda4.position.x = 1.1;
            carFrentex("red");

            break;
          case "greenCar":
            carGreen.position.x = 1.45;
            rodaGreen1.position.x = 0;
            rodaGreen2.position.x = 0;
            rodaGreen3.position.x = 1.1;
            rodaGreen4.position.x = 1.1;
            carFrentex("green");
            break;
          case "ball":
            ball.position.x = 1.63;
            ball.position.z = -15;
            break;
          case "roda":
            roda.position.x = -0.5;
            roda.position.z = -15;
            break;
        }
        break;
    }
  }
  count++;
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

// ------------------------------------

// Check Collisions --------------------

function checkPlayerCollision(playerPosition) {
  const objectsToCheck = [
    car.position,
    carGreen.position,
    roda.position,
    ball.position,
  ];
  const collisionDistanceThreshold = 0.5;

  for (const objectPosition of objectsToCheck) {
    if (
      playerPosition.manhattanDistanceTo(objectPosition) <
      collisionDistanceThreshold
    ) {
      audio_punch.play();
      capi.position.y = 2;
      //window.location.href = "../gameover.html";
      break;
    }
  }

  if (playerPosition.distanceTo(point.position) < collisionDistanceThreshold) {
    audio_point.play();
    score += 1;
    point.position.z = 5;
    if (score % 5 == 0) {
      objSpeed += 0.01;
    }
    updateScore();
  }
}

// ------------------------------------

// Day/Night Cycle --------------------
var day = true;

const ambientStep = 0.003;
const directionalStep = 0.005;
const pointStep = -0.1;

function turnDay() {
  for (var i = 0; i < 10; i++) {
    setTimeout(function () {
      ambientLight.intensity += ambientStep;
      directionalLight.intensity += directionalStep;
    }, 10000);
  }
  ambientLight.intensity = 0.075;
  directionalLight.intensity = 0.1;
  pointLight.intensity = 0;
  console.log("day");
  day = true;
}

function turnNight() {
  for (var i = 0; i < 10; i++) {
    setTimeout(function () {
      ambientLight.intensity -= ambientStep;
      directionalLight.intensity -= directionalStep;
      pointLight.intensity -= pointStep;
    }, 10000);
  }
  ambientLight.intensity = 0.045;
  directionalLight.intensity = 0.05;
  pointLight.intensity = 1;
  console.log("night");
  day = false;
}

function dayNightCycle() {
  setInterval(function () {
    if (day) {
      turnNight();
    } else {
      turnDay();
    }
  }, 120000);
}
// ------------------------------------

// Boot + Game Loop -------------------

function animate() {
  requestAnimationFrame(animate); // First

  // ------------------------------------
  if (loadedModel && loadedModel.scene && capi) {
    checkPlayerMovement();
    movingObstacles();
    movingPoint();
    movingOutObj();

    checkPlayerCollision(capi.position);
  }
  // ------------------------------------

  render.render(scene, camera); // Last
}

function start() {
  score = 0;
  updateScore();
  camSetup();
  scenarioSetup();
  lightSetup();
  dayNightCycle();
  animate();
}

start();
// ------------------------------------

// Create Functions -------------------

function createSkateWheel() {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.1, 32),
    new THREE.MeshPhongMaterial({ color: 0x000000 })
  );
  return wheel;
}

function createSkate() {
  const skate = new THREE.Group();

  const skateBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.05, 0.9),
    new THREE.MeshPhongMaterial({ color: 0x68478d })
  );
  skate.add(skateBase);

  const borderGeometry = new THREE.CylinderGeometry(0.325, 0.325, 0.05);
  const borderMaterial = new THREE.MeshPhongMaterial({ color: 0x68478d });
  const border1 = new THREE.Mesh(borderGeometry, borderMaterial);
  border1.position.set(0, 0, -0.4);
  const border2 = new THREE.Mesh(borderGeometry, borderMaterial);
  border2.position.set(0, 0, 0.4);
  skate.add(border1, border2);

  const wheel1 = createSkateWheel();
  wheel1.position.set(0.3, -0.1, -0.3);
  wheel1.rotateZ(Math.PI / 2);
  const wheel2 = createSkateWheel();
  wheel2.position.set(0.3, -0.1, 0.3);
  wheel2.rotateZ(Math.PI / 2);
  const wheel3 = createSkateWheel();
  wheel3.position.set(-0.3, -0.1, -0.3);
  wheel3.rotateZ(Math.PI / 2);
  const wheel4 = createSkateWheel();
  wheel4.position.set(-0.3, -0.1, 0.3);
  wheel4.rotateZ(Math.PI / 2);
  skate.add(wheel1, wheel2, wheel3, wheel4);

  skate.position.set(0, -1.1, 3);
  skate.scale.set(0.8, 0.8, 0.8);
  skate.gravity = gravForce;

  return skate;
}

function create_points() {
  const point = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.15, 16, 16),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("assets/textures/laranja.jpg"),
    })
  );

  point.position.set(0, -0.8, 0);

  return point;
}

function createBall() {
  const ball = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("assets/textures/smile.png"),
    })
  );

  ball.rotateY(-Math.PI / 2);
  ball.position.set(0, -0.75, 0);

  return ball;
}

function createRoda() {
  const roda = new THREE.Group();

  const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 0.5, 32),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("./assets/textures/tire.jpg"),
    })
  );
  const tire2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32),
    new THREE.MeshPhongMaterial({ color: 0x1b1e23 })
  );

  tire.position.set(0, -1.02, 0);
  tire.scale.set(0.4, 0.4, 0.4);
  tire2.position.set(0, -1.02, 0);
  tire2.scale.set(0.5, 0.5, 0.5);

  roda.add(tire);
  roda.add(tire2);

  roda.rotateZ(Math.PI / 2);
  roda.position.y = -0.8;

  return roda;
}

function createCar(num) {
  const car = new THREE.Group();

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

  var main;
  switch (num) {
    case 0:
      main = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, extrudeSettings),
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
      );
      break;
    case 1:
      main = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, extrudeSettings),
        new THREE.MeshPhongMaterial({ color: 0x00ff00 })
      );
      break;
  }
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
// ------------------------------------
