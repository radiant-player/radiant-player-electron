const BabiliPlugin = require('babili-webpack-plugin');
const webpack = require('webpack');

const { resolveRoot } = require('../lib/utils');

const DEV = process.env.NODE_ENV !== 'production';

const config = {
  target: 'electron-renderer',

  entry: resolveRoot('app/gpm/gpm.js'),

  output: {
    path: resolveRoot('app/dist'),
    filename: 'gpm.js',
    publicPath: '../dist/',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      resolveRoot('app/node_modules'),
      'node_modules',
    ],
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        loader: 'text-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ].concat(DEV ? [] : [new BabiliPlugin()]),
};

module.exports = config;
