const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port: 9000,
    client: {
      webSocketURL: 'ws://0.0.0.0:9000/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
})
