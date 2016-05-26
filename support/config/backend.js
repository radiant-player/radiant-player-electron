import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';

const DEV = process.env.NODE_ENV !== 'production';
const entry = './src/backend';

const config = {
  entry,

  output: {
    path: path.join(__dirname, '..', '..', 'app'),
    filename: 'backend.js',
    libraryTarget: 'commonjs2',
  },

  target: 'electron',

  node: {
    __dirname: false,
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'app/node_modules'],
  },

  debug: DEV,
  devtool: DEV ? 'cheap-module-eval-source-map' : null,

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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __APP__: false,
      __DEV__: DEV,
      'process.env': {
        NODE_ENV: DEV ? JSON.stringify('development') : JSON.stringify('production'),
      },
    }),
  ],

  externals: [
    '../build/Release/addon.node',
    nodeExternals(),
    nodeExternals({
      modulesDir: 'app/node_modules',
    }),
  ],
};

export default config;
