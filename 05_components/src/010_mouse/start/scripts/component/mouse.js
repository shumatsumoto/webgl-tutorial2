import { Vector2 } from "three";

import { viewport, INode } from "../helper";
const current = new Vector2();
const mousemoveActions = new Set();

const mouse = {
  current,
  tick: 0,
  init,
  getClipPos,
  getMapPos,
  addMousemoveAction,
  removeMousemoveAction
};

function init() {
  _bindEvents();
}

function _updatePosition(event) {
  current.x = event.clientX;
  current.y = event.clientY;
  mouse.tick++;
}

function getClipPos() {
  return {
    x: (current.x / viewport.width) * 2 - 1,
    y: -(current.y / viewport.height) * 2 + 1,
  };
}

function getMapPos(width, height) {
  const clipPos = getClipPos();
  return {
    x: clipPos.x * width / 2, 
    y: clipPos.y * height / 2
  }
}

function _bindEvents() {
  const globalContainer = INode.getElement("#global-container");
  globalContainer.addEventListener("pointermove", (event) => {
    mousemoveActions.forEach(action => action?.(mouse));
    _updatePosition(event);
  });
}

function addMousemoveAction(callback) {
  mousemoveActions.add(callback);
}

function removeMousemoveAction(callback) {
  mousemoveActions.delete(callback);
}

export default mouse;
