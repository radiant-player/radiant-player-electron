import path from 'path';

var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var globalShortcut = require('global-shortcut');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    'title-bar-style': 'hidden-inset',
  });



  const index = path.resolve(__dirname, '../resources/index.html');

  console.log("\n\n\n\nGHIIIIIIIIIIIIIII", index);

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + index);

  // Open the DevTools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Register a 'ctrl+x' shortcut listener.
  var ret = globalShortcut.register('mediaplaypause', function() {
    console.log('mediaplaypause is pressed');
    mainWindow.webContents.send('control:play-pause');
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('mediaplaypause'));
});

app.on('will-quit', function() {
  // Unregister a shortcut.
  globalShortcut.unregister('mediaplaypause');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
