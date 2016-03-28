import { ipcRenderer } from 'electron';
import { connectToIPC } from '../ipc';
import GMusic from 'gmusic.js';

let setupInterval = false;

const setupGMusic = () => {
  const gmusic = window.gmusic = new GMusic(window);

  const ipcInterface = connectToIPC({
    namespace: 'gpm',
    ipc: ipcRenderer,
    send: ipcRenderer.sendToHost,
  });

  ipcInterface.exposeObject({
    key: 'gmusic',
    object: gmusic,
  });

  // Proxy events over IPC
  ipcInterface.proxyEvents({
    object: gmusic,
    events: [
      'change:song',
      // 'change:shuffle',
      // 'change:repeat',
      'change:playback',
      'change:playback-time',
      'change:rating',
    ],
  });

  // Proxy broken events over IPC
  gmusic.on('change:shuffle', () => {
    ipcInterface.emit('change:shuffle', gmusic.playback.getShuffle());
  });
  gmusic.on('change:repeat', () => {
    ipcInterface.emit('change:repeat', gmusic.playback.getRepeat());
  });
};

const retrySetup = () => {
  if (window.RADIANT_INITIALIZED) return;
  try {
    setupGMusic();
    window.RADIANT_INITIALIZED = true;
    clearInterval(setupInterval);
    setupInterval = false;
  } catch (e) {
    // Not ready yet, try again later
  }
};

setupInterval = setInterval(retrySetup, 1000);
