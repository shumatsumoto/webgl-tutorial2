import { LinearFilter, TextureLoader } from "three";

const textureCache = new Map();
const texLoader = new TextureLoader();

window.textureCache = textureCache;

const loader = {
  loadAllAssets,
  loadImg,
  getTexByElement,
};

async function loadAllAssets() {
  const els = document.querySelectorAll("[data-webgl]");
  for (const el of els) {
    const data = el.dataset;
    for (let key in data) {
      if (!key.startsWith("tex")) continue;

      const url = data[key];
      if (!textureCache.has(url)) {
        textureCache.set(url, null);
      }
    }
  }

  const texPrms = [];

  textureCache.forEach((_, url) => {
    const prms = loadImg(url).then((tex) => {
      textureCache.set(url, tex);
    });

    texPrms.push(prms);
  });

  await Promise.all(texPrms);
}

let total = 0;
let progress = 0;

async function loadImg(url) {
  // 読み込み対象のトータルの数値に + 1
  incrementTotal();
  const tex = await texLoader.loadAsync(url);
  // 読み込み対象のプログレスの数値に + 1
  incrementProgress();
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.needsUpdate = false;
  return tex;
}

function incrementTotal() {
  total++;
}

function incrementProgress() {
  progress++;
  progressAction(progress, total);
}

function progressAction(progress, total) {
  console.log(progress, total);
}

async function getTexByElement(el) {
  const texes = new Map();
  const data = el.dataset;

  let mediaLoaded = null;
  let first = true;
  for (let key in data) {
    if (!key.startsWith("tex")) continue;

    const url = data[key];
    const tex = textureCache.get(url);

    key = key.replace("-", "");

    texes.set(key, tex);

    if (first && el instanceof HTMLImageElement) {
      mediaLoaded = new Promise((resolve) => {
        el.onload = resolve;
      });

      el.src = url;
      first = false;
    }
  }

  await mediaLoaded;

  return texes;
}

export default loader;
