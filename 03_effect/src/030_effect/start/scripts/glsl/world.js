import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Raycaster,
  AxesHelper,
} from "three";

import { utils } from "../helper";
import mouse from "../component/mouse";

// 2023/05/13 getObjByEl作成時の"Ob is not defined"エラーの解消
import { Ob } from "./Ob";

const world = {
  os: [],
  raycaster: new Raycaster(),
  tick: 0,
  init,
  adjustWorldPosition,
  render,
  addOrbitControlGUI
};

async function init(canvas, viewport) {
  world.renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  world.renderer.setSize(viewport.width, viewport.height, false);
  world.renderer.setPixelRatio(viewport.devicePixelRatio);
  world.renderer.setClearColor(0x000000, 0);

  world.scene = new Scene();

  world.camera = _setupPerspectiveCamera(viewport);
  
  await _initObj(viewport);
}

async function _initObj(viewport) {
  const els = document.querySelectorAll("[data-webgl]");
  const prms = [...els].map(async (el) => {
    const type = el.dataset.webgl;

    const o = await import(`./${type}/index.js`).then(({ default: Ob }) => {
      return Ob.init({ type, el });
    });
    
    if(!o.mesh) return;
    world.scene.add(o.mesh);
    world.os.push(o);
    return o;
  });

  await Promise.all(prms);

  adjustWorldPosition(viewport);

  const afterPrms = world.os.map((o) => o.afterInit());
  await Promise.all(afterPrms);
}

function _setupPerspectiveCamera(viewport) {
  const { fov, aspect, near, far, cameraZ } = viewport;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = cameraZ;
  return camera;
}

function adjustWorldPosition(viewport) {
  // canvasサイズの変更
  world.renderer.setSize(viewport.width, viewport.height, false);

  // meshの位置とサイズの変更
  world.os.forEach((o) => o.resize());
  // cameraのProjectionMatrixの変更
  updateCamera(viewport);
}

function updateCamera(viewport) {
  const { fov, aspect, near, far } = viewport;
  world.camera.fov = fov;
  world.camera.aspect = aspect;
  world.camera.near = near;
  world.camera.far = far;
  world.camera.updateProjectionMatrix();
  return world.camera;
}

function render() {
  requestAnimationFrame(render);
  world.tick++;
  // スクロール処理
  for(let i = world.os.length - 1; i >= 0; i--) {
    const o = world.os[i];
    o.scroll();
    o.render(world.tick);
  }

  // レイキャスティング
  raycast();

  world.renderer.render(world.scene, world.camera);
}

function raycast() {
  const clipPos = mouse.getClipPos();
  world.raycaster.setFromCamera(clipPos, world.camera);

  // calculate objects intersecting the picking ray
  const intersects = world.raycaster.intersectObjects(world.scene.children);
  const intersect = intersects[0];

  for (let i = world.scene.children.length - 1; i >= 0; i--) {
    const _mesh = world.scene.children[i];

    if(!_mesh.material?.uniforms) continue;
    
    const uHover = _mesh.material.uniforms.uHover;
    if (intersect?.object === _mesh) {
      _mesh.material.uniforms.uMouse.value = intersect.uv;
      uHover.__endValue = 1;
    } else {
      uHover.__endValue = 0;
    }

    uHover.value = utils.lerp(uHover.value, uHover.__endValue, 0.1);
  }
}

let axesHelper = null;
function addOrbitControlGUI(gui) {
  const isActive = { value: false };

  gui.add(isActive, "value")
    .name('OrbitControl')
    .onChange(() => {
      if(isActive.value) {
        axesHelper = new AxesHelper(1000);
        world.scene.add(axesHelper);
        _attachOrbitControl();
      } else {
        axesHelper?.dispose();
        _detachOrbitControl();
      }
    });
}

let orbitControl = null;
function _attachOrbitControl() {
  import('three/examples/jsm/controls/OrbitControls').then(({ OrbitControls }) => {
    orbitControl = new OrbitControls(world.camera, world.renderer.domElement);
    world.renderer.domElement.style.zIndex = 1;
  });
}
function _detachOrbitControl() {
  orbitControl?.dispose();
  world.renderer.domElement.style.zIndex = -1;
}
export default world;
