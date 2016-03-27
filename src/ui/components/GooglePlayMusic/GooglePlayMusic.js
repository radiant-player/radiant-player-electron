import path from 'path';
import React, { Component, PropTypes } from 'react';
import ReactElectronWebview from 'react-electron-webview';

import styles from './Webview.scss';

const gpmJavaScript = path.resolve('./dist/gpm.js');

export default class GooglePlayMusic extends Component {
  static propTypes = {
    onGPM: PropTypes.func,
  };

  _loadCommit(e) {
    if (e.isMainFrame) {
      const gpm = e.target;

      gpm.addEventListener('ipc-message', () => {
        // console.log(event);
        // Prints "pong"
      });

      if (this.props.onGPM) this.props.onGPM(gpm);

      // gpm.executeJavaScript(gpmJavaScript);
      // gpm.send('ping');
      // window.webview = e.target;
    }
  }

  render() {
    const boundLoadCommit = this._loadCommit.bind(this);

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
