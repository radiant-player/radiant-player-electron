import { AppContainer } from 'react-hot-loader';
import { bindActionCreators } from 'redux';
import { ipcRenderer, remote } from 'electron';
import { render } from 'react-dom';
import buildMouse from 'osx-mouse';
import React from 'react';

import { connectToIPC, domIPCBridge } from '../ipc';
import gpmActions, {
  onOptimisticSetCurrentTime,
  REPEAT_STATE_LIST_REPEAT,
  REPEAT_STATE_SINGLE_REPEAT,
  REPEAT_STATE_NO_REPEAT,
} from '../redux/actions/gpm';
import configureStore from '../redux/configureStore';
import Root from './containers/Root';

import './app.scss';

const root = document.getElementById('root');
const store = configureStore({});

// Connect to the underlying webview and the IPC bridge
let gpm = null;
const gpmIPC = domIPCBridge(gpm);
const onGPM = (instance) => {
  gpm = instance;
  window.gpm = instance;
  gpmIPC.attach(gpm);
};
const gpmControlInterface = {
  search() {
    if (!gpm) return;
    // Focus the search bar
    // TODO: move this to a library someplace
    gpm.executeJavaScript(
      'document.querySelector(\'#material-one-middle input.sj-search-box\').select()'
    );
  },
  goBack() {
    if (!gpm || !gpm.canGoBack()) return;
    gpm.goBack();
  },
  goForward() {
    if (!gpm || !gpm.canGoForward()) return;
    gpm.goForward();
  },
};
const gpmIPCInterface = connectToIPC({
  namespace: 'gpm',
  ipc: gpmIPC,
  send: gpmIPC.send,
});
const gmusicRemoteCaller = gpmIPCInterface.remoteObject('gmusic');
const themesRemoteCaller = gpmIPCInterface.remoteObject('themes');

// Bind to GPM ready event
gpmIPCInterface.on('ready', () => {
  // Initialize themes
  themesRemoteCaller('setTheme', 'base', '');
});

// Connect to main IPC
const mainIPCInterface = connectToIPC({
  namespace: 'app',
  ipc: ipcRenderer,
  send: ipcRenderer.send,
});

// Proxy media keys to GPM
mainIPCInterface.on('shortcut', (e, key) => {
  switch (key) {
    case 'MediaNextTrack':
      gmusicRemoteCaller('playback.forward');
      break;

    case 'MediaPreviousTrack':
      gmusicRemoteCaller('playback.rewind');
      break;

    case 'MediaStop':
      gmusicRemoteCaller('playback.playPause');
      break;

    case 'MediaPlayPause':
      gmusicRemoteCaller('playback.playPause');
      break;

    default:
      // Ignore - we don't know this shortcut
  }
});

// Proxy menu clicks to GPM
mainIPCInterface.on('playPause', () => (
  gmusicRemoteCaller('playback.playPause')
));
mainIPCInterface.on('previous', () => (
  gmusicRemoteCaller('playback.rewind')
));
mainIPCInterface.on('next', () => (
  gmusicRemoteCaller('playback.forward')
));
mainIPCInterface.on('volumeUp', () => (
  gmusicRemoteCaller('volume.increaseVolume')
));
mainIPCInterface.on('volumeDown', () => (
  gmusicRemoteCaller('volume.decreaseVolume')
));
mainIPCInterface.on('thumbsUp', () => (
  gmusicRemoteCaller('rating.toggleThumbsUp')
));
mainIPCInterface.on('thumbsDown', () => (
  gmusicRemoteCaller('rating.toggleThumbsDown')
));
mainIPCInterface.on('toggleRepeatMode', () => (
  gmusicRemoteCaller('playback.toggleRepeat')
));
mainIPCInterface.on('repeatAll', () => (
  gmusicRemoteCaller('playback.toggleRepeat', REPEAT_STATE_LIST_REPEAT)
));
mainIPCInterface.on('repeatOne', () => (
  gmusicRemoteCaller('playback.toggleRepeat', REPEAT_STATE_SINGLE_REPEAT)
));
mainIPCInterface.on('repeatNone', () => (
  gmusicRemoteCaller('playback.toggleRepeat', REPEAT_STATE_NO_REPEAT)
));
mainIPCInterface.on('toggleShuffle', () => (
  gmusicRemoteCaller('playback.toggleShuffle')
));
mainIPCInterface.on('toggleVisualization', () => (
  gmusicRemoteCaller('playback.toggleVisualization')
));
mainIPCInterface.on('setCurrentTime', (e, time) => {
  store.dispatch(onOptimisticSetCurrentTime(time));
  gmusicRemoteCaller('playback.setCurrentTime', time);
});
mainIPCInterface.on('search', () => (
  gpmControlInterface.search()
));
mainIPCInterface.on('goBack', () => (
  gpmControlInterface.goBack()
));
mainIPCInterface.on('goForward', () => (
  gpmControlInterface.goForward()
));

window.showSettings = () => mainIPCInterface.emit('settings:show');
window.hideSettings = () => mainIPCInterface.emit('settings:hide');

// Set up binding for mouse
const mouse = buildMouse();
let offset = null;
mouse.on('left-drag', (x, y) => {
  if (!offset) return;

  const newX = Math.round(x - offset[0]);
  const newY = Math.round(y - offset[1]);

  try {
    remote.getCurrentWindow().setPosition(newX, newY);
  } catch (e) {
    // Swallow errors, as they happen intermittently
  }
});
mouse.on('left-up', () => {
  offset = null;
});
const mouseInterface = {
  onMouseDown(x, y) {
    offset = [x, y];
  },
};
gpmIPCInterface.exposeObject({
  key: 'mouse',
  object: mouseInterface,
});

// Connect GPM events to redux
const gpmBoundActions = bindActionCreators(gpmActions, store.dispatch);

gpmIPCInterface.on('change:track', (event, ...args) => {
  gpmBoundActions.onChangeTrack(...args);
});

gpmIPCInterface.on('change:shuffle', (event, ...args) => {
  gpmBoundActions.onChangeShuffle(...args);
});

gpmIPCInterface.on('change:repeat', (event, ...args) => {
  gpmBoundActions.onChangeRepeat(...args);
});

gpmIPCInterface.on('change:playback', (event, ...args) => {
  gpmBoundActions.onChangePlayback(...args);
});

gpmIPCInterface.on('change:playback-time', (event, ...args) => {
  gpmBoundActions.onChangePlaybackTime(...args);
});

gpmIPCInterface.on('change:rating', (event, ...args) => {
  gpmBoundActions.onChangeRating(...args);
});

// Proxy window events to backend
const onClose = () => mainIPCInterface.emit('onClose');
const onMinimize = () => mainIPCInterface.emit('onMinimize');
const onFullscreen = () => mainIPCInterface.emit('onFullscreen');
const onMaximize = () => mainIPCInterface.emit('onMaximize');

render(
  <AppContainer>
    <Root
      onClose={onClose}
      onFullscreen={onFullscreen}
      onGPM={onGPM}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      store={store}
    />
  </AppContainer>,
  root
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot
          onClose={onClose}
          onFullscreen={onFullscreen}
          onGPM={onGPM}
          onMaximize={onMaximize}
          onMinimize={onMinimize}
          store={store}
        />
      </AppContainer>,
      root
    );
  });
}
