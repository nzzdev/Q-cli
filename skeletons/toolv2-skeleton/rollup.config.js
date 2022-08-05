import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const backendConfig = {
  input: 'src/routes/routes.ts',
  output: {
    file: 'dist/routes.js',
    format: 'es',
  },
  plugins: [typescript(), json()],
  external: ['@hapi/boom', 'ajv', 'd3-format', 'joi', 'module', 'path', 'simple-statistics', 'svelte/internal', 'uglify-js', 'url'],
};

const frontendConfig = {
  input: 'src/components/main.svelte',
  output: {
    name: 'window.[tool_name]',
    file: 'dist/[Tool-name].js',
    format: 'iife',
  },
  plugins: [
    typescript(),
    json(),
    svelte({
      preprocess: sveltePreprocess(),
      emitCss: false,
      compilerOptions: {},
    }),
    nodeResolve({ browser: true }),
    terser(),

    alias({
      entries: [
        // If you add a new top-level-folder besides src which you want to use, add it here.
        { find: /^@src(\/|$)/, replacement: `${__dirname}/src/` },
        { find: /^@cps(\/|$)/, replacement: `${__dirname}/src/components/` },
        { find: /^@helpers(\/|$)/, replacement: `${__dirname}/src/helpers/` },
      ],
    }),
  ],
};

export default [frontendConfig, backendConfig];
