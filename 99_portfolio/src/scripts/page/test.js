/**
 * 下層ページ（diverse.html）用制御ファイル
 * 
 * 概要：data-page="sub"をキーに実行される
 */
let particles;
export default async function ({
  world,
  mouse,
  menu,
  loader,
  viewport,
  scroller,
}) {
  console.log("test is displayed")
  // ローディングアニメーションの追加
  // loader.addLoadingAnimation(loadAnimation);
}

function loadAnimation(tl) {
  // パーティクルのアニメーション
  tl.set({}, {
    onComplete() {
        particles.uniforms.uProgress.value = 0.5;
        particles.goTo(0, .3);
    }
  });
}
