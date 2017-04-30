import { BrowserWindow, ipcMain, Tray, session } from 'electron';
import path from 'path';

import { connectToIPC } from '../ipc';
import Positioner from './Positioner';

const publicPath = path.resolve(path.join(__dirname, 'resources'));

const getPath = filename => path.join(publicPath, filename);

const iconPath = getPath('trayicon.png');

let tray = null;
let miniplayer = null;
let miniplayer_docked = null; // eslint-disable-line camelcase
let positioner = null;
let positioner_docked = null; // eslint-disable-line camelcase
let cachedPosition = null;
let isTop = !1; // eslint-disable-line no-unused-var
let vol = 100;

/* Baraka */
const Param = {
  Arrow: 8,
  Width: 356,
  Height: 356,
};

const hideWindow = () => {
  if (!miniplayer) return;
  miniplayer.hide();
};

const clearWindow = () => {
  miniplayer = null;
};

const createWindow = () => {
  const options = {
    width: Param.Width,
    height: Param.Height + Param.Arrow,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
  };

  miniplayer = new BrowserWindow(options);

  // options.parent = miniplayer;

  miniplayer_docked = new BrowserWindow(options); // eslint-disable-line camelcase

  positioner = new Positioner(miniplayer);
  positioner_docked = new Positioner(miniplayer_docked); // eslint-disable-line camelcase

  miniplayer.on('blur', hideWindow);

  miniplayer.on('close', clearWindow);

  // Play YT videos w/o restrictions we need to trick YT to making it be Google Music on said RP :)
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // referrer?
    details.requestHeaders.referer = 'https://play.google.com/music/listen'; // eslint-disable-line no-param-reassign
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  miniplayer.loadURL(`file://${path.resolve(path.join(__dirname, '/miniplayer.html'))}`);

  miniplayer_docked.loadURL(`file://${path.resolve(path.join(__dirname, '/miniplayer.html'))}`);
};

const showMiniplayer = (bounds, d) => {
  if (!miniplayer) createWindow();

  let position = bounds;
  let position_docked = position;

  if (bounds && bounds.x !== 0) {
    cachedPosition = bounds;
  } else if (cachedPosition) {
    position = cachedPosition;
    position_docked = position; // eslint-disable-line camelcase
  }

  let noBoundsPosition = null;
  if ((position === undefined
    || position.x === 0 ||
    position_docked === undefined // eslint-disable-line camelcase
    || position_docked.x === 0)) {
    noBoundsPosition = (process.platform === 'win32') ? 'bottomRight' : 'topRight';
  }

  position = positioner.calculate(noBoundsPosition || 'trayCenter', position);
  position_docked = position; // eslint-disable-line camelcase

  /* Baraka */
  /* eslint-disable-line radix */
  miniplayer.setPosition(parseInt(bounds.x - (Param.Width / 2) + (bounds.width / 2), 0), bounds.y + Param.Arrow + 10); // eslint-disable-line max-len
  miniplayer_docked.setPosition(parseInt(bounds.x - (Param.Width / 2) + (bounds.width / 2), 0), bounds.y + Param.Arrow + 10); // eslint-disable-line max-len
  /* eslint-disable-line radix */
  miniplayer.setFullScreenable(false);
  miniplayer_docked.setFullScreenable(false);

  if (d === 'docked') {
    miniplayer.show();
    miniplayer_docked.hide();
  }
};

const handleClick = (e, bounds) => {
  if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return hideWindow();
  if (miniplayer && miniplayer.isVisible()) return hideWindow();
  cachedPosition = bounds || cachedPosition;
  return showMiniplayer(cachedPosition, 'docked');
};

const handleDockedClick = (e, bounds) => {
  if (miniplayer.isVisible()) {
    hideWindow();
    miniplayer_docked.webContents.executeJavaScript(`
            document.querySelector("body").classList.add("drag");
          `);
    miniplayer_docked.show();
  } else {
    miniplayer_docked.hide();
    miniplayer_docked.webContents.executeJavaScript(`
            document.querySelector("body").classList.remove("drag");
          `);
    miniplayer.show();
  }

  cachedPosition = bounds || cachedPosition;
  return showMiniplayer(cachedPosition, 'undocked');
};

export const init = (mainIPCInterface) => {
  createWindow();

  const VolumeStatus = (percent) => {
    miniplayer.webContents.executeJavaScript(`
         var vol = window.document.querySelector("[class*='__menu_vol'] path");
         switch (!!1){
              case (${percent} === 100):
                  vol.setAttribute("d", "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z");
                  break;
              case (${percent} > 50):
                  vol.setAttribute("d", "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z");
                  break;
              case (${percent} === 10):
                  vol.setAttribute("d", "M7 9v6h4l5 5V4l-5 5H7z");
                  break;
              case (${percent} === 0):
                  vol.setAttribute("d", "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z");
                  break;
          }
      `);

    miniplayer_docked.webContents.executeJavaScript(`
         var vol = window.document.querySelector("[class*='__menu_vol'] path");
         switch (!!1){
              case (${percent} === 100):
                  vol.setAttribute("d", "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z");
                  break;
              case (${percent} > 50):
                  vol.setAttribute("d", "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z");
                  break;
              case (${percent} === 10):
                  vol.setAttribute("d", "M7 9v6h4l5 5V4l-5 5H7z");
                  break;
              case (${percent} === 0):
                  vol.setAttribute("d", "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z");
                  break;
          }
      `);
  };

  const actions = {
    // Player actions,
    playPause: () => mainIPCInterface.emit('playPause'),
    previous: () => mainIPCInterface.emit('previous'),
    next: () => mainIPCInterface.emit('next'),
    volumeUp: () => mainIPCInterface.emit('volumeUp'),
    volumeDown: () => mainIPCInterface.emit('volumeDown'),
    thumbsUp: () => mainIPCInterface.emit('thumbsUp'),
    thumbsDown: () => mainIPCInterface.emit('thumbsDown'),
    toggleRepeatMode: () => mainIPCInterface.emit('toggleRepeatMode'),
    repeatAll: () => mainIPCInterface.emit('repeatAll'),
    repeatOne: () => mainIPCInterface.emit('repeatOne'),
    repeatNone: () => mainIPCInterface.emit('repeatNone'),
    toggleShuffle: () => mainIPCInterface.emit('toggleShuffle'),
    rollDice: () => mainIPCInterface.emit('rollDice'),
    replayBack: () => mainIPCInterface.emit('replayBack'),
    seekForward: () => mainIPCInterface.emit('seekForward'),
    toggleVisualization: () => mainIPCInterface.emit('toggleVisualization'),
    setCurrentTime: time => mainIPCInterface.emit('setCurrentTime', time),
    volume: () => mainIPCInterface.emit('volume'),
    setVolume: (percent) => {
      vol = percent;
      VolumeStatus(percent);
      mainIPCInterface.emit('setVolume', percent);
    },
    DockActive: (val, extra) => {
      isTop = val;
      miniplayer_docked.setAlwaysOnTop(val);// the magic
    },
    DockYoutubeFullScreen: (val) => {
      if (miniplayer_docked.isFullScreen()) {
        miniplayer_docked.setFullScreen(!1);
        miniplayer_docked.webContents.executeJavaScript('document.querySelector("body").classList.remove("fullscreen");');
        if (val === !!1) {
          miniplayer_docked.setFullScreenable(!1);
        }
      } else {
        if (val === !1) {
          miniplayer_docked.setFullScreenable(!!1);
        }
        miniplayer_docked.setFullScreen(!!1);
        miniplayer_docked.webContents.executeJavaScript('document.querySelector("body").classList.add("fullscreen");');
      }
    },
    setVolumeUpdate: (val) => {
      vol = val;
    },
    DockMiniPlayer: (extra) => {
      handleDockedClick();
      if (Object.keys(extra.volume).length > 0) {
        miniplayer.webContents.executeJavaScript(`
                  document.querySelector("body").dataset.volume = ${vol};
                  document.querySelector(".volume .rc-slider .rc-slider-track").style.height =${vol}+'%';
                  document.querySelector(".volume .rc-slider .rc-slider-handle").style.bottom =${vol}+'%';
                  if(document.querySelector(".rc-slider-tooltip-inner") != null) {
                      document.querySelector(".rc-slider-tooltip-inner").innerHTML = ${vol};
                  }
              `);

        miniplayer_docked.webContents.executeJavaScript(`
                  document.querySelector("body").dataset.volume = ${vol};
                  document.querySelector(".volume .rc-slider .rc-slider-track").style.height =${vol}+'%';
                  document.querySelector(".volume .rc-slider .rc-slider-handle").style.bottom =${vol}+'%';
                  if(document.querySelector(".rc-slider-tooltip-inner") != null) {
                      document.querySelector(".rc-slider-tooltip-inner").innerHTML = ${vol};
                  }
              `);
      }
    },
  };

  const ipcInterface = connectToIPC({
    namespace: 'app',
    ipc: ipcMain,
    send: (...args) => miniplayer.webContents.send(...args),
  });

  ipcInterface.exposeObject({
    key: 'actions',
    object: actions,
  });

  miniplayer_docked.webContents.on('dom-ready', () => {
    miniplayer_docked.webContents.executeJavaScript(`
            document.querySelector("body").classList.toggle("drag");
            document.querySelector("html").classList.toggle("undocked");
            document.querySelector("body").dataset.volume = ${vol};
          `);
  });

  miniplayer.webContents.executeJavaScript(`
    document.querySelector("body").dataset.volume = ${vol};
  `);

  tray = new Tray(iconPath);
  tray.on('click', handleClick);
  tray.on('double-click', handleClick);
};

export default {
  init,
};
