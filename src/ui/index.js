import React from 'react';
import ReactDOM from 'react-dom';

import Webview from './Webview';
import './app.css';

const appContainer = document.getElementById('react-root');
ReactDOM.render(<Webview />, appContainer);
