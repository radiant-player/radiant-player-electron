import React, { PropTypes } from 'react';

import GooglePlayMusic from '../GooglePlayMusic';
import styles from './App.scss';
import Titlebar from '../Titlebar';

const App = ({
  onGPM,
  onClose,
  onFullscreen,
  onMaximize,
  onMinimize,
}) => (
  <div className={styles.container}>
    <Titlebar
      onClose={onClose}
      onFullscreen={onFullscreen}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
    />
    <GooglePlayMusic onGPM={onGPM} />
  </div>
);

App.propTypes = {
  onGPM: PropTypes.func,
  onClose: PropTypes.func,
  onFullscreen: PropTypes.func,
  onMaximize: PropTypes.func,
  onMinimize: PropTypes.func,
  // onPassthrough: PropTypes.func,
};

App.contextTypes = {
  store: PropTypes.object,
};

export default App;
