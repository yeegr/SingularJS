const webpack = require('webpack'),
  path = require('path'),
  nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node-modules/
      }
    ]
  }
}