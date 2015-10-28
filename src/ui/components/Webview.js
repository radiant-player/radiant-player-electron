import React from 'react';

export default function Webview() {
  return (
    <webview
      id="webview"
      src="https://play.google.com/music/listen"
      partition="persist:google"
      plugins
    />
  );
}
