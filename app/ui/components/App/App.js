import React, { PropTypes } from 'react';

import GooglePlayMusic from '../GooglePlayMusic';
import styles from './App.scss';
import Titlebar from '../Titlebar';

const App = ({
  onClose,
  onFullscreen,
  onGPM,
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
  onClose: PropTypes.func,
  onFullscreen: PropTypes.func,
  onGPM: PropTypes.func,
  onMaximize: PropTypes.func,
  onMinimize: PropTypes.func,
};

App.defaultProps = {
  onClose: null,
  onFullscreen: null,
  onGPM: null,
  onMaximize: null,
  onMinimize: null,
};

App.contextTypes = {
  store: PropTypes.object,
};

export default App;
