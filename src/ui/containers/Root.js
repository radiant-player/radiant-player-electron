import { Provider } from 'react-redux';
import React, { PropTypes } from 'react';

import App from '../components/App';

export default function Root({
  onClose,
  onFullscreen,
  onGPM,
  onMaximize,
  onMinimize,
  store,
}) {
  return (
    <Provider store={store}>
      <App
        onClose={onClose}
        onFullscreen={onFullscreen}
        onGPM={onGPM}
        onMaximize={onMaximize}
        onMinimize={onMinimize}
      />
    </Provider>
  );
}

Root.propTypes = {
  onClose: PropTypes.func,
  onFullscreen: PropTypes.func,
  onGPM: PropTypes.func,
  onMaximize: PropTypes.func,
  onMinimize: PropTypes.func,
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

Root.defaultProps = {
  onClose: null,
  onFullscreen: null,
  onGPM: null,
  onMaximize: null,
  onMinimize: null,
};
