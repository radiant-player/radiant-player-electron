import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';

export default function configureStore(initialState = {}) {
  let middleware = applyMiddleware(
    // multi,
    thunk,
    // effects,
  );

  if (__DEV__) {
    const devTools = require('../components/DevTools').default.instrument();
    middleware = compose(middleware, devTools);
  }

  const store = middleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
