import { ipcMain } from 'electron';
import { Tray } from 'electron';
import BrowserWindow from 'browser-window';
import path from 'path';
import Positioner from 'electron-positioner';

import { connectToIPC } from '../ipc';

const iconPath = path.resolve(__dirname, '..', 'resources', 'trayicon.png');

let tray = null;
let miniplayer = null;
let positioner = null;
let cachedPosition = null;

const hideWindow = () => {
  if (!miniplayer) return;
  miniplayer.hide();
};

const clearWindow = () => {
  miniplayer = null;
};

const createWindow = () => {
  miniplayer = new BrowserWindow({
    width: 400,
    height: 150,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
  });
  positioner = new Positioner(miniplayer);

  miniplayer.on('blur', hideWindow);
  miniplayer.on('close', clearWindow);

  miniplayer.loadURL(`file://${path.resolve(__dirname, '../app/miniplayer.html')}`);
};

const showMiniplayer = (trayPosition) => {
  if (!miniplayer) createWindow();

  let position = trayPosition;

  if (trayPosition && trayPosition.x !== 0) {
    cachedPosition = trayPosition;
  } else if (cachedPosition) {
    position = cachedPosition;
  }

  let noBoundsPosition = null;
  if (position === undefined || position.x === 0) {
    noBoundsPosition = (process.platform === 'win32') ? 'bottomRight' : 'topRight';
  }

  position = positioner.calculate(noBoundsPosition || 'trayCenter', position);

  miniplayer.setPosition(position.x, position.y);
  miniplayer.show();
};

const handleClick = (e, bounds) => {
  if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return hideWindow();
  if (miniplayer && miniplayer.isVisible()) return hideWindow();
  cachedPosition = bounds || cachedPosition;
  return showMiniplayer(cachedPosition);
};

export const init = (mainIPCInterface) => {
  createWindow();

  const actions = {
    // Player actions,
    playPause: () => mainIPCInterface.emit('playPause'),
    previous: () => mainIPCInterface.emit('previous'),
    next: () => mainIPCInterface.emit('next'),
    volumeUp: () => mainIPCInterface.emit('volumeUp'),
    volumeDown: () => mainIPCInterface.emit('volumeDown'),
    thumbsUp: () => mainIPCInterface.emit('thumbsUp'),
    thumbsDown: () => mainIPCInterface.emit('thumbsDown'),
    toggleRepeatMode: () => mainIPCInterface.emit('toggleRepeatMode'),
    repeatAll: () => mainIPCInterface.emit('repeatAll'),
    repeatOne: () => mainIPCInterface.emit('repeatOne'),
    repeatNone: () => mainIPCInterface.emit('repeatNone'),
    toggleShuffle: () => mainIPCInterface.emit('toggleShuffle'),
    toggleVisualization: () => mainIPCInterface.emit('toggleVisualization'),
  };

  const ipcInterface = connectToIPC({
    namespace: 'app',
    ipc: ipcMain,
    send: (...args) => miniplayer.webContents.send(...args),
  });

  ipcInterface.exposeObject({
    key: 'actions',
    object: actions,
  });

  tray = new Tray(iconPath);
  tray.on('click', handleClick);
  tray.on('double-click', handleClick);
};

export default {
  init,
};
