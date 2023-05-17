varying vec2 vUv;
uniform vec2 uMouse;
uniform vec4 uResolution;
uniform float uHover;
uniform sampler2D tex1;
uniform sampler2D tex2;

#pragma glslify: coverUv = require(../shader-util/coverUv);

void main() {
    vec2 uv = coverUv(vUv, uResolution);

    vec4 t1 = texture2D(tex1, uv);
    vec4 t2 = texture2D(tex2, uv);
    vec4 color = mix(t1, t2, step(.5, uv.x));
    gl_FragColor = color;
}