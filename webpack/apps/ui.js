const { execSync, spawn } = require('child_process');
const BabiliPlugin = require('babili-webpack-plugin');
const chalk = require('chalk');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const { resolveRoot } = require('../lib/utils');
const baseConfig = require('../lib/base');

const DEV = process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 1212;
const publicPath = DEV ? `http://localhost:${port}/dist/` : '../dist/';

const dll = resolveRoot('dll');
const manifest = path.resolve(dll, 'vendor.json');

// if (DEV) {
//   // Warn if the DLL is not built
//   if (!fs.existsSync(dll) || !fs.existsSync(manifest)) {
//     console.log(chalk.black.bgYellow.bold( // eslint-disable-line no-console
//       'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'
//     ));
//     execSync('npm run build-dll');
//   }
// }

module.exports = merge.smart(baseConfig, {
  devtool: DEV ? 'inline-source-map' : 'source-map',

  target: 'electron-renderer',

  externals: ['osx-mouse'],

  entry: {
    bundle: (DEV ? [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${port}/`,
      'webpack/hot/only-dev-server',
    ] : ['babel-polyfill']).concat(resolveRoot('src/ui/index.js')),
    miniplayer: (DEV ? [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${port}/`,
      'webpack/hot/only-dev-server',
    ] : ['babel-polyfill']).concat(resolveRoot('src/ui/miniplayer.js')),
  },

  output: {
    filename: '[name].js',
    path: resolveRoot('app/dist'),
    publicPath,
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.LoaderOptionsPlugin({
      debug: DEV,
    }),

    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ].concat(DEV ? [
    // new webpack.DllReferencePlugin({
    //   context: process.cwd(),
    //   manifest: require(manifest), // eslint-disable-line import/no-dynamic-require, global-require
    //   sourceType: 'var',
    // }),

    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ] : [
    new BabiliPlugin(),
  ]),

  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: resolveRoot('dist'),
    watchOptions: {
      aggregateTimeout: 300,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    setup() {
      if (process.env.START_HOT) {
        spawn(
          'npm',
          ['run', 'start-hot-renderer'],
          { shell: true, env: process.env, stdio: 'inherit' }
        )
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError)); // eslint-disable-line no-console
      }
    },
  },
});
