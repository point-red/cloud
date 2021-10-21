module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'handle-callback-err': 'off',
    eqeqeq: 'off'
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020
  }
}
