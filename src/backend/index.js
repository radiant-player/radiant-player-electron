/* eslint-disable no-console */

import app from 'app';
import BrowserWindow from 'browser-window';
import globalShortcut from 'global-shortcut';
import path from 'path';

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    'title-bar-style': 'hidden-inset',
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + path.resolve(__dirname, '../resources/index.html'));

  // Open the DevTools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Register a 'ctrl+x' shortcut listener.
  const ret = globalShortcut.register('mediaplaypause', () => {
    console.log('mediaplaypause is pressed');
    mainWindow.webContents.send('control:play-pause');
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  // console.log(globalShortcut.isRegistered('mediaplaypause'));
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('mediaplaypause');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
