const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const { dependencies } = require('../../package.json');
const { resolveRoot, root } = require('./utils');
const baseConfig = require('./base');

const dist = resolveRoot('dll');

module.exports = merge.smart(baseConfig, {
  context: root,

  devtool: 'eval',

  target: 'electron-renderer',

  externals: ['fsevents', 'crypto-browserify', 'osx-mouse'],

  resolve: {
    modules: [
      'app',
      'node_modules',
    ],
  },

  entry: {
    vendor: [
      'babel-polyfill',
      ...Object.keys(dependencies),
    ]
    .filter(dependency => dependency !== 'font-awesome'),
  },

  output: {
    library: 'vendor',
    path: dist,
    filename: '[name].dll.js',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: resolveRoot('app'),
        output: {
          path: resolveRoot('dll'),
        },
      },
    }),
  ],
});
