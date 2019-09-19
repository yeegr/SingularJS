const webpack = require('webpack')

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.json']
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