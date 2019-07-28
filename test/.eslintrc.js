module.exports = {
  env: {
    node: true,
  },
  globals: {
    expect: 'readonly',
  },
  plugins: [],
  extends: [
    'eslint:recommended',
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};
