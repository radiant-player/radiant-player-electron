import electron, { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import EventEmitter from 'events';
import notifier from 'node-notifier';
import path from 'path';
import windowStateKeeper from 'electron-window-state';

import { connectToIPC } from '../ipc';
import configureStore from '../redux/configureStore';
import MenuRenderer from './MenuRenderer';

let main = null;
const isOSX = process.platform === 'darwin';

export const init = () => {
  const { screen } = electron;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  });

  // Create the browser window
  main = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 600,
    frame: false,
  });

  // Save the window state and position
  mainWindowState.manage(main);

  // Load the app.html
  main.loadURL(`file://${__dirname}/app.html`);

  // Prevent loading other URLs
  main.webContents.on('will-navigate', (e) => { e.preventDefault(e); });

  // Clear the window when closed
  main.on('closed', () => { main = null; });

  // Connect to IPC
  const ipcInterface = connectToIPC({
    namespace: 'app',
    ipc: ipcMain,
    send: (...args) => main.webContents.send(...args),
  });

  // Receive window events from IPC
  ipcInterface.on('onClose', () => main.close());
  ipcInterface.on('onMinimize', () => main.minimize());
  ipcInterface.on('onFullscreen', () => main.setFullScreen(!main.isFullScreen()));
  ipcInterface.on('onMaximize', () => main.maximize());

  // Proxy media keys to app via IPC
  const shortcutEmitter = new EventEmitter();
  const shortcuts = [
    'MediaNextTrack',
    'MediaPlayPause',
    'MediaPreviousTrack',
    'MediaStop',
  ];
  shortcuts.forEach((shortcut) => {
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
  const store = configureStore({});

  // Display notifications on track change
  let previousSong;
  store.subscribe(() => {
    const { gpm } = store.getState();

    if (previousSong === gpm.song) return;
    previousSong = gpm.song;
    if (!gpm.song.title) return;

    // TODO: build custom terminal-notifier with our app icon
    notifier.notify({
      title: gpm.song.title,
      message: `${gpm.song.artist} - ${gpm.song.album}`,
      icon: path.join(__dirname, '../resources/icon.png'),
      appIcon: path.join(__dirname, '../resources/icon.png'),
      contentImage: gpm.song.albumArt,
    }, () => {
      // (error, response)
      // console.log(response);
    });
  });

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
    rollDice: () => ipcInterface.emit('rollDice'),
  };

  const menuRenderer = new MenuRenderer(menuActions);
  store.subscribe(() => {
    const { menu } = store.getState();
    menuRenderer.render(menu);
  });

  if (isOSX) {
    const dockMenuRenderer = new MenuRenderer(menuActions, app.dock.setMenu);
    store.subscribe(() => {
      const { menu } = store.getState();
      dockMenuRenderer.render(menu[isOSX ? 3 : 2].submenu);
    });
  }

  return ipcInterface;
};

export default {
  init,
};
