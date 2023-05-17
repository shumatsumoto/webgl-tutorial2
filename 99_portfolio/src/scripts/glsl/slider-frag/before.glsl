uniform sampler2D texCurrent;
uniform sampler2D texNext;
uniform float progress;
varying vec2 vUv;

vec4 getFromColor(vec2 uv) {
   return texture(texCurrent, uv);
}

vec4 getToColor(vec2 uv) {
   return texture(texNext, uv);
}
