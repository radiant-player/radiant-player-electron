// Set up for development or production mode
import './setup';

import { app, globalShortcut } from 'electron'; // eslint-disable-line import/first

import { init as mainInit } from './main';

const installExtensions = async () => {
  const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log); // eslint-disable-line no-console
};

app.on('window-all-closed', () => { app.quit(); });

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  mainInit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
