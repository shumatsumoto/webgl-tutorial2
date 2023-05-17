import gsap from "gsap";
import Scrollbar, { ScrollbarPlugin } from "smooth-scrollbar";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INode } from "../helper";

const scroller = {
  init,
  disable,
  enable
};

function init() {
  gsap.registerPlugin(ScrollTrigger);
  Scrollbar.use(DisablePlugin);

  const pageContainer = INode.getElement("#page-container");

  const scrollBar = Scrollbar.init(pageContainer, { delegateTo: document });

  scroller.scrollBar = scrollBar;

  ScrollTrigger.scrollerProxy(pageContainer, {
    scrollTop(value) {
      if (arguments.length) {
        scrollBar.scrollTop = value; // setter
      }
      return scrollBar.scrollTop; // getter
    },
    // getBoundingClientRect() {
    //   return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    // }
  });

  scrollBar.addListener(ScrollTrigger.update);

  ScrollTrigger.defaults({
    scroller: pageContainer,
  });

  
}

class DisablePlugin extends ScrollbarPlugin {
  static pluginName = 'disable';

  static defaultOptions = {
    disable: false,
  }

  transformDelta(delta) {
    return this.options.disable ? { x: 0, y: 0 } : delta;
  }
}

function disable() {
  scroller.scrollBar.updatePluginOptions('disable', {
    disable: true
  });
}

function enable() {
  scroller.scrollBar.updatePluginOptions('disable', {
    disable: false
  });
}

export default scroller;
