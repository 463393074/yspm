var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/es6/js/main.js',
  output: {
    path: path.resolve(__dirname, './build/es6/js/'),
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  vue:{
    loaders:{
      js:'babel'
    }
  },
  babel: {
     presets: ['es2015','stage-0'],
     plugins: ['transform-runtime']
  }
}