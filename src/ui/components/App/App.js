import React, { Component, PropTypes } from 'react';

import styles from './App.scss';
import Webview from '../Webview';

export default class App extends Component {
  static contextTypes = {
    store: PropTypes.object,
  }

  render() {
    return (
      <div className={styles.container}>
        <Webview />
      </div>
    );
  }
}
