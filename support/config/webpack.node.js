import dev from './webpack.development.js';

export default {
  output: {
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: dev.module.loaders.slice(1), // omit babel-loader
  },
};
