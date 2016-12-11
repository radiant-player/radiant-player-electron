/* eslint-disable no-console */

import { app, autoUpdater } from 'electron';
import os from 'os';

const platform = `${os.platform()}_${os.arch()}`;
const version = app.getVersion();

autoUpdater.on('checking-for-update', (...args) => console.log('checking-for-update', ...args));
autoUpdater.on('update-available', (...args) => console.log('update-available', ...args));
autoUpdater.on('update-not-available', (...args) => console.log('update-not-available', ...args));
autoUpdater.on('update-downloaded', (...args) => console.log('update-downloaded', ...args));

try {
  autoUpdater.setFeedURL(
    `https://radiant-player-updates.herokuapp.com/update/${platform}/${version}`,
  );
  autoUpdater.checkForUpdates();
} catch (e) {
  console.log(`Warning: ${e.stack}`);
}
