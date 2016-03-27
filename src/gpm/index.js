import { ipcRenderer } from 'electron';
import { proxyEvents, proxyToObject } from '../ipc';
import GMusic from 'gmusic.js';

let setupInterval = false;

const setupGMusic = () => {
  const gmusic = window.gmusic = new GMusic(window);

  // Proxy methods over IPC
  proxyToObject({
    namespace: 'gpm',
    ipc: ipcRenderer,
    send: ipcRenderer.sendToHost,
    object: gmusic,
  });

  // Proxy events over IPC (you can't listen to all events unfortunately)
  proxyEvents({
    namespace: 'gpm',
    send: ipcRenderer.sendToHost,
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
