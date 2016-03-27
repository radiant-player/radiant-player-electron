import React, { PropTypes } from 'react';

import styles from './App.scss';
import GooglePlayMusic from '../GooglePlayMusic';

const App = ({ onGPM }) => (
  <div className={styles.container}>
    <GooglePlayMusic onGPM={onGPM} />
  </div>
);

App.propTypes = {
  onGPM: PropTypes.func,
};

App.contextTypes = {
  store: PropTypes.object,
};

export default App;
