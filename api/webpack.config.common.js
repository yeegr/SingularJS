const webpack = require('webpack'),
  TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')  // enables path mapping in tsconfig.json

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.json'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node-modules/
      },
      {
        test: /\.env$/i,
        use: 'raw-loader'
      }
    ]
  }
}