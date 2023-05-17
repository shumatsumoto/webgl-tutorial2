import {
  SphereGeometry,
  PlaneGeometry,
} from "three";
import gsap from "gsap";

import { Ob } from "../Ob";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { INode, viewport } from "../../helper";

export default class extends Ob {
  setupUniforms() {
    const uniforms = super.setupUniforms();
    uniforms.uSphereScale = { value: 2 };
    uniforms.uDelay = { value: 0.7 };
    uniforms.uNoiseFreq = { value: 1 };
    uniforms.uNoiseLevel = { value: 0.2 };
    uniforms.uFreq = { value: 0.02 };
    uniforms.uReversal = { value: 1 };
    return uniforms;
  }
  setupGeometry() {
    const wSeg = this.rect.width / 10,
      hSeg = this.rect.height / 10;

    const radius = this.rect.width / 10;
    const sphere = new SphereGeometry(radius, wSeg, hSeg);
    const plane = new PlaneGeometry(
      this.rect.width,
      this.rect.height,
      wSeg,
      hSeg
    );
    
    sphere.rotateY(Math.PI * 3 / 2);
    sphere.translate(0, 0, -radius);
    plane.setAttribute("sphere", sphere.getAttribute("position"));
    plane.setAttribute("sphereNormal", sphere.getAttribute("normal"));

    return plane;
  }
  setupVertex() {
    return vertexShader;
  }
  setupFragment() {
    return fragmentShader;
  }
  render(tick) {
    super.render(tick);

    if(this.uniforms.uHover.value === 0) return;

    const rect = INode.getRect(this.$.el);
    const { x, y } = this.getWorldPosition(rect, viewport);
    this.mesh.position.x = x + (this.uniforms.uMouse.value.x - 0.5) * 50. * this.uniforms.uHover.value;
    this.mesh.position.y = y + (this.uniforms.uMouse.value.y - 0.5) * 50. * this.uniforms.uHover.value;

    this.mesh.scale.x = 1. + 0.1 * this.uniforms.uHover.value;
    this.mesh.scale.y = 1. + 0.1 * this.uniforms.uHover.value;
    
    this.mesh.rotation.x = -(this.uniforms.uMouse.value.y - 0.5) * this.uniforms.uHover.value / 1.5;
    this.mesh.rotation.y = (this.uniforms.uMouse.value.x - 0.5) * this.uniforms.uHover.value / 1.5;
  }
  debug(folder) {
    folder.add(this.uniforms.uReversal, "value", 0, 1, 0.1).name("uReversal").listen();
    folder.add(this.uniforms.uSphereScale, "value", 0, 5, 0.1).name("uSphereScale").listen();
    folder.add(this.uniforms.uNoiseFreq, "value", 0, 10, 0.01).name("uNoiseFreq").listen();
    folder.add(this.uniforms.uNoiseLevel, "value", 0, 1, 0.01).name("uNoiseLevel").listen();
    folder.add(this.uniforms.uFreq, "value", 0, 0.1, 0.001).name("uFreq").listen();
    folder.add(this.uniforms.uDelay, "value", 0, 1, 0.01).name("uDelay").listen();
    folder.add(this.uniforms.uProgress, "value", 0, 1, 0.1).name("progress").listen();
  const datObj = { next: !!this.uniforms.uProgress.value };
  folder
    .add(datObj, "next")
    .name("Animate")
    .onChange(() => {
      gsap.to(this.uniforms.uProgress, {
        value: +datObj.next,
        duration: 2,
        ease: "power2.out",
      });
    });
  }
}
