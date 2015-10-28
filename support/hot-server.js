import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './config/webpack.development';

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.use(webpackHotMiddleware(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'ui', 'resources', 'hot-dev-app.html'));
});

app.listen(process.env.PORT || 3000, 'localhost', (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Listening at http://localhost:${app.get('port')}`);
});
