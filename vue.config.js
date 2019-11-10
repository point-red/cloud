const webpack = require('webpack')

module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 8080
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  },
  configureWebpack: config => {
    return {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            VERSION: JSON.stringify(require('./package.json').version)
          }
        })
      ]
    }
  }
}
