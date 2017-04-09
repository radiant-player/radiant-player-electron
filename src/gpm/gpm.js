import { ipcRenderer } from 'electron';

import { connectToIPC } from '../ipc';
import { setupThemes } from './themes';
import setupGmusic from './gmusic';
import setupMouse from './mouse';

window.RADIANT_STARTING = true;

const retry = (delay = 1000, limit = false) => fn => new Promise((resolve, reject) => {
  let count = 0;
  const attempt = async () => {
    count += 1;
    try {
      resolve(await fn());
      return;
    } catch (e) {
      if (limit && count >= limit) {
        reject(e);
        return;
      }

      setTimeout(attempt, delay);
    }
  };

  attempt();
});

// Connect to IPC
const ipcInterface = connectToIPC({
  namespace: 'gpm',
  ipc: ipcRenderer,
  send: ipcRenderer.sendToHost,
});

// Create a retry loop that will try every second for 60s
const retry1000x60 = retry(1000, 60);

const initGmusic = () => {
  if (window.RADIANT_GMUSIC_INITIALIZED) return;
  setupGmusic(ipcInterface);
  window.RADIANT_GMUSIC_INITIALIZED = true;
};

const initThemes = () => {
  if (window.RADIANT_THEMES_INITIALIZED) return;
  window.themes = setupThemes(ipcInterface);
  window.RADIANT_THEMES_INITIALIZED = true;
};

const initMouse = () => {
  if (window.RADIANT_MOUSE_INITIALIZED) return;
  setupMouse(ipcInterface);
  window.RADIANT_MOUSE_INITIALIZED = true;
};

const setup = async () => {
  await retry1000x60(initThemes);
  await retry1000x60(initMouse);
  await retry1000x60(initGmusic);

  ipcInterface.emit('ready');
};

setup();
