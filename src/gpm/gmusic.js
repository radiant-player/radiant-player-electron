import GMusic from 'gmusic.js';

const setupGMusic = (ipcInterface) => {
  if (window.gmusic) return;

  const gmusic = new GMusic(window);
  window.gmusic = gmusic;

  ipcInterface.exposeObject({
    key: 'gmusic',
    object: gmusic,
  });

  // Proxy events over IPC
  ipcInterface.proxyEvents({
    object: gmusic,
    throttle: 100,
    events: [
      'change:playback-time',
      'change:playback',
      'change:rating',
      'change:repeat',
      'change:shuffle',
      'change:track',
    ],
  });
};

export default setupGMusic;
