import "./style.scss";

import { WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, MeshBasicMaterial, Mesh } from "three";

const world = {};

init();
function init() {
    const canvas = document.querySelector('#canvas');
    const canvasRect = canvas.getBoundingClientRect();
    console.log(canvasRect);
    
    world.renderer = new WebGLRenderer({
        canvas,
        antialias: true
    });
    world.renderer.setSize(canvasRect.width, canvasRect.height, false);
    world.renderer.setPixelRatio(window.devicePixelRatio);
    world.renderer.setClearColor(0x000000, 0);

    world.scene = new Scene();

    const cameraWidth = canvasRect.width;
    const cameraHeight = canvasRect.height;
    const near = 1500;
    const far = 4000;
    const aspect = cameraWidth / cameraHeight;
    const cameraZ = 2500;
    const radian = 2 * Math.atan(cameraHeight / 2 / cameraZ);
    const fov = radian * (180 / Math.PI);
    world.camera = new PerspectiveCamera(fov, aspect, near, far);
    world.camera.position.z = cameraZ;

    const els = document.querySelectorAll('[data-webgl]');
    els.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        const geometry = new PlaneGeometry(rect.width,rect.height, 1, 1);
        const material = new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: .3 });
        const mesh = new Mesh(geometry, material);
        mesh.position.z = 0;

        const { x, y } = getWorldPosition(rect, canvasRect);
        mesh.position.x = x;
        mesh.position.y = y;

        world.scene.add(mesh);
    })


    animate();
    function animate() {
        requestAnimationFrame(animate);
        world.renderer.render(world.scene, world.camera);
    }
}

function getWorldPosition(rect, canvasRect) {
    const x = rect.left + rect.width / 2 - canvasRect.width / 2;
    const y = - rect.top - rect.height / 2 + canvasRect.height / 2;
    return { x, y };
}