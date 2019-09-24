const webpack = require('webpack'),
  TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.json'],
    plugins: [new TsconfigPathsPlugin({
    })]
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