const merge = require('webpack-merge'),
  path = require('path'),
  common = require('./webpack.common.config.js')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
})