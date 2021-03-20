const OFF = 'off';
const WARN = 'warn';
// const ERROR = 'error';
module.exports = {
  // Inherit from our package
  extends: 'eslint-config-twolfson',
  parserOptions: {
    ecmaVersion: 2017,
  },

  rules: {
    'comma-dangle': OFF,
    'object-curly-spacing': OFF,
  },

  // Configure our environment
  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  }
};
