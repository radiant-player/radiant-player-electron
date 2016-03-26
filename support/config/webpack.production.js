import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer';

import base from './webpack.base';

const config = {
  ...base,

  entry: './src/ui',

  output: {
    ...base.output,
    publicPath: '../dist/',
  },

  module: {
    ...base.module,
    loaders: [
      ...base.module.loaders,
      {
        test: /\.global\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader'
        ),
      }, {
        test: /^((?!\.global).)*\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ),
      },
    ],
  },

  plugins: [
    ...base.plugins,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
    }),
    new ExtractTextPlugin('style.css', { allChunks: true }),
  ],
};

config.target = webpackTargetElectronRenderer(config);

export default config;
