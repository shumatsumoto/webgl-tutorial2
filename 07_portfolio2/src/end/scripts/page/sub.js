let particles;
export default async function ({
  world,
  mouse,
  menu,
  loader,
  viewport,
  scroller,
}) {
  const fresnel = world.getObjByEl(".fresnel");
  if (fresnel) {
    fresnel.mesh.position.z = -1000;
  }

  particles = world.getObjByEl("#particles");

  loader.addLoadingAnimation(loadAnimation);
}

function loadAnimation(tl) {
    tl.set({}, {
        onComplete() {
            particles.uniforms.uProgress.value = 0.5;
            particles.goTo(0, .3);
        }
    })
}
