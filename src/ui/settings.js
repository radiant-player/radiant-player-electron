import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import { connectToIPC } from '../ipc';
import configureStore from '../redux/configureStore';
import Settings from './components/Settings';

// import './miniplayer.scss';

const root = document.getElementById('root');
const store = configureStore();

// Connect to backend to fire player events
const mainIPCInterface = connectToIPC({
  namespace: 'app',
  ipc: ipcRenderer,
  send: ipcRenderer.send,
});

const remoteActions = mainIPCInterface.remoteObject('actions');

const run = () => {
  const component = (
    <Provider store={store}>
      <Settings actions={remoteActions} />
    </Provider>
  );

  ReactDOM.render(component, root);
};

window.addEventListener('DOMContentLoaded', run);
