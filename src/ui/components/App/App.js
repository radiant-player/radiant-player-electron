import React, { Component, PropTypes } from 'react';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import Webview from '../Webview';

export default class App extends Component {
  static contextTypes = {
    store: PropTypes.object,
  }

  render() {
    return (
      <div id="container">
        <Webview />
        <DebugPanel top right bottom>
          <DevTools store={this.context.store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}
