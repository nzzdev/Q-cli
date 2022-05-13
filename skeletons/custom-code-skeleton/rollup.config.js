import * as fs from "fs";
import * as path from "path";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import html from "@rollup/plugin-html";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import scss from "rollup-plugin-scss";
import postcss from "postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import qConfig from "./q.config.json";
import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import alias from '@rollup/plugin-alias';
import { createContentWidthQElement, createFullwidthQElement, getHtml, createSubtitle, createParagraph  } from '@nzz/nzz.ch-static';

// Which nzz layout to use?
const LAYOUT = process.env.LAYOUT;
const builtCssFilename = 'bundle';

const production = !process.env.ROLLUP_WATCH;
const projectRootDir = path.resolve(__dirname);

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

function getHtmlOptions() {
  return {
      fileName: 'index.html',
      template: function (options) {
          return getHtml({
              // These 3 options are the most important. Without them the static website will not function.
              layout: LAYOUT, // Type of layout.
              builtCssFilename, // Will be appended at the end of <head>.
              builtJsFilename: options.files.js[0].fileName, // Will appended to the end of <body>.

              // Create mock elements to simulate your article.
              content: `
                  ${createSubtitle('Test Subtitle')}
                  ${createParagraph('Test paragraph')}
                  ${createFullwidthQElement('custom-code-fw')}
                  ${createContentWidthQElement('custom-code-cw')}
              `,

              // Other options.
              author: 'Max Musterman',
              lead: 'Test lead.',
              title: 'Test title',

              // Links to other css files that need to be loaded.
              // Will be appended to <head> but before the bundled css file of your app.
              customCssLinks: [
                  'https://service.sophie.nzz.ch/bundle/sophie-q@^1,sophie-input@^1,sophie-font@^1,sophie-color@^1,sophie-viz-color@^1,sophie-legend@^1.css',
              ],

              // Links to other js filed that need to be loaded.
              // Will be appended at the end of the body, but before the built js file for the app.
              customJsLinks: [
                  'https://cdn.polyfill.io/v2/polyfill.min.js?features=Map,URL,Promise,fetch,URLSearchParams,Array.prototype.find,Array.prototype.findIndex,Object.entries,Array.prototype.includes,CustomEvent,Array.from,String.prototype.startsWith&flags=gated&unknown=polyfill'
              ],
          });
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

    fs.writeFileSync(`${publicDir}/${builtCssFilename}.css`, styles);
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
          from: path.join(__dirname, `/public/${builtCssFilename}.css`),
          to: path.join(__dirname, `/public/${builtCssFilename}.css`),
          map: isProduction ? false : { inline: true }, // Set to false after: https://github.com/thgh/rollup-plugin-scss/issues/7
        })
        .then((result) => result.css),
    output: createOutputCssFunction(),
  };

  return config;
}

export default {
  input: production ? "src/main-prod.ts" : "src/main.ts",
  output: getOutputConfigs(),
  plugins: [
    alias({
      entries: [
        { find: '@src', replacement: path.resolve(projectRootDir, 'src') },
        { find: '@interfaces', replacement: path.resolve(projectRootDir, 'src/interfaces.ts') },
      ]
    }),

    typescript({ sourceMap: !production }),
    json(),
    image(),
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
