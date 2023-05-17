import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Raycaster,
  AxesHelper,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import { utils, INode } from "../helper";
import mouse from "../component/mouse";
import { Ob } from "./Ob";

const world = {
  os: [],
  raycaster: new Raycaster(),
  tick: 0,
  composer: null,
  renderActions: new Set(),
  init,
  adjustWorldPosition,
  render,
  addOrbitControlGUI,
  addObj,
  removeObj,
  getObjByEl,
  addPass,
  removePass,
  addRenderAction,
  removeRenderAction,
  raycast
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
  
  
  world.composer = new EffectComposer(world.renderer);
  const renderPass = new RenderPass(world.scene, world.camera);
  world.composer.addPass(renderPass);

  await _initObj(viewport);
}

async function _initObj(viewport) {
  const els = INode.qsAll("[data-webgl]");
  const prms = [...els].map((el) => {
    const type = INode.getDS(el, "webgl");

    return import(`./${type}/index.js`).then(({ default: Ob }) => {
      return Ob.init({ type, el });
    });
    
  });

  const _os = await Promise.all(prms);

  _os.forEach(o => {
    if(!o.mesh) return;
    addObj(o);
  });
  
  adjustWorldPosition(viewport);

  const afterPrms = world.os.map((o) => o.afterInit());
  await Promise.all(afterPrms);
}

function addObj(o) {
  world.scene.add(o.mesh);
  world.os.push(o);
}

function removeObj(o, dispose = true) {
  world.scene.remove(o.mesh);
  const idx = world.os.indexOf(o);
  world.os.splice(idx, 1);
  
  if(dispose) {
    o.mesh.material.dispose();
    o.mesh.geometry.dispose();
  }
}

function getObjByEl(selector) {
  if(selector instanceof Ob) return selector;
  const targetEl = INode.getElement(selector);
  return world.os.find(o => o.$.el === targetEl);
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

  world.renderActions.forEach(action => action?.(world));

  world.composer.render();
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

function addPass(pass) {
  world.composer.addPass(pass);
}

function removePass(pass) {
  world.composer.removePass(pass);
}

function addRenderAction(callback) {
  world.renderActions.add(callback);
}

function removeRenderAction(callback) {
  world.renderActions.delete(callback);
}
export default world;
