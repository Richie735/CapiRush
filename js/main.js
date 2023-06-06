/*
------------------------------------------------------------------
 ██████╗ █████╗ ██████╗ ██╗      ██████╗ ██╗   ██╗███████╗██╗  ██╗
██╔════╝██╔══██╗██╔══██╗██║      ██╔══██╗██║   ██║██╔════╝██║  ██║
██║     ███████║██████╔╝██║█████╗██████╔╝██║   ██║███████╗███████║
██║     ██╔══██║██╔═══╝ ██║╚════╝██╔══██╗██║   ██║╚════██║██╔══██║
╚██████╗██║  ██║██║     ██║      ██║  ██║╚██████╔╝███████║██║  ██║
 ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝      ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
------------------------------------------------------------------                                                                  

INDEX   //------------------------------------
1.  Imports   //------------------------------
    | Lines 041-052
    | This is where we import all the libraries we need for the project.

2.  Init Setup   //---------------------------
    | Lines 041-052
    | This is where we setup the initial some variables for the project.

3.  Loading   //------------------------------
    | Lines 041-052
    | This is where we setup the loading screen for the game.

4.  Resize Handler   //-----------------------
    | Lines 041-052
    | Here we make the renderer responsive to the window size.

5.  Camera Setup   //-------------------------
    | Lines 041-052
    | Here we setup and handle the cameras for the game.

6.  Render Setting   //-----------------------
    | Lines 041-052
    | Here we setup the render settings for the game.

7.  Scenario   //-----------------------------
    | Lines 041-052
    | Here we setup the scenario for the game.
    | This includes the skybox, the road and the walkway.

8.  Lights   //-------------------------------
    | Lines 041-052
    | Here we setup the lights for the game.

9.  Text Mesh   //----------------------------
    | Lines 041-052
    | Here we setup the text mesh for the game.

10. Audio   //--------------------------------
    | Lines 041-052
    | Here we setup the audio for the game.

11. Add Player   //---------------------------
    | Lines 041-052
    | Here we setup the player for the game.
    | Starting up the capybara model and the skateboard model.

12. Player Movement   //----------------------
    | Lines 041-052
    | Here we setup the player movement for the game.

13. Point   //--------------------------------
    | Lines 041-052
    | Here we setup the points for the game.

14. Add Obstacles   //------------------------
    | Lines 041-052
    | Here we add the obstacles for the game.
    | This includes the cars, the ball and tire.

15. Obstacles Moving   //---------------------
    | Lines 041-052
    | Here we handle the obstacles movement for the game.
    | We make them move and rotate along the road.
    | And we also make them respawn randomly.

16. Add Objects   //--------------------------
    | Lines 041-052
    | Here we add the objects of the walkway.

17. Out Obj Moving   //-----------------------
    | Lines 041-052
    | Here we handle the movement of the objects of the walkway.
    | We make them move along the walkway and make them respawn randomly.

18. Check Collisions   //---------------------
    | Lines 041-052
    | Here we check the collisions for the game.
    | We check if the player collides with the obstacles.
    | We check if the obstacles collide with each other.

19. Day/Night Cycle   //----------------------
    | Lines 041-052
    | Here we setup the day/night cycle for the game.
    | Handling the lights intensity and the timing.

20. GUI   //----------------------------------
    | Lines 041-052
    | Here we setup the GUI for the game.
    | Adding controls for the lights, cameras, day/night and collisions.

21. Boot + Game Loop   //---------------------
    | Lines 041-052
    | Here we call the functions required for the game to start up 
    | and the game loop to run.

22. Create Functions   //---------------------
    | Lines 041-052
    | Here we have the functions that create the objects of the game.

23. Gameover   //-----------------------------
    | Lines 041-052
    | Here we setup the gameover screen for the game.

------------------------------------------------------------------
*/

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

// Loading ----------------------------

var progressBar = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 5),
  new THREE.MeshBasicMaterial({ color: 0x11222c })
);
var progressBar2 = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 10),
  new THREE.MeshBasicMaterial({ color: 0xf69000 })
);

progressBar2.position.set(0, 3, -60);
progressBar.position.set(0, 3, -60);

scene.add(progressBar2);
scene.add(progressBar);

function updateProgressBar(progress) {
  var scaleX = progress;
  progressBar.scale.set(scaleX, 1, 1);
}

function loadResources() {
  var totalResources = 100;
  var loadResources = 0;

  var loadingInterval = setInterval(function () {
    loadResources++;

    var progress = loadResources / totalResources;
    updateProgressBar(progress);

    if (loadResources >= totalResources) {
      clearInterval(loadingInterval);
      updateScore();
      camSetup();
      scenarioSetup();
      lightSetup();
      toggleDay();
      dayNightCycle();
      animate();

    }
  }, 50);
}

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

function toggleCam() {
  if (camPos == 1) {
    // Camera 2 - Orthographic - Longe Cima
    scene.remove(camera);
    const zoom = 50;
    camera = new THREE.OrthographicCamera(
      sizes.width / -2 / zoom,
      sizes.width / 2 / zoom,
      sizes.height / 2 / zoom,
      sizes.height / -2 / zoom,
      -10,
      1000
    );
    camera.position.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    camPos = 2;
  } else if (camPos == 2) {
    // Camera 1 - Perspective - Perto Tras
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
}
window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyC":
      toggleCam();
      break;
  }
});

// ------------------------------------

// Render Setting ---------------------

render.setPixelRatio(window.devicePixelRatio);
render.setSize(window.innerWidth, window.innerHeight);
render.render(scene, camera);

// ------------------------------------

// Scenario ---------------------------
class Box extends THREE.Mesh {
  constructor({ width, height, depth, position = { x: 0, y: 0, z: 0 } }) {
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
  road.material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("./assets/textures/road.jpg"),
  });
  road.material.map.wrapS = THREE.RepeatWrapping;
  road.material.map.wrapT = THREE.RepeatWrapping;
  road.material.map.repeat.set(3, 40);

  road.castShadow = true;
  road.receiveShadow = true;

  scene.add(road);
  // ----------------------------------

  // Walkway --------------------------
  const walkway = new Box({
    width: 9,
    height: 0.5,
    depth: 50,
    position: { x: 0, y: -1.6, z: 0 },
  });
  walkway.material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("./assets/textures/walkway.png"),
  });
  walkway.material.map.wrapS = THREE.RepeatWrapping;
  walkway.material.map.wrapT = THREE.RepeatWrapping;
  walkway.material.map.repeat.set(6, 55);

  walkway.castShadow = true;
  walkway.receiveShadow = true;

  scene.add(walkway);
  // ----------------------------------
}
// ------------------------------------

// Light ------------------------------

render.shadowMap.enabled = true;
render.shadowMap.type = THREE.PCFSoftShadowMap;
render.shadowMap.autoUpdate = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.075);

const directionalLight = new THREE.DirectionalLight(0xfae9b8, 0.1);
directionalLight.castShadow = true;
directionalLight.position.set(0, 5, 0);

const pointLight = new THREE.PointLight(0xe79f8c, 1, 5, 1);
pointLight.castShadow = true;
pointLight.position.set(-3.1, 1, -2.1);

//const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
//scene.add(pointLightHelper);

const spotLightRed = new THREE.SpotLight(0xfada5e);
spotLightRed.intensity = 1;
spotLightRed.castShadow = true;
spotLightRed.angle = 0.3;
spotLightRed.position.set(0, -0.5, 9);
spotLightRed.target.position.set(0, 0, 100);

const spotLightGreen = new THREE.SpotLight(0xfada5e);
spotLightGreen.intensity = 1;
spotLightGreen.castShadow = true;
spotLightGreen.angle = 0.3;
spotLightGreen.position.set(0, -0.5, 9);
spotLightGreen.target.position.set(0, 0, 100);

const spotLightHelperRed = new THREE.SpotLightHelper(spotLightRed);
spotLightHelperRed.visible = false;
scene.add(spotLightHelperRed);

const spotLightHelperGreen = new THREE.SpotLightHelper(spotLightGreen);
spotLightHelperGreen.visible = false;
scene.add(spotLightHelperGreen);

function lightSetup() {
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(pointLight);
  scene.add(spotLightRed);
  scene.add(spotLightGreen);
}

function toggleAmbientLight() {
  if (ambientLight.intensity == 0) {
    ambientLight.intensity = 0.075;
    console.log("Ambient light on");
  } else {
    ambientLight.intensity = 0;
    console.log("Ambient light off");
  }
}
function toggleDirectionalLight() {
  if (directionalLight.intensity == 0) {
    directionalLight.intensity = 0.25;
    console.log("Directional light on");
  } else {
    directionalLight.intensity = 0;
    console.log("Directional light off");
  }
}
function togglePointLight() {
  if (pointLight.intensity == 0) {
    pointLight.intensity = 1;
    console.log("Point light on");
  } else {
    pointLight.intensity = 0;
    console.log("Point light off");
  }
}
function toggleRedSpotlight() {
  if (spotLightRed.intensity == 0) {
    spotLightRed.intensity = 1;
    console.log("Red spotlight on");
  } else {
    spotLightRed.intensity = 0;
    console.log("Red spotlight off");
  }
}
function toggleGreenSpotlight() {
  if (spotLightGreen.intensity == 0) {
    spotLightGreen.intensity = 1;
    console.log("Green spotlight on");
  } else {
    spotLightGreen.intensity = 0;
    console.log("Green spotlight off");
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
    case "KeyK": // Red Spotlight
      toggleRedSpotlight();
      break;
    case "KeyL": // Green Spotlight
      toggleGreenSpotlight();
      break;
  }
});

// ------------------------------------

// Text Mesh --------------------------
let textMesh;

function createTextMesh(text) {
  const fontLoader = new FontLoader();
  const ttfLoader = new TTFLoader();

  ttfLoader.load("assets/fonts/Bungee-Regular.ttf", (json) => {
    const BungeeFont = fontLoader.parse(json);

    const textGeometry = new TextGeometry(text, {
      height: 0.3,
      size: 10,
      font: BungeeFont,
    });

    const textMaterial = new THREE.MeshNormalMaterial();
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = -38;
    textMesh.position.y = 20;
    textMesh.position.z = -50;

    scene.add(textMesh);
  });
}

function removeTextMesh() {
  if (textMesh && textMesh.parent) {
    textMesh.parent.remove(textMesh);
    textMesh = undefined;
  }
}

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
  object.receiveShadow = true;

  capi = object;
  scene.add(capi);
});

var skate = createSkate();
scene.add(skate);

// ------------------------------------

// Player Movement --------------------

var movementSpeed = 0.03;
var moveLeft = false;
var moveRight = false;
var targetX = 0;

var jumpHeight = 2.5;
var jumpHeightSkate = 1.5;
var heightRotate = 0.5;
var jumpDuration = 1000;
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

car.castShadow = true;
car.receiveShadow = true;
roda1.castShadow = true;
roda1.receiveShadow = true;
roda2.castShadow = true;
roda2.receiveShadow = true;
roda3.castShadow = true;
roda3.receiveShadow = true;
roda4.castShadow = true;
roda4.receiveShadow = true;

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

carGreen.castShadow = true;
carGreen.receiveShadow = true;
rodaGreen1.castShadow = true;
rodaGreen1.receiveShadow = true;
rodaGreen2.castShadow = true;
rodaGreen2.receiveShadow = true;
rodaGreen3.castShadow = true;
rodaGreen3.receiveShadow = true;
rodaGreen4.castShadow = true;
rodaGreen4.receiveShadow = true;

scene.add(carGreen);
scene.add(rodaGreen1);
scene.add(rodaGreen2);
scene.add(rodaGreen3);
scene.add(rodaGreen4);

var roda = createRoda();
roda.castShadow = true;
roda.receiveShadow = true;
roda.position.set(4, -0.2, 5);
roda.scale.set(2, 2, 2);
scene.add(roda);

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
  spotLightRed.position.z += objSpeed;

  carGreen.position.z += objSpeed;
  rodaGreen1.position.z += objSpeed;
  rodaGreen2.position.z += objSpeed;
  rodaGreen3.position.z += objSpeed;
  rodaGreen4.position.z += objSpeed;
  spotLightGreen.position.z += objSpeed;

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
      spotLightRed.position.z = -27;
      break;
    case "green":
      carGreen.position.z = -15;
      rodaGreen1.position.z = -14.5;
      rodaGreen2.position.z = -15.7;
      rodaGreen3.position.z = -14.5;
      rodaGreen4.position.z = -15.7;
      spotLightGreen.position.z = -17;
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
            if (checkObstaclesCollision(car, -1.45, 0, -25)) {
              car.position.x = -1.45;
              roda1.position.x = -2;
              roda2.position.x = -2;
              roda3.position.x = -0.9;
              roda4.position.x = -0.9;
              spotLightRed.position.x = -1.45;
              spotLightRed.target.position.x = -1.45;

              carFrentex("red");
            }
            break;
          case "greenCar":
            if (checkObstaclesCollision(carGreen, -1.45, 0, -15)) {
              carGreen.position.x = -1.45;
              rodaGreen1.position.x = -2;
              rodaGreen2.position.x = -2;
              rodaGreen3.position.x = -0.9;
              rodaGreen4.position.x = -0.9;
              spotLightGreen.position.x = -1.45;
              spotLightGreen.target.position.x = -1.45;

              carFrentex("green");
            }
            break;
          case "ball":
            if (checkObstaclesCollision(ball, -1.63, 0, -15)) {
              ball.position.x = -1.63;
              ball.position.z = -17;
            }
            break;
          case "roda":
            if (checkObstaclesCollision(roda, -1.4, -2, -15)) {
              roda.position.x = -1.4;
              roda.position.z = -8;
            }
            break;
        }
        break;
      case 1: // center
        switch (obj) {
          case "redCar":
            if (checkObstaclesCollision(car, 0, 0, -25)) {
              car.position.x = 0;
              roda1.position.x = -0.55;
              roda2.position.x = -0.55;
              roda3.position.x = 0.55;
              roda4.position.x = 0.55;
              spotLightRed.position.x = 0;
              spotLightRed.target.position.x = 0;

              carFrentex("red");
            }
            break;
          case "greenCar":
            if (checkObstaclesCollision(carGreen, 0, 0, -15)) {
              carGreen.position.x = 0;
              rodaGreen1.position.x = -0.55;
              rodaGreen2.position.x = -0.55;
              rodaGreen3.position.x = 0.55;
              rodaGreen4.position.x = 0.55;
              spotLightGreen.position.x = 0;
              spotLightGreen.target.position.x = 0;

              carFrentex("green");
            }
            break;
          case "ball":
            if (checkObstaclesCollision(ball, 0, 0, -15)) {
              ball.position.x = 0;
              ball.position.z = -15;
            }
            break;
          case "roda":
            if (checkObstaclesCollision(roda, 0, -2, -15)) {
              roda.position.x = 0;
              roda.position.z = -15;
            }
            break;
        }
        break;
      case 2: // right
        switch (obj) {
          case "redCar":
            if (checkObstaclesCollision(car, 1.45, 0, -25)) {
              car.position.x = 1.45;
              roda1.position.x = 0.9;
              roda2.position.x = 0.9;
              roda3.position.x = 2;
              roda4.position.x = 2;
              spotLightRed.position.x = 1.45;
              spotLightRed.target.position.x = 1.45;

              carFrentex("red");
            }
            break;
          case "greenCar":
            if (checkObstaclesCollision(carGreen, 1.45, 0, -15)) {
              carGreen.position.x = 1.45;
              rodaGreen1.position.x = 0.9;
              rodaGreen2.position.x = 0.9;
              rodaGreen3.position.x = 2;
              rodaGreen4.position.x = 2;
              spotLightGreen.position.x = 1.45;
              spotLightGreen.target.position.x = 1.45;

              carFrentex("green");
            }
            break;
          case "ball":
            if (checkObstaclesCollision(ball, 1.63, 0, -15)) {
              ball.position.x = 1.63;
              ball.position.z = -15;
            }
            break;
          case "roda":
            if (checkObstaclesCollision(roda, 1.3, -2, -15)) {
              roda.position.x = 1.3;
              roda.position.z = -15;
            }
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
  gltfScene.scene.position.set(-2.8, -1.35, -2);
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
var collision = true;

function toggleCollision() {
  collision = !collision;
  console.log("collision: " + collision);
}

function checkPlayerCollision(playerPosition) {
  const objectsToCheck = [
    car.position,
    carGreen.position,
    ball.position,
    roda.position,
  ];
  const collisionDistanceThreshold = 1.4;

  for (const objectPosition of objectsToCheck) {
    if (
      playerPosition.manhattanDistanceTo(objectPosition) <
      collisionDistanceThreshold
    ) {
      audio_punch.play();
      gameOver();
      break;
    }
  }

  if (playerPosition.distanceTo(point.position) < collisionDistanceThreshold) {
    audio_point.play();
    score += 1;
    point.position.z = 10;
    if (score % 5 == 0 && score != 0) {
      objSpeed += 0.01;
    }
    updateScore();
  }
}

function checkObstaclesCollision(objectToCheck, x, y, z) {
  const objectsToCheck = [
    car.position,
    carGreen.position,
    ball.position,
    roda.position,
  ];
  const collisionDistanceThreshold = 1.4;
  const point = new THREE.Vector3(x, y, z);

  for (const objectPosition of objectsToCheck) {
    if (objectPosition.distanceTo(point) != objectToCheck.position) {
      if (objectPosition.distanceTo(point) < collisionDistanceThreshold) {
        return false;
      }
    }
  }

  return true;
}

// ------------------------------------

// Day/Night Cycle --------------------
var day = true;

const ambientStep = 0.003;
const directionalStep = 0.005;

function turnDay() {
  for (var i = 0; i < 10; i++) {
    setTimeout(function () {
      ambientLight.intensity += ambientStep;
      directionalLight.intensity += directionalStep;
    }, 5000);
  }
  toggleDay();
}

function toggleDay() {
  ambientLight.intensity = 0.075;
  directionalLight.intensity = 0.1;
  pointLight.intensity = 0;
  spotLightRed.intensity = 0;
  spotLightGreen.intensity = 0;
  day = true;
}

function turnNight() {
  for (var i = 0; i < 10; i++) {
    setTimeout(function () {
      ambientLight.intensity -= ambientStep;
      directionalLight.intensity -= directionalStep;
      pointLight.intensity -= 0.1;
    }, 5000);
  }
  toggleNight();
}

function toggleNight() {
  ambientLight.intensity = 0.045;
  directionalLight.intensity = 0.05;
  pointLight.intensity = 1;
  spotLightRed.intensity = 1;
  spotLightGreen.intensity = 1;
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

// GUI --------------------------------

const lightFolder = gui.addFolder("Luzes");
var ambLightBt = {
  add: function () {
    toggleAmbientLight();
  },
};
lightFolder.add(ambLightBt, "add").name("Key I -> Ambient Light");
const dirLight = {
  add: function () {
    toggleDirectionalLight();
  },
};
lightFolder.add(dirLight, "add").name("Key O -> Directional Light");
var pointLightBt = {
  add: function () {
    togglePointLight();
  },
};
lightFolder.add(pointLightBt, "add").name("Key P -> Point Light");
var spotLightRedBt = {
  add: function () {
    toggleRedSpotlight();
  },
};
lightFolder.add(spotLightRedBt, "add").name("Key K -> Red Car Light");
var spotLightGreenBt = {
  add: function () {
    toggleGreenSpotlight();
  },
};
lightFolder.add(spotLightGreenBt, "add").name("Key L -> Green Car Light");

const cameraFolder = gui.addFolder("Câmera");
var cameraBt = {
  add: function () {
    toggleCam();
  },
};
cameraFolder.add(cameraBt, "add").name("Key C -> Toggle Camera");

const dayFolder = gui.addFolder("Dia/Noite");
var amanhecerBt = {
  add: function () {
    turnDay();
  },
};
dayFolder.add(amanhecerBt, "add").name("Amanhecer");
var dayLight = {
  add: function () {
    toggleDay();
  },
};
dayFolder.add(dayLight, "add").name("Dia");
var anoitecerBt = {
  add: function () {
    turnNight();
  },
};
dayFolder.add(anoitecerBt, "add").name("Anoitecer");
var nightLight = {
  add: function () {
    toggleNight();
  },
};
dayFolder.add(nightLight, "add").name("Noite");

const gameFolder = gui.addFolder("Jogo");
var collBt = {
  add: function () {
    toggleCollision();
  },
};
gameFolder.add(collBt, "add").name("Collision");
// ------------------------------------~

// Boot + Game Loop -------------------

function animate() {
  requestAnimationFrame(animate); // First

  // ------------------------------------
  if (loadedModel && loadedModel.scene && capi) {
    checkPlayerMovement();
    movingObstacles();
    movingPoint();
    movingOutObj();
    if (collision) checkPlayerCollision(capi.position);
  }
  // ------------------------------------

  render.render(scene, camera); // Last
}

function start() {
  loadResources();
  score = 0;
  collision = true;
  removeTextMesh();
  createTextMesh("Capi Rush");
  
  console.log("chamou");
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

  //load texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./assets/textures/skate.jpg");

  const skateBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.05, 0.9),
    new THREE.MeshPhongMaterial({ map: texture })
  );
  skate.add(skateBase);

  const borderGeometry = new THREE.CylinderGeometry(0.325, 0.325, 0.05);
  const borderMaterial = new THREE.MeshPhongMaterial({ map: texture });
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

  skate.castShadow = true;
  skate.receiveShadow = true;

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

  point.castShadow = true;
  point.receiveShadow = true;

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

  ball.castShadow = true;
  ball.receiveShadow = true;

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

  tire.position.set(0, 0, 0);
  tire.scale.set(0.4, 0.4, 0.4);
  tire2.position.set(0, 0, 0);
  tire2.scale.set(0.5, 0.5, 0.5);

  roda.add(tire);
  roda.add(tire2);

  roda.rotateZ(Math.PI / 2);

  roda.position.y = -0.8;

  roda.castShadow = true;
  roda.receiveShadow = true;

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
        new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load("./assets/textures/car_Red.jpg") })
      );
      break;
    case 1:
      main = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, extrudeSettings),
        new THREE.MeshPhongMaterial({  map: new THREE.TextureLoader().load("./assets/textures/car_Green.jpg") })
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
  tree.position.y = -0.25;

  tree.castShadow = true;
  tree.receiveShadow = true;

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
  tree2.position.y = 0.6;

  tree2.castShadow = true;
  tree2.receiveShadow = true;

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

  tree3.castShadow = true;
  tree3.receiveShadow = true;

  return tree3;
}

// ------------------------------------

// Gameover ---------------------------

function gameOver() {
  removeTextMesh();
  createTextMesh("GameOver");

  objSpeed = 0;
  const objetos = [
    ball,
    roda,
    car,
    roda1,
    roda2,
    roda3,
    roda4,
    spotLightRed,
    point,
    carGreen,
    rodaGreen1,
    rodaGreen2,
    rodaGreen3,
    rodaGreen4,
    spotLightGreen,
  ];

  for (const objeto of objetos) {
    scene.remove(objeto);
  }

  if (capi.position.x > 0) {
    playerMovement("left");
  } else if (capi.position.x < 0) {
    playerMovement("right");
  }

  playerMovement = false;
  toggleCam = false;

    //botão de Restart
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.style.position = "absolute";
    restartButton.style.display = "display";
    restartButton.style.alignItems = "center";
    restartButton.style.justifyContent = "center";
    document.body.appendChild(restartButton);
}

// ------------------------------------