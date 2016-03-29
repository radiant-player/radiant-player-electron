import React, { Component, PropTypes } from 'react';

import styles from './Titlebar.scss';

export default class Titlebar extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onMinimize: PropTypes.func,
    onFullscreen: PropTypes.func,
    onMaximize: PropTypes.func,
  }

  _onClose(...args) {
    if (this.props.onClose) this.props.onClose(...args);
  }

  _onMinimize(...args) {
    if (this.props.onMinimize) this.props.onMinimize(...args);
  }

  _onFullscreen(e) {
    if (e.altKey) {
      if (this.props.onFullscreen) this.props.onMaximize();
    } else {
      if (this.props.onFullscreen) this.props.onFullscreen();
    }
  }

  render() {
    const boundOnClose = this._onClose.bind(this);
    const boundOnMinimize = this._onMinimize.bind(this);
    const boundOnFullscreen = this._onFullscreen.bind(this);

    /* eslint-disable max-len */
    return (
      <div className={`${styles.titlebar} ${styles['webkit-draggable']}`}>
        <div className={styles['titlebar-stoplight']}>
          <div className={styles['titlebar-close']} onClick={boundOnClose}>
            <svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
              <polygon
                fill="#4d0000"
                points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"
              />
            </svg>
          </div>
          <div className={styles['titlebar-minimize']} onClick={boundOnMinimize}>
            <svg x="0px" y="0px" viewBox="0 0 8 1.1">
              <rect fill="#995700" width="8" height="1.1" />
            </svg>
          </div>
          <div className={styles['titlebar-fullscreen']} onClick={boundOnFullscreen}>
            <svg className={styles['fullscreen-svg']} x="0px" y="0px" viewBox="0 0 6 5.9">
              <path fill="#006400" d="M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z" />
              <path fill="#006400" d="M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z" />
            </svg>
            <svg className={styles['maximize-svg']} x="0px" y="0px" viewBox="0 0 7.9 7.9">
              <polygon
                fill="#006400"
                points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"
              />
            </svg>
          </div>
        </div>
      </div>
    );
    /* eslint-enable max-len */
  }
}