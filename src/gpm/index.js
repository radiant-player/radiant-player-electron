import { connectToIPC } from '../ipc';
import { ipcRenderer } from 'electron';
import { setupGMusic } from './gmusic';
import { setupThemes } from './themes';

const ipcInterface = connectToIPC({
  namespace: 'gpm',
  ipc: ipcRenderer,
  send: ipcRenderer.sendToHost,
});

const initThemes = () => {
  if (window.RADIANT_THEMES_INITIALIZED) return;
  try {
    setupThemes(ipcInterface);
    window.RADIANT_THEMES_INITIALIZED = true;
    ipcInterface.emit('ready');
  } catch (e) {
    // Not ready yet, try again later
    setTimeout(initThemes, 1000);
  }
};

const setupGmusic = () => {
  if (window.RADIANT_GMUSIC_INITIALIZED) return;
  try {
    setupGMusic(ipcInterface);
    window.RADIANT_GMUSIC_INITIALIZED = true;
    setTimeout(initThemes, 10);
  } catch (e) {
    // Not ready yet, try again later
    setTimeout(setupGmusic, 1000);
  }
};
setupGmusic();
