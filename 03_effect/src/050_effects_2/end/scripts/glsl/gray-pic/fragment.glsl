varying vec2 vUv;
uniform vec4 uResolution;
uniform float uHover;
uniform sampler2D tex1;

#pragma glslify: coverUv = require(../shader-util/coverUv)
#pragma glslify: grayscale = require(../shader-util/grayscale)

void main() {
    vec2 uv = coverUv(vUv, uResolution);

    vec4 t1 = texture2D(tex1, uv);
    vec4 grayT1 = grayscale(t1);
    vec4 color = mix(grayT1, t1, uHover);
    gl_FragColor = color;
}