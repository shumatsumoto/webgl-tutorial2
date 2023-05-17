import world from "./glsl/world";
import { viewport, gui, INode, utils } from "./helper";
import menu from "./component/menu";
import scroller from "./component/scroller";
import mouse from "./component/mouse";
import loader from "./component/loader";
import { registScrollAnimations } from "./component/scroll-animation";

window.debug = enableDebugMode(1);

// デバッグモード：1, 非デバッグモード：0
function enableDebugMode(debug) {
  return debug && import.meta.env.DEV;
}

export async function init() {
  const canvas = INode.getElement("#canvas");
  const pageEl = INode.getElement("#page-container");
  const pageType = INode.getDS(pageEl, 'page');

  if (window.debug) {
    await gui.init();
  }

  viewport.init(canvas, 2000, 1500, 4000);

  scroller.init();

  loader.init();

  await utils.definePerformanceMode();

  const loaderPercent = INode.getElement(".loader-percent");

  loader.addProgressAction((progress, total) => {
    loaderPercent.innerHTML = Math.round((progress / total) * 100) + "%";
  });

  await loader.loadAllAssets();

  const bgColor = "none";
  await world.init(canvas, viewport, bgColor);

  addGUI(world);

  await import(`./page/${pageType}.js`).then(({ default: init }) => {
    return init({ world, mouse, menu, loader, viewport, scroller });
  });
    
  mouse.init(false, true);

  viewport.addResizeAction(() => {
    world.adjustWorldPosition(viewport);

    mouse.resize();
  });

  world.addRenderAction(() => {
    mouse.render();

    // レイキャスティング
    world.raycast();
  });

  registScrollAnimations();

  menu.init(world, scroller);

  world.render();

  await loader.letsBegin();

  // ローディング完了後のアクション
  mouse.makeVisible();
}

function addGUI(world) {
  if (window.debug) {
    gui.add(world.addOrbitControlGUI);

    gui.add((gui) => {
      gui.close();
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
