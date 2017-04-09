const webpack = require('webpack');
const merge = require('webpack-merge');
const BabiliPlugin = require('babili-webpack-plugin');

const { root } = require('../lib/utils');
const baseConfig = require('../lib/base');

const DEV = process.env.NODE_ENV !== 'production';

module.exports = merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-main',

  entry: ['babel-polyfill', './src/main/index'],

  output: {
    path: root,
    filename: './app/main.js',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
  ].concat(DEV ? [] : [new BabiliPlugin()]),

  node: {
    __dirname: false,
    __filename: false,
  },
});
