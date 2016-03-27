/* eslint-disable no-console */

// import { ipcMain } from 'electron';
import app from 'app';
import BrowserWindow from 'browser-window';
import globalShortcut from 'global-shortcut';
import path from 'path';

// Report crashes to our server.
// require('crash-reporter').start({
//   productName: 'RadiantPlayer',
//   companyName: 'RadiantPlayer',
//   submitURL: 'https://example.com/report',
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main = null;

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
  // Create the browser window.
  main = new BrowserWindow({
    width: 1024,
    height: 800,
    'title-bar-style': 'hidden-inset',
  });

  // and load the index.html of the app.
  main.loadURL('file://' + path.resolve(__dirname, '../resources/index.html'));

  // Open the DevTools.
  // main.openDevTools();

  // Emitted when the window is closed.
  main.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    main = null;
  });

  // Proxy media keys to app via IPC
  globalShortcut.register('MediaNextTrack', () => main.webContents.send('shortcut:MediaNextTrack'));
  globalShortcut.register('MediaPreviousTrack', () => main.webContents.send('shortcut:MediaPreviousTrack'));
  // globalShortcut.register('MediaStop', () => main.webContents.send('shortcut:MediaStop'));
  globalShortcut.register('MediaPlayPause', () => main.webContents.send('shortcut:MediaPlayPause', true));

  // Check whether a shortcut is registered.
  // console.log(globalShortcut.isRegistered('mediaplaypause'));
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  // globalShortcut.unregister('mediaplaypause');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
