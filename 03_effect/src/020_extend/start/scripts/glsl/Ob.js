import { PlaneGeometry, ShaderMaterial, Mesh, Vector2 } from "three";
import { utils } from "../helper";
import loader from "../component/loader";

class Ob {
  static async init({ el, type }) {
    const texes = await loader.getTexByElement(el);
    const o = new this({ texes, el, type });
    return o;
  }

  constructor({ texes, el, type }) {

    this.$ = { el };
    this.texes = texes;

    this.rect = el.getBoundingClientRect();

    this.geometry = new PlaneGeometry(this.rect.width, this.rect.height, 1, 1);
    
    this.uniforms = {
      uMouse: { value: new Vector2(0.5, 0.5) },
      uHover: { value: 0 },
    };

    this.material = new ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec2 uMouse;
        uniform vec4 uResolution;
        uniform float uHover;
        uniform sampler2D tex1;
        uniform sampler2D tex2;

        vec2 coverUv(vec2 uv, vec4 resolution) {
          return (uv - .5) * resolution.zw + .5;
        }

        void main() {
          // vec2 mouse = step(uMouse, vUv);
          // gl_FragColor = vec4(mouse, uHover, 1.);

          vec2 uv = coverUv(vUv, uResolution);

          vec4 t1 = texture2D(tex1, uv);
          vec4 t2 = texture2D(tex2, uv);
          vec4 color = mix(t1, t2, step(.5, uv.x));
          gl_FragColor = t1;
        }
      `,
      uniforms: this.uniforms
    });



    this.uniforms = this.setupResolution(this.uniforms);

    this.texes.forEach((tex, key) => {
      this.uniforms[key] = { value: tex };
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.z = 0;

    // const o = {
    //   mesh,
    //   geometry,
    //   material,
    //   rect,
    //   $: {
    //     el,
    //   },
    // };
  }

  setupResolution(uniforms) {
    if (!this.texes.get("tex1")) return uniforms;

    const media = this.texes.get("tex1").source.data;

    const mediaRect = {};
    if (media instanceof HTMLImageElement) {
      mediaRect.width = media.naturalWidth;
      mediaRect.height = media.naturalHeight;
    } else if (media instanceof HTMLVideoElement) {
      mediaRect.width = media.videoWidth;
      mediaRect.height = media.videoHeight;
    }
    const resolution = utils.getResolutionUniform(this.rect, mediaRect);
    uniforms.uResolution = { value: resolution };

    return uniforms;
  }

}

export { Ob };
