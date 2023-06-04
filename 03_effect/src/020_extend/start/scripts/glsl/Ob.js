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

    this.vertexShader = this.setupVertex();
    this.fragmentShader = this.setupFragment();

    this.material = new ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms,
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

  setupVertex() {
    throw new Error("このメソッドはオーバーライドして使用してください。");
  }

  setupFragment() {
    throw new Error("このメソッドはオーバーライドして使用してください。");
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
