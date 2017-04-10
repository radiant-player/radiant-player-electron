import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { connectToIPC } from '../ipc';

let settings = null;

const hideWindow = () => {
  if (!settings) return;
  settings.hide();
};

const clearWindow = () => {
  settings = null;
};

const createWindow = () => {
  settings = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: true,
    transparent: false,
    resizable: true,
  });

  settings.on('blur', hideWindow);
  settings.on('close', clearWindow);

  settings.loadURL(`file://${path.resolve(path.join(__dirname, '/settings.html'))}`);
};

export const init = (mainIPCInterface) => {
  createWindow();

  const actions = {
    show: () => mainIPCInterface.emit('settings:show'),
  };

  const ipcInterface = connectToIPC({
    namespace: 'app',
    ipc: ipcMain,
    send: (...args) => settings.webContents.send(...args),
  });

  ipcInterface.exposeObject({
    key: 'actions',
    object: actions,
  });

  mainIPCInterface.on('settings:show', () => settings.show());
  mainIPCInterface.on('settings:hide', () => settings.hide());
};

export default {
  init,
};
