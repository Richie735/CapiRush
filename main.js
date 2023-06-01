// Imports ----------------------------
import './style.css'

import * as THREE from 'three';

import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// ------------------------------------



// Init Setup -------------------------

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const render = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

// ------------------------------------


// Camera Setup -----------------------

camera.position.set(0, 0 , 7);

// ------------------------------------


// Render Setup -----------------------

render.setPixelRatio(window.devicePixelRatio);
render.setSize(window.innerWidth, window.innerHeight);
render.render(scene, camera);

// ------------------------------------

// Test Model -------------------------
const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
const boxMaterial = new THREE.MeshNormalMaterial();
const capi = new THREE.Mesh(boxGeometry, boxMaterial);
capi.position.set(0, -10, -50);
scene.add(capi);
// ------------------------------------


// Font Test---------------------------

const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();

ttfLoader.load('assets/fonts/Bungee-Regular.ttf', (json) => {
  // First parse the font.
  const BungeeFont = fontLoader.parse(json);
  // Use parsed font as normal.
  const textGeometry = new TextGeometry('CapiRush', {
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
animate();