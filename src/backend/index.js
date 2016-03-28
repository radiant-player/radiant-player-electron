/* eslint-disable no-console */

import { ipcMain } from 'electron';
import app from 'app';
import BrowserWindow from 'browser-window';
import globalShortcut from 'global-shortcut';
import Menu from 'menu';
import path from 'path';
import EventEmitter from 'events';

import { bindMenuActions } from './utils';
import configureStore from '../redux/configureStore';
import { connectToIPC } from '../ipc';

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
  };

  let previousMenu = null;
  store.subscribe(() => {
    const state = store.getState();
    if (state.menu === previousMenu) return;
    previousMenu = state.menu;
    const template = bindMenuActions(state.menu, menuActions);
    // console.log('menu', require('util').inspect(template, { depth: null }));
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  });
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  // globalShortcut.unregister('mediaplaypause');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
