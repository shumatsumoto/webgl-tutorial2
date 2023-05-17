import world from "./glsl/world";
import { viewport, gui } from "./helper";
import scroller from "./component/scroller";
import mouse from "./component/mouse";
import loader from "./component/loader";

window.debug = enableDebugMode(1);

// デバッグモード：1, 非デバッグモード：0
function enableDebugMode(debug) {
  return debug && import.meta.env.DEV;
}

export async function init() {
  const canvas = document.querySelector("#canvas");

  if(window.debug) {
    await gui.init();
  }
  
  viewport.init(canvas);

  scroller.init();

  loader.init();

  const loaderPercent = document.querySelector('.loader-percent');
  
  loader.addProgressAction((progress, total) => {
    loaderPercent.innerHTML = Math.round((progress/total) * 100) + "%";
  });

  await loader.loadAllAssets();

  await world.init(canvas, viewport);

  mouse.init();

  world.render();

  loader.letsBegin();

  if(window.debug) {

    gui.add(world.addOrbitControlGUI);
    
    gui.add((gui) => {
      world.os.forEach(o => {
        if(!o.debug) return;
        const type = o.$.el.dataset.webgl;
        const folder = gui.addFolder(type);
        folder.close();
        o.debug(folder);
      })
    })
  }
}




