module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',

    // Disables rules from eslint:recommended which are already handled by TypeScript.
    'plugin:@typescript-eslint/eslint-recommended',

    // Typescript defined rules for linter.
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // eslint-plugin-svelte rules.
    'plugin:@ota-meshi/svelte/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    tsconfigRootDir: __dirname + '/..',
    project: ['tsconfig.json'],
    extraFileExtensions: ['.svelte'],
  },
  env: {
    es6: true,
    browser: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  settings: {},
  plugins: ['@ota-meshi/svelte', '@typescript-eslint'],
  ignorePatterns: ['*.cjs', 'node_modules'],
  rules: {
    quotes: [2, 'single'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
      },
    ],
  },
};
