import { ipcRenderer } from 'electron';
import { connectToIPC } from '../ipc';
import GMusic from 'gmusic.js';

let setupInterval = false;

const setupGMusic = () => {
  const gmusic = window.gmusic = new GMusic(window);

  // gmusic.on('change:shuffle', (...args) =>
  // console.log('change:shuffle', gmusic.playback.getShuffle()));

  const ipcInterface = connectToIPC({
    namespace: 'gpm',
    ipc: ipcRenderer,
    send: ipcRenderer.sendToHost,
  });

  ipcInterface.exposeObject({
    key: 'gmusic',
    object: gmusic,
  });

  // Proxy events over IPC (you can't listen to all events unfortunately)
  ipcInterface.proxyEvents({
    object: gmusic,
    events: [
      'change:song',
      'change:shuffle',
      'change:repeat',
      'change:playback',
      'change:playback-time',
      'change:rating',
    ],
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
