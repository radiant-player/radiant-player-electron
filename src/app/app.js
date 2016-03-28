import { actions as gpmActions } from '../redux/modules/gpm';
import { bindActionCreators } from 'redux';
import { domIPCBridge, connectToIPC } from '../ipc';
import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';

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
const gpmIPCInterface = connectToIPC({
  namespace: 'gpm',
  ipc: gpmIPC,
  send: gpmIPC.send,
});
const gmusicRemoteCaller = gpmIPCInterface.remoteObject('gmusic');

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

// Connect GPM events to redux
const gpmBoundActions = bindActionCreators(gpmActions, store.dispatch);
const throttledOnChangePlaybackTime = throttle(gpmBoundActions.onChangePlaybackTime, 500);

gpmIPCInterface.on('change:song', (event, ...args) => {
  gpmBoundActions.onChangeSong(...args);
});

gpmIPCInterface.on('change:shuffle', (event, ...args) => {
  console.log('change:shuffle', event, ...args);
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
