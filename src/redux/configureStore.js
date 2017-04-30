/* eslint-disable global-require */

import { applyMiddleware, compose, createStore } from 'redux';
import { electronEnhancer } from 'redux-electron-store';
import thunk from 'redux-thunk';

import gpmActions, { GPM_CHANGE_PLAYBACK_TIME } from './actions/gpm';
import rootReducer from './reducers';

export default function configureStore(initialState) {
  let store;
  const enhancers = [];
  const middleware = [];

  middleware.push(thunk);

  if (process.env.NODE_ENV !== 'production') {
    const { createLogger } = require('redux-logger');
    const logger = createLogger({
      level: 'info',
      collapsed: true,
      predicate: (getState, action) => action.type !== GPM_CHANGE_PLAYBACK_TIME,
    });
    middleware.push(logger);
  }

  const actionCreators = {
    ...gpmActions,
  };

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  enhancers.push(applyMiddleware(...middleware));

  enhancers.push(electronEnhancer({
    dispatchProxy: a => store.dispatch(a),
  }));

  const enhancer = composeEnhancers(...enhancers);

  store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers'))
    );
  }

  return store;
}
