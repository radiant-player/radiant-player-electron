import React, { Component, PropTypes } from 'react';
import ReactElectronWebview from 'react-electron-web-view';

import styles from './GooglePlayMusic.scss';

const gpmJavaScript = 'gpm.js';

export default class GooglePlayMusic extends Component {
  static propTypes = {
    onGPM: PropTypes.func,
  };

  static defaultProps = {
    onGPM: null,
  }

  onLoadCommit = (e) => {
    if (e.isMainFrame && this.props.onGPM) this.props.onGPM(e.target);
    this.webview.openDevTools();
  }

  render() {
    return (
      <ReactElectronWebview
        ref={(el) => { this.webview = el; }}
        src="https://play.google.com/music/listen"
        partition="persist:google"
        plugins
        className={styles.webview}
        style={{ height: '100%' }}
        onLoadCommit={this.onLoadCommit}
        nodeintegration
        preload={gpmJavaScript}
      />
    );
  }
}
