import { WebGLRenderer } from "three";
import "./style.scss";

init();
function init() {
  const canvas = document.querySelector("#canvas");
  const renderer = new WebGLRenderer();
  console.log(canvas);
}
