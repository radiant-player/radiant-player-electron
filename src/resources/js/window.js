var ipc = require('ipc');

//.insertCSS(css)
onload = function() {
  var webview = document.getElementById('webview');
  var css = document.getElementById('css');

  var loadstart = function() {
    console.log('loading...');
  };

  var loadcommit = function(e) {
    if (e.isMainFrame) {
      webview.insertCSS(css.innerHTML);
    }
  };

  var loadstop = function() {
    console.log('loaded');
  };

  var playpause = () => {
    webview.executeJavaScript('document.querySelector(\'#player sj-icon-button[data-id="play-pause"]\').click();');
  };

  // When we receive requests to control playback, run them
  ipc.on('control:play-pause', function handlePlayPause(evt) {
    playpause();
  });

  //webview.addEventListener('did-start-loading', loadstart);

  webview.addEventListener('load-commit', loadcommit);

  //webview.addEventListener('did-stop-loading', loadstop);
};
