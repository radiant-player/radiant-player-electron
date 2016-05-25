import ExtractTextPlugin from 'extract-text-webpack-plugin';
// import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer';

const DEV = process.env.NODE_ENV !== 'production';
const HOT = process.env.HOT === '1';
const PORT = process.env.PORT || 3000;

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
  entry: {
    app: DEV ? [
      `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
      './src/app',
    ] : './src/app',
    miniplayer: DEV ? [
      `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
      './src/app/miniplayer.js',
    ] : './src/app/miniplayer.js',
  },

  output: {
    path: path.join(__dirname, '..', '..', 'app', 'out'),
    filename: '[name].js',
    publicPath: DEV ? `http://localhost:${PORT}/dist/` : '../dist/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'app/node_modules'],
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
        ...(HOT ? {
          // Wraps all React components into arbitrary transforms
          // https://github.com/gaearon/babel-plugin-react-transform
          plugins: [
            [
              'react-transform',
              {
                transforms: [
                  {
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module'],
                  }, {
                    transform: 'react-transform-catch-errors',
                    imports: ['react', 'redbox-react'],
                  },
                ],
              },
            ],
          ],
        } : {}),
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
      __APP__: true,
      __DEV__: DEV,
      $dirname: '__dirname',
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
    new ExtractTextPlugin('[name].css', {
      allChunks: true,
    })
  );
};

if (!DEV) {
  applyExtractText(config);
}

export default config;
