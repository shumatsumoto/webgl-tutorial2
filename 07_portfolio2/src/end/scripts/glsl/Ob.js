import gsap from "gsap";
import { PlaneGeometry, ShaderMaterial, Mesh, Vector2 } from "three";
import { utils, viewport, INode } from "../helper";
import loader from "../component/loader";

class Ob {
  static async init({ el, type }) {
    const texes = await loader.getTexByElement(el);
    const o = new this({ texes, el, type });
    return o;
  }

  constructor({ texes, el, type }) {
    this.$ = { el };
    this.texes = texes ?? [];

    this.scale = { width: 1, height: 1, depth: 1 };
    this.resizing = false;

    this.rect = this.originalRect = INode.getRect(el);

    if (!this.rect.width || !this.rect.height) {
      if (window.debug) {
        console.log(
          "要素に1px x 1px以上の大きさがないため、メッシュの作成をスキップします:",
          this.$.el
        );
      }
      return {};
    }

    try {
      this.beforeCreateMesh();
      this.defines = this.setupDefines();
      this.uniforms = this.setupUniforms();
      this.uniforms = this.setupTexes(this.uniforms);
      this.uniforms = this.setupResolution(this.uniforms);
      this.vertexShader = this.setupVertex();
      this.fragmentShader = this.setupFragment();
      this.material = this.setupMaterial();
      this.geometry = this.setupGeometry();
      this.mesh = this.setupMesh();
      this.disableOriginalElem();

      this.mesh.__marker = type;
    } catch (e) {
      if (window.debug) {
        console.log(e);
      }
      return {};
    }
  }

  beforeCreateMesh() {}

  setupDefines() {
    return {
      PI: Math.PI,
    };
  }

  setupUniforms() {
    return {
      uTick: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uAlpha: { value: 0 },
      uHover: { value: 0 },
      uProgress: { value: 0 },
    };
  }

  setupTexes(uniforms) {
    this.texes.forEach((tex, key) => {
      uniforms[key] = { value: tex };
    });
    return uniforms;
  }

  setupGeometry() {
    return new PlaneGeometry(this.rect.width, this.rect.height, 1, 1);
  }

  setupMaterial() {
    return new ShaderMaterial({
      defines: this.defines,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      alphaTest: 0.5,
    });
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

  setupMesh() {
    return new Mesh(this.geometry, this.material);
  }

  disableOriginalElem() {
    this.$.el.draggable = false;
    this.$.el.style.opacity = 0;
  }

  async resize(duration = 1) {
    this.resizing = true;

    const {
      $: { el },
      mesh,
      originalRect,
    } = this;

    this.setupResolution(this.uniforms);

    const nextRect = INode.getRect(el);
    const { x, y } = this.getWorldPosition(nextRect, viewport);

    const p1 = new Promise(onComplete => {
      gsap.to(mesh.position, {
        x,
        y,
        overwrite: true,
        duration,
        onComplete
      })
    });

    // 大きさの変更
    const p2 = new Promise(onComplete => {
      gsap.to(this.scale, {
        width: nextRect.width / originalRect.width,
        height: nextRect.height / originalRect.height,
        depth: 1,
        overwrite: true,
        duration,
        onUpdate: () => {
          mesh.scale.set(this.scale.width, this.scale.height, this.scale.depth);
        },
        onComplete
      })
    });

    await Promise.all([p1, p2]);

    this.rect = nextRect;

    this.resizing = false;

  }

  getWorldPosition(rect, canvasRect) {
    const x = rect.left + rect.width / 2 - canvasRect.width / 2;
    const y = -rect.top - rect.height / 2 + canvasRect.height / 2;
    return { x, y };
  }

  scroll() {
    if(this.fixed) return;
    const {
      $: { el },
      mesh,
    } = this;
    const rect = INode.getRect(el);
    const { x, y } = this.getWorldPosition(rect, viewport);
    // mesh.position.x = x;
    mesh.position.y = y;
  }

  render(tick) {
    this.uniforms.uTick.value = tick;
  }

  async afterInit() {}

  async playVideo(texId = "tex1") {
    await this.uniforms[texId].value.source.data.play?.();
  }

  pauseVideo(texId = "tex1") {
    this.uniforms[texId].value.source.data.pause?.();
  }

  // debug(folder) {

  // }
}

export { Ob };
