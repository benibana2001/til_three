import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTeture = textureLoader.load('/textures/xxx.jpg');

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
// const geometry = new THREE.BoxGeometry(1, 1, 1, 1);

// const count = geometry.attributes.position.count;
// const randoms = new Float32Array(count);
// for (let i = 0; i < count; i++) {
//     randoms[i] = Math.random();
// }
// geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

/**
 * Particles
 */
//Texture
const particleTexture = textureLoader.load('/textures/particles/chara.png');
// const particleTexture = textureLoader.load('/textures/particles/2.png');

// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}
for(let i = 0; i < count * 3; i++) {
    colors[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)


// Material
const particleMaterial = new THREE.PointsMaterial();
particleMaterial.size = 0.4;
// particleMaterial.color = new THREE.Color("blue");
particleMaterial.sizeAttenuation = true;
// particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;
// particleMaterial.alphaTest = 0.001;
// particleMaterial.depthTest = false;
particleMaterial.depthWrite = false;
particleMaterial.blending = THREE.AdditiveBlending; // impact the performances
particleMaterial.vertexColors = true;
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);
// scene.add(new THREE.Mesh(
//     new THREE.BoxBufferGeometry(),
//     new THREE.MeshBasicMaterial()
// ))

// Material
const material = new THREE.MeshBasicMaterial();

// const material = new THREE.RawShaderMaterial({
//   vertexShader: testVertexShader,
//   fragmentShader: testFragmentShader,
//   uniforms: {
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//     uTime: { value: 0 },
//     uColor: { value: new THREE.Color('orange') },
//     uTexture: { value: flagTeture },
//   },
// });

// gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
// gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');

// Mesh
// const mesh = new THREE.Mesh(geometry, material);
// mesh.scale.y = 2/3
// scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1, //near
  100 //far
);
gui.add(camera.position, "x").min(0).max(20).step(0.01).name('かめらx');
gui.add(camera.position, "y").min(0).max(20).step(0.01).name('かめら.y');
gui.add(camera.position, "z").min(0).max(20).step(0.01).name('かめら.z');
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update particles
//   particles.rotation.y = elapsedTime * 0.1
  for(var i = 0; i < count; i++) {
      const i3 = i * 3
      if(i % 2 === 0) {
        particlesGeometry.attributes.position.array[i3] += Math.random(elapsedTime) * 0.002;
        particlesGeometry.attributes.position.array[i3 + 1] += Math.random(elapsedTime) * 0.002;
        particlesGeometry.attributes.position.array[i3 + 2] += Math.random(elapsedTime) * 0.002;
      } else {
        particlesGeometry.attributes.position.array[i3] -= Math.random(elapsedTime) * 0.002;
        particlesGeometry.attributes.position.array[i3 + 1] -= Math.random(elapsedTime) * 0.002;
        particlesGeometry.attributes.position.array[i3 + 2] -= Math.random(elapsedTime) * 0.002;

      }
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update material
//   material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
