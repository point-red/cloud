module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    "template-curly-spacing" : "off",
    "indent": "off",
    'no-undef': 'off',
    'handle-callback-err': 'off',
    'eqeqeq': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
