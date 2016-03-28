import { applyMiddleware, compose, createStore } from 'redux';
import { electronEnhancer } from 'redux-electron-store';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';

export default function configureStore(initialState = {}) {
  let middleware = applyMiddleware(
    // multi,
    thunk,
    // effects,
  );

  middleware = compose(middleware, electronEnhancer());

  if (__DEV__ && __APP__) {
    const devTools = require('../app/components/DevTools').default.instrument();
    middleware = compose(middleware, devTools);
  }

  // const store = middleware(createStore)(rootReducer, initialState);
  const store = createStore(rootReducer, initialState, middleware);

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
