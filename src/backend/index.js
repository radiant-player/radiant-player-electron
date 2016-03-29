/* eslint-disable no-console */

import { ipcMain } from 'electron';
import app from 'app';
import BrowserWindow from 'browser-window';
import electron from 'electron';
import EventEmitter from 'events';
import globalShortcut from 'global-shortcut';
import path from 'path';

import { connectToIPC } from '../ipc';
import configureStore from '../redux/configureStore';
import MenuRenderer from './MenuRenderer';

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
  const { screen } = electron;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  main = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden-inset',
  });

  // and load the app.html of the app.
  main.loadURL(`file://${path.resolve(__dirname, '../app/app.html')}`);

  // Open the DevTools.
  // main.openDevTools();

  // Emitted when the window is closed.
  main.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    main = null;
  });

  // Connect to IPC
  const ipcInterface = connectToIPC({
    namespace: 'app',
    ipc: ipcMain,
    send: (...args) => main.webContents.send(...args),
  });

  // Proxy media keys to app via IPC
  const shortcutEmitter = new EventEmitter();
  const shortcuts = [
    'MediaNextTrack',
    'MediaPlayPause',
    'MediaPreviousTrack',
    'MediaStop',
  ];
  shortcuts.forEach(shortcut => {
    const success = globalShortcut.register(shortcut, () => {
      shortcutEmitter.emit('shortcut', shortcut);
    });

    if (!success) throw new Error(`Unable to register global shortcut ${shortcut}`);
  });
  ipcInterface.proxyEvents({
    object: shortcutEmitter,
    events: ['shortcut'],
  });

  // Initialize shared store
  const store = configureStore();

  // Bind menu to store
  const menuActions = {
    reload: (item, focusedWindow) => (focusedWindow ? focusedWindow.reload() : null),
    toggleFullScreen: (item, focusedWindow) => (focusedWindow
      ? focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      : null),
    toggleDevTools: (item, focusedWindow) => (
      focusedWindow ? focusedWindow.toggleDevTools() : null
    ),
    quit: () => app.quit(),

    // Player actions,
    playPause: () => ipcInterface.emit('playPause'),
    previous: () => ipcInterface.emit('previous'),
    next: () => ipcInterface.emit('next'),
    volumeUp: () => ipcInterface.emit('volumeUp'),
    volumeDown: () => ipcInterface.emit('volumeDown'),
    thumbsUp: () => ipcInterface.emit('thumbsUp'),
    thumbsDown: () => ipcInterface.emit('thumbsDown'),
    toggleRepeatMode: () => ipcInterface.emit('toggleRepeatMode'),
    repeatAll: () => ipcInterface.emit('repeatAll'),
    repeatOne: () => ipcInterface.emit('repeatOne'),
    repeatNone: () => ipcInterface.emit('repeatNone'),
    toggleShuffle: () => ipcInterface.emit('toggleShuffle'),
    toggleVisualization: () => ipcInterface.emit('toggleVisualization'),
    search: () => ipcInterface.emit('search'),
    goBack: () => ipcInterface.emit('goBack'),
    goForward: () => ipcInterface.emit('goForward'),
  };

  const menuRenderer = new MenuRenderer(menuActions);
  store.subscribe(() => {
    const { menu } = store.getState();
    menuRenderer.render(menu);
  });
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  // globalShortcut.unregister('mediaplaypause');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
