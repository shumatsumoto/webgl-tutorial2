import { Ob } from "../Ob";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { BoxGeometry } from "three";
import { viewport, gui } from "../../helper";

export default class extends Ob {
  setupUniforms() {
    const uniforms = super.setupUniforms();
    uniforms.uEdge = { value: 0 };
    return uniforms;
  }
  setupVertex() {
    return vertexShader;
  }
  setupFragment() {
    return fragmentShader;
  }
  afterInit() {}
  debug(folder) {
    folder.add(this.uniforms.uEdge, "value", 0, 1, 0.01);
  }
}
