import path from 'path';
import webpack from 'webpack';
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer';

const DEV = process.env.NODE_ENV !== 'production';

const config = {
  entry: './src/gpm',

  output: {
    path: path.join(__dirname, '..', '..', 'app', 'out'),
    filename: 'gpm.js',
    publicPath: '../dist/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules'],
    root: path.resolve(__dirname, '..', '..'),
  },

  debug: false,

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: DEV,
      $dirname: '__dirname',
      'process.env': {
        NODE_ENV: DEV ? JSON.stringify('development') : JSON.stringify('production'),
      },
    }),

    ...(DEV ? [] : [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          screw_ie8: true,
          warnings: false,
        },
      }),
    ]),
  ],
};

config.target = webpackTargetElectronRenderer(config);

export default config;
