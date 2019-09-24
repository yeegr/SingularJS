const merge = require('webpack-merge'),
  path = require('path'),
  nodeExternals = require('webpack-node-externals'),
  common = require('./webpack.config.common.js')

module.exports = (env) => merge(common, {
  mode: env.NODE_ENV || 'development',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dev')
  }
})