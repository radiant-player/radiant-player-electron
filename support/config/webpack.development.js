import webpack from 'webpack';
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer';

import baseConfig from './webpack.base';

const config = Object.create(baseConfig);
const clientPort = process.env.CLIENT_PORT || 3000;

config.debug = true;

config.devtool = 'cheap-module-eval-source-map';

config.entry = [
  `webpack-hot-middleware/client?path=http://localhost:${clientPort}/__webpack_hmr`,
  './src/ui',
];

config.output.publicPath = `http://localhost:${clientPort}/dist/`;

config.module.loaders.push({
  test: /^((?!\.module).)*\.css$/,
  loaders: [
    'style-loader',
    'css-loader',
  ],
}, {
  test: /\.module\.css$/,
  loaders: [
    'style-loader',
    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!',
  ],
});

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env': JSON.stringify('development'),
  })
);

config.target = webpackTargetElectronRenderer(config);

export default config;
