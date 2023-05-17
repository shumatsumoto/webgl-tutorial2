import "./style.scss";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

const world = {};
const os = [];
const canvas = document.querySelector("#canvas");
const canvasRect = canvas.getBoundingClientRect();

init();
function init() {
  world.renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  world.renderer.setSize(canvasRect.width, canvasRect.height, false);
  world.renderer.setPixelRatio(window.devicePixelRatio);
  world.renderer.setClearColor(0x000000, 0);

  world.scene = new Scene();

  const cameraWidth = canvasRect.width;
  const cameraHeight = canvasRect.height;
  const near = 1500;
  const far = 4000;
  const aspect = cameraWidth / cameraHeight;
  const cameraZ = 2000;
  const radian = 2 * Math.atan(cameraHeight / 2 / cameraZ);
  const fov = radian * (180 / Math.PI);
  world.camera = new PerspectiveCamera(fov, aspect, near, far);
  world.camera.position.z = cameraZ;

  const els = document.querySelectorAll("[data-webgl]");
  els.forEach((el) => {
    const rect = el.getBoundingClientRect();

    const geometry = new PlaneGeometry(rect.width, rect.height, 1, 1);
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.3,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.z = 0;

    const { x, y } = getWorldPosition(rect, canvasRect);
    mesh.position.x = x;
    mesh.position.y = y;

    const o = {
      mesh,
      geometry,
      material,
      rect,
      $: {
        el,
      },
    };

    world.scene.add(mesh);
    os.push(o);
  });

  initScroller();

  render();
  function render() {
    requestAnimationFrame(render);
    // スクロール処理
    os.forEach((o) => scroll(o));
    world.renderer.render(world.scene, world.camera);
  }
}

function scroll(o) {
  const {
    $: { el },
    mesh,
  } = o;
  const rect = el.getBoundingClientRect();
  const { x, y } = getWorldPosition(rect, canvasRect);
  // mesh.position.x = x;
  mesh.position.y = y;
}

function getWorldPosition(rect, canvasRect) {
  const x = rect.left + rect.width / 2 - canvasRect.width / 2;
  const y = -rect.top - rect.height / 2 + canvasRect.height / 2;
  return { x, y };
}

function initScroller() {
  gsap.registerPlugin(ScrollTrigger);

  const el = document.querySelector("[data-webgl]");

  /**
   * 練習問題.１
   * メッシュを元の位置から右に600px、かつ360度回転するアニメーションを作成してください。オプションは以下の通りとしてください。
   * trigger start: "center 80%"
   * trigger end: "center 20%"
   * scrub: true
   * pin: true
   **/
  const meshX = os[0].mesh.position.x;
  const animation = {
    rotation: 0,
    x: meshX,
  }
  gsap.to(animation, {
    rotation: Math.PI * 2,
    x: meshX + 600,
    scrollTrigger: {
        trigger: el,
        start: "center 80%",
        end: "center 20%",
        scrub: true,
        pin: true
    },
    onUpdate() {
        os[0].mesh.position.x = animation.x;
        os[0].mesh.rotation.z = animation.rotation;
    }
  })
}
