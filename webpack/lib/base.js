const webpack = require('webpack');

const { dependencies } = require('../../app/package.json');
const { resolveRoot } = require('./utils');

module.exports = {
  externals: Object.keys(dependencies || {}),

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    }],
  },

  output: {
    path: resolveRoot('app'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      resolveRoot('app'),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
  ],
};
