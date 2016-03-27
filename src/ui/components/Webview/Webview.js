import React from 'react';

import styles from './Webview.scss';

export default function Webview() {
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
