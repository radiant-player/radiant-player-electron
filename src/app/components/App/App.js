import React, { PropTypes } from 'react';

import styles from './App.scss';
import GooglePlayMusic from '../GooglePlayMusic';

// import Titlebar from '../Titlebar';

// const App = ({
//   onGPM,
//   onClose,
//   onFullscreen,
//   onMaximize,
//   onMinimize,
//   onPassthrough,
// }) => (
//   <div className={styles.container}>
//     <Titlebar
//       onClose={onClose}
//       onFullscreen={onFullscreen}
//       onMaximize={onMaximize}
//       onMinimize={onMinimize}
//       onPassthrough={onPassthrough}
//     />
//     <GooglePlayMusic onGPM={onGPM} />
//   </div>
// );

const App = ({
  onGPM,
}) => (
  <div className={styles.container}>
    <GooglePlayMusic onGPM={onGPM} />
  </div>
);

App.propTypes = {
  onGPM: PropTypes.func,
  onClose: PropTypes.func,
  onFullscreen: PropTypes.func,
  onMaximize: PropTypes.func,
  onMinimize: PropTypes.func,
  onPassthrough: PropTypes.func,
};

App.contextTypes = {
  store: PropTypes.object,
};

export default App;
