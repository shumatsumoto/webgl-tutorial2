import { initDistortionPass } from "../glsl/distortion-text/pass";
import {
  mountNavBtnHandler,
  mountSkillBtnHandler,
  mountScrollHandler,
} from "../component/slide-handler";
import { INode, utils } from "../helper";

let world = null,
  _goTo = null,
  _removePass = null,
  _setProgress = null;
export default async function ({
  world: _world,
  mouse,
  menu,
  loader,
  viewport,
  scroller,
}) {
  world = _world;

  const planeEls = INode.qsAll(".panel__media");
  planeEls.forEach((planeEl) => world.addRaycastingTarget(planeEl));

  const { removePass, setProgress } = initDistortionPass(world);
  _setProgress = setProgress;
  _removePass = removePass;
  const { goTo } = mountNavBtnHandler(
    ".fv__slider",
    ".fv__btn.prev",
    ".fv__btn.next",
    ".fv__text-shader"
  );
  _goTo = goTo;
  mountScrollHandler(".skill__slider", ".skill", ".skill__ul");

  const fresnel = world.getObjByEl(".fresnel");
  if (fresnel) {
    fresnel.mesh.position.z = -1000;
  }

  const fvText = world.getObjByEl(".fv__text-shader");
  if (fvText) {
    fvText.mesh.position.z = 200;
  }

  loader.addLoadingAnimation(loadAnimation);
}

function loadAnimation(tl) {
  _goTo(5);
  const distorionProgress = { value: 0 };
  tl.to(distorionProgress, {
    value: 1,
    duration: 0.3,
    onUpdate() {
      _setProgress(distorionProgress.value);
    },
    onComplete: _removePass,
  });
}
