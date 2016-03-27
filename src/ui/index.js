import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import { createRedux } from './utils/redux';

import App from './components/App';
import './app.scss';

const appContainer = document.getElementById('root');
const store = createRedux();

let gpm = null;
const sendToGPM = (...args) => gpm ? gpm.send(...args) : null;
const onGPM = instance => window.gpm = gpm = instance;

// Proxy media keys to GPM
ipcRenderer.on('shortcut:MediaNextTrack', () => sendToGPM('playback.forward'));
ipcRenderer.on('shortcut:MediaPreviousTrack', () => sendToGPM('playback.rewind'));
// ipcRenderer.on('shortcut:MediaStop', () => sendToGPM('playback.playPause'));
ipcRenderer.on('shortcut:MediaPlayPause', () => sendToGPM('playback.playPause'));

const run = () => {
  const component = (
    <Provider store={store}>
      <App onGPM={onGPM} />
    </Provider>
  );

  ReactDOM.render(component, appContainer);
};

window.addEventListener('DOMContentLoaded', run);
