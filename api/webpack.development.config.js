const merge = require('webpack-merge'),
  path = require('path'),
  nodeExternals = require('webpack-node-externals'),
  common = require('./webpack.common.config.js')

module.exports = merge(common, {
  mode: 'development',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  }
})