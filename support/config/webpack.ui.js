import ExtractTextPlugin from 'extract-text-webpack-plugin';
// import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer';

const DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const entry = './src/ui';

const styleLoaders = [
  `css-loader?${JSON.stringify({
    sourceMap: DEV,
    // CSS Modules https://github.com/css-modules/css-modules
    modules: true,
    localIdentName: DEV ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
    // CSS Nano http://cssnano.co/options/
    minimize: !DEV,
  })}`,
  'postcss-loader?parser=postcss-scss',
];

const config = {
  entry: DEV ? [
    `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
    entry,
  ] : entry,

  output: {
    path: path.join(__dirname, '..', '..', 'dist'),
    filename: 'ui.js',
    publicPath: DEV ? `http://localhost:${PORT}/dist/` : '../dist/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules'],
    root: path.resolve(__dirname, '..', '..'),
  },

  debug: DEV,
  devtool: DEV ? 'cheap-module-eval-source-map' : false,

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
      {
        test: /\.s?css$/,
        loaders: [
          'style-loader',
          ...styleLoaders,
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: DEV,
      'process.env': {
        NODE_ENV: DEV ? JSON.stringify('development') : JSON.stringify('production'),
      },
    }),

    ...(DEV ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ] : [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          screw_ie8: true,
          warnings: false,
        },
      }),
      new ExtractTextPlugin('style.css', { allChunks: true }),
    ]),
  ],

  postcss: function plugins(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
    ];
  },
};

config.target = webpackTargetElectronRenderer(config);

const applyExtractText = (configToExtend) => {
  configToExtend.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const [first, ...rest] = loader.loaders;
    /* eslint-disable no-param-reassign */
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
    /* eslint-enable no-param-reassign */
  });

  configToExtend.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true,
    })
  );
};

if (!DEV) {
  applyExtractText(config);
}

const gpmConfig = {
  entry: './src/gpm',

  output: {
    path: path.join(__dirname, '..', '..', 'dist'),
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

gpmConfig.target = webpackTargetElectronRenderer(config);

export default [config, gpmConfig];
