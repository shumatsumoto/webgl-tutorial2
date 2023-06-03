import world from "./glsl/world";
import { viewport } from "./helper";
import scroller from "./component/scroller";
import mouse from "./component/mouse";
import loader from "./component/loader";

export function init() {
  const canvas = document.querySelector("#canvas");
  viewport.init(canvas);

  scroller.init();

  loader.loadAllAssets();

  world.init(canvas, viewport);

  mouse.init();

  world.render();
}
