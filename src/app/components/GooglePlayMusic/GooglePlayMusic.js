import path from 'path';
import React, { Component, PropTypes } from 'react';
import ReactElectronWebview from 'react-electron-webview';

import styles from './Webview.scss';

const gpmJavaScript = './gpm.js';

export default class GooglePlayMusic extends Component {
  static propTypes = {
    onGPM: PropTypes.func,
  };

  onLoadCommit(e) {
    if (e.isMainFrame) {
      if (this.props.onGPM) this.props.onGPM(e.target);
    }
  }

  render() {
    const boundLoadCommit = this.onLoadCommit.bind(this);

    return (
      <ReactElectronWebview
        ref="webview"
        id="webview"
        src="https://play.google.com/music/listen"
        partition="persist:google"
        plugins
        className={styles.webview}
        loadCommit={boundLoadCommit}
        nodeintegration
        preload={gpmJavaScript}
      />
    );
  }
}
