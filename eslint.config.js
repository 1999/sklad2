const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.es2017,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      'indent': ['error', 2],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];
