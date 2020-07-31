module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  globals: {},
  plugins: ['vue'],
  extends: ['standard', 'plugin:vue/essential', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2015,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'warn',
    'linebreak-style': ['error', 'unix'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
