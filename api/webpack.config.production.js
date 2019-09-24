const merge = require('webpack-merge'),
  path = require('path'),
  common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist')
  }
})