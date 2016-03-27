import React, { Component, PropTypes } from 'react';

import styles from './App.scss';
import GooglePlayMusic from '../GooglePlayMusic';

export default class App extends Component {
  static propTypes = {
    onGPM: PropTypes.func,
  }

  static contextTypes = {
    store: PropTypes.object,
  }

  render() {
    const { onGPM } = this.props;
    return (
      <div className={styles.container}>
        <GooglePlayMusic onGPM={onGPM} />
      </div>
    );
  }
}
