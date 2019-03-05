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
