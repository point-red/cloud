process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 8080
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  }
}
