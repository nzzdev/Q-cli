import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import json from "@rollup/plugin-json";
import svg from "rollup-plugin-svg";
import html from "@rollup/plugin-html";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import packageConfig from "./package.json";
import qConfig from "./q.config.json";

const production = !process.env.ROLLUP_WATCH;

function getOutputs() {
  const outputs = [];
  for (let item of qConfig.items) {
    for (let environment of item.environments) {
      outputs.push({
        sourcemap: production ? false : true,
        format: "iife",
        name: `window._q_custom_code_${environment.id}.App`,
        file: `public/bundle-${environment.id}.js`,
      });
    }
  }

  return outputs;
}

function getTemplate(options) {
  return `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>${packageConfig.name}</title>
    <link rel="stylesheet" href="https://context-service.st.nzz.ch/stylesheet/all/nzz.ch.css" />
    <link rel="stylesheet" href="https://service.sophie.nzz.ch/bundle/sophie-q@^1,sophie-input@^1,sophie-font@^1,sophie-color@^1,sophie-viz-color@^1,sophie-legend@^1.css" />
    <link rel="stylesheet" href="bundle.css" />
  </head>
  <!-- we have four different article templates, since the article itself has the same structure in each template
  we can use either of these classes: regular, longformstandard, regular, opinion
  if one changes the class attached to body tag one should change the class in section tag accordingly (maybe further adjustments needed too) -->
  <body class="regular">
    <div id="__nzz">
      <div id="__layout">
        <div class="page--article-id">
          <div class="pageholder">
            <div class="nzz-container">
              <div class="nzz-page-transition">
                <div class="article">
                  <!-- also here change layout--{template} accordingly -->
                  <section class="container container--article layout--regular">
                    <!-- default = content width, for fullwidth, small left/right one has to add one of
                      the following classes accordingly: widget--fullwidth, widget--left, widget--right-->
                    <div class="articlecomponent q-embed widget--qembed regwalled">
                      <div>
                        <div class="s-q-item" id="container"></div>
                        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Map,URL,Promise,fetch,URLSearchParams,Array.prototype.find,Array.prototype.findIndex,Object.entries,Array.prototype.includes,CustomEvent,Array.from,String.prototype.startsWith&flags=gated&unknown=polyfill"></script>
                        <script src="${options.files.js[0].fileName}"></script>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function getHtmlOptions() {
  return {
    fileName: "index.html",
    template: function (options) {
      return getTemplate(options);
    },
  };
}

export default {
  input: production ? "src/main-prod.js" : "src/main.js",
  output: getOutputs(),
  plugins: [
    json(),
    svg({ base64: true }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      //
      // second parameter of css.write function defines
      // whether a sourcemap should be generated
      css: (css) => {
        css.write("public/bundle.css", production ? false : true);
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({ browser: true }),
    commonjs(),

    // Generate a index.html file when not building for production
    !production && html(getHtmlOptions()),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), transpile and minify
    production &&
      buble({
        transforms: {
          dangerousForOf: true,
        },
      }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
  onwarn: function (warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
