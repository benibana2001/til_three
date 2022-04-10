import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

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
    width: 400,
    height: 300
}

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
// renderer.render(scene, camera);

/**
 * Animate
//  */
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
    
    console.log(cursor.x, cursor.y)
} )

// const clock = new THREE.Clock()
const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    // Update objects
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()
