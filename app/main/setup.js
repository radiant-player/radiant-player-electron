if (process.env.NODE_ENV === 'development') {
  // Enable DevTron in development
  require('devtron'); // eslint-disable-line global-require

  // Enable electron-debug
  require('electron-debug')();// eslint-disable-line global-require

  // Add app/node_modules to resolve path
  const path = require('path'); // eslint-disable-line global-require
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p); // eslint-disable-line global-require
}

// Enable source maps in production
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line global-require
  sourceMapSupport.install();
}
