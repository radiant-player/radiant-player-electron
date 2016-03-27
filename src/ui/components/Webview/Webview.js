import React, { Component } from 'react';

import styles from './Webview.scss';

export default class GooglePlayMusicWebview extends Component {
  render() {
    return (
      <webview
        id="webview"
        src="https://play.google.com/music/listen"
        partition="persist:google"
        plugins
        className={styles.webview}
      />
    );
  }
}
