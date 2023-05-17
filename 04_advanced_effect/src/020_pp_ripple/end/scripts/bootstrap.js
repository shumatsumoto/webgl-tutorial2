import world from "./glsl/world";
import { viewport, gui, INode } from "./helper";
import scroller from "./component/scroller";
import mouse from "./component/mouse";
import loader from "./component/loader";
import {
  mountNavBtnHandler,
  mountSkillBtnHandler,
  mountScrollHandler,
} from "./component/slide-handler";
import { initRipplePass } from "./glsl/ripple";

window.debug = enableDebugMode(1);

// デバッグモード：1, 非デバッグモード：0
function enableDebugMode(debug) {
  return debug && import.meta.env.DEV;
}

export async function init() {
  const canvas = INode.getElement("#canvas");

  if (window.debug) {
    await gui.init();
  }

  viewport.init(canvas, 2000, 1, 4000);

  scroller.init();

  loader.init();

  const loaderPercent = INode.getElement(".loader-percent");

  loader.addProgressAction((progress, total) => {
    loaderPercent.innerHTML = Math.round((progress / total) * 100) + "%";
  });

  await loader.loadAllAssets();

  await world.init(canvas, viewport);

  mountNavBtnHandler(".fv__slider", ".fv__btn.prev", ".fv__btn.next", ".fv__text-shader");
  // mountSkillBtnHandler(".skill__slider", ".fv__btn.prev", ".fv__btn.next", ".skill__ul");
  // mountScrollHandler(".skill__slider", ".skill", ".skill__ul");

  mouse.init();

  
  const { getTexture } = await initRipplePass(world, mouse);


  world.render();

  loader.letsBegin();

  // setTimeout(() => {
  //   const o = world.getObjByEl('[data-webgl="displace-slide"]');
  //   gsap.to(o.uniforms.uProgress, {
  //     value: 1,
  //     duration: 3,
  //     onComplete() {
  //       world.removeObj(o);
  //     }
  //   })
  // }, 2000);
  if (window.debug) {
    gui.add(world.addOrbitControlGUI);

    gui.add((gui) => {
      world.os.forEach((o) => {
        if (!o.debug) return;
        const type = INode.getDS(o.$.el, "webgl");
        const folder = gui.addFolder(type);
        folder.close();
        o.debug(folder);
      });
    });
  }
}
