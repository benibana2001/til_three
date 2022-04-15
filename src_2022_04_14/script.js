import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const parameters = {
    color: 0xff0000
}

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);

// const geometry = new THREE.BufferGeometry();
// const count = 2;
// const positionsArray = new Float32Array(count * 3 * 3);
// for(let i = 0; i < count * 3 * 3; i++) {
//     positionsArray[i] = (Math.random() - 0.5) * 4
// }

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// geometry.setAttribute('position', positionsAttribute);

// Texture
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log('loading started')
loadingManager.onLoad = () => console.log('loading finished')
loadingManager.onProgress = () => console.log('loading progressing')
loadingManager.onError = () => console.log('loading error')

const textureLoader = new THREE.TextureLoader(loadingManager);

const PATH_DOOR_TEXTURE = '/textures/door/'
const colorTexture = textureLoader.load(`${PATH_DOOR_TEXTURE}color.jpg`);
const colorTexture2 = textureLoader.load(`/textures/checkerboard-1024x1024.png`);//大きい画像
const colorTexture3 = textureLoader.load('/textures/checkerboard-8x8.png');//小さい画像
const colorTexture4 = textureLoader.load('/textures/minecraft.png');//小さい画像.maincraft
const alphaTexture = textureLoader.load(`${PATH_DOOR_TEXTURE}alpha.jpg`);
const heightTexture = textureLoader.load(`${PATH_DOOR_TEXTURE}height.jpg`);
const normalTexture = textureLoader.load(`${PATH_DOOR_TEXTURE}normal.jpg`);
const ambientOcclusionTexture = textureLoader.load(`${PATH_DOOR_TEXTURE}ambientOcclusion.jpg`);
const metalnessTexture = textureLoader.load(`${PATH_DOOR_TEXTURE}metalness.jpg`);
const roughnessTexture = textureLoader.load(`${PATH_DOOR_TEXTURE}roughness.jpg`);

colorTexture.minFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false

colorTexture3.magFilter = THREE.NearestFilter;
colorTexture4.magFilter = THREE.NearestFilter;
// Material
const material = new THREE.MeshBasicMaterial({map: colorTexture4});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Axes Helper
 */
 const axesHelper = new THREE.AxesHelper(2)
 scene.add(axesHelper)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// canvas.style.width = `${sizes.width}px`;
// canvas.style.height = `${sizes.height}px`;

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(2);
})
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if(!fullscreenElement) {
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if(canvas.webkitFullscreen){
            canvas.webkitRequestFullscreen()
        }
    }else {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        } 
    }
})

// Camera
const fov = 75;
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1, 1000)

camera.position.z = 3;
camera.lookAt(mesh.position)

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas ,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
// renderer.render(scene, camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// const clock = new THREE.Clock()
const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()

/**
 * Debug
 */
// gui.add(mesh.position, 'y', - 3, 3, 0.01);
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name("高さ");
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')
gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color)
})