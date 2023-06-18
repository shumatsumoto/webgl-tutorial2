import { WebGLRenderer, Scene, PerspectiveCamera, Raycaster } from "three";
import { Ob } from "./Ob";

import { utils, viewport } from "../helper";
import mouse from "../component/mouse";

import NormalClass from "./normal";

const world = {
  os: [],
  raycaster: new Raycaster(),
  init,
  adjustWorldPosition,
  render,
};

function init(canvas, viewport) {
  world.renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  world.renderer.setSize(viewport.width, viewport.height, false);
  world.renderer.setPixelRatio(viewport.devicePixelRatio);
  world.renderer.setClearColor(0x000000, 0);

  world.scene = new Scene();

  world.camera = _setupPerspectiveCamera(viewport);

  _initObj(viewport);
}

async function _initObj(viewport) {
  const els = document.querySelectorAll("[data-webgl]");
  const prms = [...els].map(async (el) => {
    const type = el.dataset.webgl;
    console.log(type);
    let o = null;
    if (type === "normal") {
      debugger;
      o = await NormalClass.init({ el, type });
    } else if (type === "gray") {
      o = await NormalClass.init({ el, type });
    }
    world.scene.add(o.mesh);
    world.os.push(o);
    return o;
  });

  await Promise.all(prms);

  adjustWorldPosition(viewport);
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
  world.os.forEach((o) => resize(o, viewport));
  // cameraのProjectionMatrixの変更
  updateCamera(viewport);
}

function resize(o, newCanvasRect) {
  const {
    $: { el },
    mesh,
    geometry,
    rect,
  } = o;
  const nextRect = el.getBoundingClientRect();
  const { x, y } = getWorldPosition(nextRect, newCanvasRect);
  mesh.position.x = x;
  mesh.position.y = y;

  // 大きさの変更
  geometry.scale(nextRect.width / rect.width, nextRect.height / rect.height, 1);

  o.rect = nextRect;
}

function getWorldPosition(rect, canvasRect) {
  const x = rect.left + rect.width / 2 - canvasRect.width / 2;
  const y = -rect.top - rect.height / 2 + canvasRect.height / 2;
  return { x, y };
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
  // スクロール処理
  world.os.forEach((o) => scroll(o));

  // レイキャスティング
  raycast();

  world.renderer.render(world.scene, world.camera);
}

function scroll(o) {
  const {
    $: { el },
    mesh,
  } = o;
  const rect = el.getBoundingClientRect();
  const { x, y } = getWorldPosition(rect, viewport);
  // mesh.position.x = x;
  mesh.position.y = y;
}

function raycast() {
  const clipPos = mouse.getClipPos();
  world.raycaster.setFromCamera(clipPos, world.camera);

  // calculate objects intersecting the picking ray
  const intersects = world.raycaster.intersectObjects(world.scene.children);
  const intersect = intersects[0];

  for (let i = 0; i < world.scene.children.length; i++) {
    const _mesh = world.scene.children[i];

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
export default world;
