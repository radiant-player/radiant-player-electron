import { compose, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import createEngine from 'redux-storage/engines/localStorage';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import storage from 'redux-storage';

import reducer from '../reducers';

export function createRedux() {
  const persistedReducer = storage.reducer(reducer);

  const storageEngine = createEngine('radiant-store-v1.0.0');
  const storageMiddleware = storage.createMiddleware(storageEngine);

  const middleware = [
    promiseMiddleware,
    storageMiddleware,
    createLogger({
      collapsed: true,
    }),
  ];

  const createStoreWithMiddleware = compose(
    applyMiddleware(...middleware),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);

  // const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

  const store = createStoreWithMiddleware(persistedReducer);

  const storageLoader = storage.createLoader(storageEngine);
  storageLoader(store);

  if (module.hot) {
    const nextReducer = require('../reducers');

    module.hot.accept('../reducers',
      () => {
        store.replaceReducer(nextReducer);
      });
  }

  return store;
}
