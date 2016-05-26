import { app, globalShortcut } from 'electron';

import './updater';

import main from './main';
import menubar from './menubar';

// Report crashes to our server.
// require('crash-reporter').start({
//   productName: 'RadiantPlayer',
//   companyName: 'RadiantPlayer',
//   submitURL: 'https://example.com/report',
// });

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  const mainIPCInterface = main.init();
  menubar.init(mainIPCInterface);
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  // globalShortcut.unregister('mediaplaypause');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
