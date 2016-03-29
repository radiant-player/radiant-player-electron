import { actions as gpmActions } from '../redux/modules/gpm';
import { bindActionCreators } from 'redux';
import { domIPCBridge, connectToIPC } from '../ipc';
import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';

import {
  REPEAT_STATE_LIST_REPEAT,
  REPEAT_STATE_SINGLE_REPEAT,
  REPEAT_STATE_NO_REPEAT,
} from '../redux/modules/gpm';
import App from './components/App';
import configureStore from '../redux/configureStore';

import './app.scss';

const root = document.getElementById('root');
const store = configureStore();

// Connect to underlying webview and connect IPC bridge
let gpm = null;
const gpmIPC = domIPCBridge(gpm);
const onGPM = instance => {
  window.gpm = gpm = instance;
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
  gmusicRemoteCaller('playback.forward')
));
mainIPCInterface.on('next', () => (
  gmusicRemoteCaller('playback.rewind')
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
mainIPCInterface.on('search', () => (
  gpmControlInterface.search()
));
mainIPCInterface.on('goBack', () => (
  gpmControlInterface.goBack()
));
mainIPCInterface.on('goForward', () => (
  gpmControlInterface.goForward()
));

// Connect GPM events to redux
const gpmBoundActions = bindActionCreators(gpmActions, store.dispatch);
const throttledOnChangePlaybackTime = throttle(gpmBoundActions.onChangePlaybackTime, 500);

gpmIPCInterface.on('change:song', (event, ...args) => {
  gpmBoundActions.onChangeSong(...args);
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
  throttledOnChangePlaybackTime(...args);
});

gpmIPCInterface.on('change:rating', (event, ...args) => {
  gpmBoundActions.onChangeRating(...args);
});

const run = () => {
  const component = (
    <Provider store={store}>
      <App onGPM={onGPM} />
    </Provider>
  );

  ReactDOM.render(component, root);

  if (__DEV__) {
    const DevTools = require('./components/DevTools').default;
    const devNode = (
      <Provider store={store}>
        <DevTools />
      </Provider>
    );
    const devRoot = document.createElement('div');
    root.parentNode.insertBefore(devRoot, root.nextSibling);
    ReactDOM.render(devNode, devRoot);
  }
};

window.addEventListener('DOMContentLoaded', run);
