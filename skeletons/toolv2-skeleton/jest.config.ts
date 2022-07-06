// Testing with Svelte + TS + ESM + Jest requires quite the setup.
// https://github.com/svelteness/svelte-jester/issues/72#issuecomment-1021356664

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.svelte$': [

      // This line is very important for it to work with ESM modules
      './node_modules/svelte-jester/dist/transformer.mjs',
      {
        preprocess: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.svelte', '.ts'],
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@rs(.*)$': '<rootDir>/resources$1',
    '^@src(.*)$': '<rootDir>/src$1',
  },
  testPathIgnorePatterns: ['node_modules'],
  transformIgnorePatterns: ['node_modules'],
  bail: false,
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};

export default config;
