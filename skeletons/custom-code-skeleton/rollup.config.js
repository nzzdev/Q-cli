import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import buble from "@rollup/plugin-buble";
import json from "@rollup/plugin-json";
import svg from "rollup-plugin-svg";
import qConfig from "./q.config.json";

const production = !process.env.ROLLUP_WATCH;
const qId = qConfig.items[0].metadata.id;

export default {
  input: production ? "src/main-prod.js" : "src/main.js",
  output: {
    sourcemap: production ? false : true,
    format: "iife",
    name: `window._q_custom_code_${qId}.App`,
    file: "public/bundle.js",
  },
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
