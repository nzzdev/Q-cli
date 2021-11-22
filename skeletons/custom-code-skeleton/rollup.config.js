import * as fs from "fs";
import * as path from "path";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import json from "@rollup/plugin-json";
import svg from "rollup-plugin-svg";
import html from "@rollup/plugin-html";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import scss from "rollup-plugin-scss";
import postcss from "postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import packageConfig from "./package.json";
import qConfig from "./q.config.json";

const production = !process.env.ROLLUP_WATCH;

function getOutputConfigs() {
  const outputConfigs = [];
  for (let item of qConfig.items) {
    for (let environment of item.environments) {
      if (environment.id !== "") {
        outputConfigs.push({
          sourcemap: production ? false : true,
          format: "iife",
          name: `window._q_custom_code_${environment.id}.App`,
          file: `public/bundle-${environment.id}.js`,
        });
      }
    }
  }

  return outputConfigs;
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

function getPostcssPlugins(isProduction) {
  const postcssPlugins = [autoprefixer];

  if (isProduction) {
    postcssPlugins.push(cssnano);
  }

  return postcssPlugins;
}

function createOutputCssFunction() {
  const outputCssFunction = (styles, styleNodes) => {
    const publicDir = "public";

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(`${publicDir}/bundle.css`, styles);
  };

  return outputCssFunction;
}

function getSassConfig(isProduction) {
  const config = {
    outputStyle: isProduction ? "compressed" : "expanded",
    // Sourcemap generation (specifically writing the file to system) is currently not supported by rollup-plugin-sass (but soon!)
    // See: https://github.com/thgh/rollup-plugin-scss/issues/7
    // outFile: path.join(__dirname, "/public/default.css"), // <- Uncomment after: https://github.com/thgh/rollup-plugin-scss/issues/7
    sourceMap: !isProduction,
    sourceMapEmbed: !isProduction, // Remove after: https://github.com/thgh/rollup-plugin-scss/issues/7
    failOnError: !isProduction,
    watch: [path.join(__dirname, "/src")],
    processor: (css) =>
      postcss(getPostcssPlugins(isProduction))
        .process(css, {
          from: path.join(__dirname, "/public/bundle.css"),
          to: path.join(__dirname, "/public/bundle.css"),
          map: { inline: true }, // Set to false after: https://github.com/thgh/rollup-plugin-scss/issues/7
        })
        .then((result) => result.css),
    output: createOutputCssFunction(), // TODO: Check if write hashmap function is needed or not
  };

  return config;
}

export default {
  input: production ? "src/main-prod.js" : "src/main.js",
  output: getOutputConfigs(),
  plugins: [
    json(),
    svg({ base64: true }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    // All styles have to be written in .scss files (inside '/src')
    // Sass files (except partials) have to be imported in main.scss file (Use '@use' instead of '@import')
    // Partials are placed in '/src/styles' (e.g. _variables.scss, _helpers.scss)
    // Partials are imported directly in other sass files (e.g. _variables.scss -> '@use "variables"')
    scss({ ...getSassConfig(production) }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    nodeResolve({ browser: true }),
    commonjs(),

    // Generate a index.html file when not building for production
    !production && html(getHtmlOptions()),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload({ watch: ["public"], delay: 800 }),

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
