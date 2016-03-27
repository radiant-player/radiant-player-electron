/* eslint-disable no-console */
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import configs from './config/webpack.app';

const config = configs[0];

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
