import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material
const material = new THREE.MeshBasicMaterial({color: 0xff0000});

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
    console.log('double click');
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
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 1, 1000)

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
