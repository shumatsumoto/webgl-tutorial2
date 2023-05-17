precision mediump float;

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D texRipple;

void main() {
    vec4 ripple = texture(texRipple, vUv);
    vec2 rippleUv = vUv + ripple.r * .1;
    vec4 color = texture(tDiffuse, rippleUv);
    gl_FragColor = color;
}