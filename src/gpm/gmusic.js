import GMusic from 'gmusic.js';

export const setupGMusic = (ipcInterface) => {
  const gmusic = window.gmusic = new GMusic(window);

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

  // Emit all state when changing songs
  gmusic.on('change:song', () => {
    ipcInterface.emit('change:shuffle', gmusic.playback.getShuffle());
    ipcInterface.emit('change:repeat', gmusic.playback.getRepeat());
    ipcInterface.emit('change:rating', gmusic.rating.getRating());
  });
};
