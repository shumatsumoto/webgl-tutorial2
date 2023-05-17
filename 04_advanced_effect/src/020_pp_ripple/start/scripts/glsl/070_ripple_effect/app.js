/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import { initRipplePass } from "./pass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import vertexShader from "./vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

(async () => {
  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    -window.innerWidth / 2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    -window.innerHeight / 2,
    -window.innerHeight,
    window.innerHeight
  );

  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const { onMousemove, renderRipple, getTexture } = await initRipplePass(composer);

  const texLoader = new THREE.TextureLoader();
  const imageTex = await texLoader.loadAsync("/img/output1.jpg");

  const boxGeo = new THREE.BoxGeometry(300, 300, 300);
  const boxMate = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: `
    precision mediump float;

    varying vec2 vUv;
    
    void main() {
        gl_FragColor = vec4(vUv, 1., 1.);
    }
    `,
  });

  const cube = new THREE.Mesh(boxGeo, boxMate);
  
  const imgGeo = new THREE.PlaneGeometry(480, 270);
  const imgMate = new THREE.MeshBasicMaterial({ map: imageTex });
  const mesh = new THREE.Mesh(imgGeo, imgMate);
  cube.position.x = -200;
  mesh.position.x = 200;
  scene.add(mesh, cube);


  renderer.domElement.addEventListener("mousemove", onMousemove);

  function animate() {
    requestAnimationFrame(animate);
    renderRipple(renderer);
    composer.render();
    controls.update();
  }

  animate();
})();
