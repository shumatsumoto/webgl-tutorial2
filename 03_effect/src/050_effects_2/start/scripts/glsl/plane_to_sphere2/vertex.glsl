precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)

#pragma glslify: rotate = require(glsl-rotate)

varying vec2 vUv;
varying float vDelay;
attribute float aDelay;
// attribute vec3 plane;
attribute vec3 sphere;

uniform float uProgress;
uniform float uScaleDelay;
uniform float uScaleTime;

void main() {
    vUv = uv;
    vDelay = aDelay;

    float delay = easeBack(clamp(uProgress * 2. - (1. - uv.y ), 0., 1.));
    vec3 pos = mix(position, sphere, delay);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 7. * (1000. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}