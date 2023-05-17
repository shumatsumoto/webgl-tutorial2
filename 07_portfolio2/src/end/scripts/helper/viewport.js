import { INode } from "./INode";

const viewport = {
  init,
  addResizeAction,
  removeResizeAction,
  isMobile
};

const $ = {};
const actions = new Set;

let initialized = false;
function init(canvas, cameraZ = 2000, near = 1500, far = 4000) {
  $.canvas = canvas;

  const rect = INode.getRect(canvas);

  viewport.width = rect.width;
  viewport.height = rect.height;
  viewport.near = near;
  viewport.far = far;
  viewport.cameraZ = cameraZ;
  viewport.aspect = viewport.width / viewport.height;
  viewport.rad = 2 * Math.atan(viewport.height / 2 / cameraZ);
  viewport.fov = viewport.rad * (180 / Math.PI);
  viewport.devicePixelRatio = 1; // window.devicePixelRatio;

  if(!initialized) {
    _bindEvents();
    initialized = true;
  }

  return viewport;
}

function _update() {
    const { near, far, cameraZ } = viewport;
    viewport.init($.canvas, cameraZ, near, far);
}

function _bindEvents() {
  let timerId = null;

  window.addEventListener("resize", () => {
    _onResize();
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      _onResize();
    }, 500);
  });
}

function _onResize() {
    _update();
    actions.forEach(action => action(viewport));
}

function isMobile() {
  return viewport.width < 1280;
}

function addResizeAction(callback) {
  actions.add(callback);
}

function removeResizeAction(callback) {
  actions.delete(callback);
}

export { viewport };
