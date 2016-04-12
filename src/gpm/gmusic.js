import GMusic from 'gmusic.js';

export const setupGMusic = (ipcInterface) => {
  if (window.gmusic) return;

  const gmusic = window.gmusic = new GMusic(window);

  ipcInterface.exposeObject({
    key: 'gmusic',
    object: gmusic,
  });

  // Proxy events over IPC
  ipcInterface.proxyEvents({
    object: gmusic,
    throttle: 100,
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
