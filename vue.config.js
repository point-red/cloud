process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 8080,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  }
}
