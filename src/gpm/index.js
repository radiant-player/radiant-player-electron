import { ipcRenderer } from 'electron';
import GMusic from 'gmusic.js';

let setupInterval = false;

const setupGMusic = () => {
  const gmusic = window.gmusic = new GMusic(window);

  // Proxy all methods over IPC

  ipcRenderer.on('volume.getVolume', (...args) => gmusic.volume.getVolume(...args));
  ipcRenderer.on('volume.setVolume', (...args) => gmusic.volume.setVolume(...args));
  ipcRenderer.on('volume.increaseVolume', (...args) => gmusic.volume.increaseVolume(...args));
  ipcRenderer.on('volume.decreaseVolume', (...args) => gmusic.volume.decreaseVolume(...args));
  ipcRenderer.on('playback.getPlaybackTime', (...args) => gmusic.playback.getPlaybackTime(...args));
  ipcRenderer.on('playback.setPlaybackTime', (...args) => gmusic.playback.setPlaybackTime(...args));
  ipcRenderer.on('playback.playPause', (...args) => gmusic.playback.playPause(...args));
  ipcRenderer.on('playback.forward', (...args) => gmusic.playback.forward(...args));
  ipcRenderer.on('playback.rewind', (...args) => gmusic.playback.rewind(...args));
  ipcRenderer.on('playback.getShuffle', (...args) => gmusic.playback.getShuffle(...args));
  ipcRenderer.on('playback.toggleShuffle', (...args) => gmusic.playback.toggleShuffle(...args));
  ipcRenderer.on('playback.getRepeat', (...args) => gmusic.playback.getRepeat(...args));
  ipcRenderer.on('playback.toggleRepeat', (...args) => gmusic.playback.toggleRepeat(...args));
  ipcRenderer.on('playback.toggleVisualization', (...args) => gmusic.playback.toggleVisualization(...args));
  ipcRenderer.on('rating.getRating', (...args) => gmusic.rating.getRating(...args));
  ipcRenderer.on('rating.toggleThumbsUp', (...args) => gmusic.rating.toggleThumbsUp(...args));
  ipcRenderer.on('rating.toggleThumbsDown', (...args) => gmusic.rating.toggleThumbsDown(...args));
  ipcRenderer.on('rating.setRating', (...args) => gmusic.rating.setRating(...args));
  ipcRenderer.on('rating.resetRating', (...args) => gmusic.rating.resetRating(...args));
  ipcRenderer.on('extras.getSongURL', (...args) => gmusic.extras.getSongURL(...args));

  gmusic.on('change:song', (...args) => ipcRenderer.sendToHost('change:song', ...args));
  gmusic.on('change:shuffle', (...args) => ipcRenderer.sendToHost('change:shuffle', ...args));
  gmusic.on('change:repeat', (...args) => ipcRenderer.sendToHost('change:repeat', ...args));
  gmusic.on('change:playback', (...args) => ipcRenderer.sendToHost('change:playback', ...args));
  gmusic.on('change:playback-time', (...args) => ipcRenderer.sendToHost('change:playback-time', ...args));
  gmusic.on('change:rating', (...args) => ipcRenderer.sendToHost('change:rating', ...args));

  ipcRenderer.on('ping', () => ipcRenderer.sendToHost('pong'));
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
