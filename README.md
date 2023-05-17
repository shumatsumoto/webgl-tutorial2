# WebGL実践コードの手引き

## サンプルコードの動かし方
ターミナルを開き次のコマンドを実行
```bash
cd 01_integration # 立ち上げたいフォルダに移動
npm i # または pnpm i を実行
npm run dev # 開発サーバーを立ち上げる > ターミナルにURLが表示されるため、ブラウザで開く
```

※ 完成版のポートフォリオは```99_portfolio```フォルダになります。

## 動画内で紹介したライブラリ
- [gsap](https://greensock.com/scrolltrigger/)
- [gsap/scrollTrigger](https://greensock.com/scrolltrigger/)
- [smooth-scrollbar](https://idiotwu.github.io/smooth-scrollbar/)


## フォルダ・ファイル概要
```フォルダ構成
.editorconfig	                インデントや改行などのコーディングスタイルのルールを記述。
jsconfig.json	                プロジェクト全体のJSに関する設定（主にパス）
package.json	                依存パッケージなどの設定ファイル
vite.config.js	                Viteの設定ファイル
node_modules/	                プロジェクトにインストールしたパッケージ
public/	                        画像や動画、フォントファイルなど
src/                            スクリプトが格納されるフォルダ
│  diverse.html
│  index.html
│  
├─scripts                       JS用フォルダ
│  │  bootstrap.js              プロジェクト全体の制御ファイル
│  │  index.js                  エントリーポイント
│  │  
│  ├─component
│  │      loader.js             ローダー、画像の読み込みに関する記述を記述
│  │      menu.js               メニューに関する処理を記述
│  │      mouse-animation.js    マウスカーソルのアニメーションに関する処理を記述
│  │      mouse.js              マウスカーソルのスタイル、制御に関する処理を記述
│  │      scroll-animation.js   スクロールアニメーションに関する処理を記述
│  │      scroller.js           スクロールに関する処理を記述
│  │      slide-handler.js      スライダーに関する処理を記述
│  │      
│  ├─glsl                       メッシュの制御（Three.js関連のフォルダ）
│  │  │  Ob.js                  メッシュ制御クラス
│  │  │  world.js               Three.js制御メインファイル
│  │  │  
│  │  ├─distortion-text         エフェクトの制御（エフェクト毎にフォルダ追加）
│  │  │      fragment.glsl      フラグメントシェーダプログラム（必要な場合）
│  │  │      index.js           Ob.jsを継承をして、シェダーごとにパラメータをカスタマイズ    
│  │  │      vertex.glsl        頂点シェーダプログラム（必要な場合）
│  │  │      
│  │  └─shader-util             よく使うシェーダー部品の配置フォルダ
│  │         coverUv.glsl       
│  │         curl-noise.glsl
│  │         grayscale.glsl
│  │         parabola.glsl
│  │          
│  ├─helper                     汎用性のあるヘルパー関数を保存
│  │      config.js             プロジェクトの設定値を管理
│  │      gui.js                lil-guiの管理
│  │      index.js              helperフォルダのエントリーポイント
│  │      INode.js              DOMヘルパー
│  │      utils.js              汎用的な関数の記述
│  │      viewport.js           画面サイズに伴う制御
│  │      
│  └─page
│          home.js              HOME(index.html)ページ特有のJS処理を記述
│          sub.js               下層ページ(diverse.html)特有のJS処理を記述
│          
└─styles
    │  loader.scss              ローディング時に必要なスタイル
    │  style.scss               メインスタイル
    │  
    ├─globals
    │      _functions.scss      function記述
    │      _index.scss          globalsエントリーポイント
    │      _mixin.scss          mixin記述
    │      _mq.scss             メディアクエリ
    │      _variables.scss      Sass変数
    │      
    ├─pages
    │      _diverse.scss        Diverseページに必要なスタイル
    │      _home.scss           Homeページに必要なスタイル
    │      
    ├─parts
    │      _animation.scss      アニメーションスタイル
    │      _common.scss         サイト内の共通スタイル
    │      _fonts.scss          フォント制御スタイル
    │      _menu.scss           メニュースタイル
    │      _mouse.scss          マウスに関するスタイル
    │      _panel.scss          パネル表示用スタイル
    │      
    └─vendors                   サードパーティ製スタイル置き場
            css-reset.css       Reset CSS
```
