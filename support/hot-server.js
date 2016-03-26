/* eslint-disable no-console */
require('babel-register');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./config/webpack.development');

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.use(webpackHotMiddleware(compiler));

const server = app.listen(process.env.PORT || 3000, 'localhost', (err) => {
  if (err) {
    console.error(err);
    return;
  }

  const port = server.address().port;

  console.log(`Listening at http://localhost:${port}`);
});
