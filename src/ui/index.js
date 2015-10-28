import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createRedux } from './utils/redux';

import App from './components/App';
import './app.css';

const appContainer = document.getElementById('react-root');
const store = createRedux();

const run = () => {
  const component = (
    <Provider store={store}>
      <App />
    </Provider>
  );

  ReactDOM.render(component, appContainer);
};

window.addEventListener('DOMContentLoaded', run);
