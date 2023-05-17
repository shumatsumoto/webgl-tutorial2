import { Vector4 } from "three";

const utils = {
  lerp,
  getResolutionUniform
};

// 線形補間
function lerp(a, b, n) {
  let current = (1 - n) * a + n * b;
  if (Math.abs(b - current) < 0.001) current = b;
  return current;
}

function getResolutionUniform(toRect, mediaRect) {
  const { width: toW, height: toH } = toRect;
  const resolution = new Vector4(toW, toH, 1, 1);

  if (!mediaRect) return resolution;

  const { width: mediaW, height: mediaH } = mediaRect;

  const mediaAspect = mediaH / mediaW;
  const toAspect = toH / toW;

  let xAspect, yAspect;
  if (toAspect > mediaAspect) {
    xAspect = (1 / toAspect) * mediaAspect;
    yAspect = 1;
  } else {
    xAspect = 1;
    yAspect = toAspect / mediaAspect;
  }

  resolution.z = xAspect;
  resolution.w = yAspect;
  return resolution;
}

export { utils };
