import React, { Component, PropTypes } from 'react';

import styles from './Titlebar.scss';

const ALT = 18;
const classRegex = new RegExp(`\\b${styles.alt}\\b`);

export default class Titlebar extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onMinimize: PropTypes.func,
    onFullscreen: PropTypes.func,
    onMaximize: PropTypes.func,
  }

  static defaultProps = {
    onClose: null,
    onMinimize: null,
    onFullscreen: null,
    onMaximize: null,
  }

  componentDidMount() {
    this.boundKeyDown = this.boundKeyDown || (e => this.onWindowKeyDown(e));
    this.boundKeyUp = this.boundKeyUp || (e => this.onWindowKeyUp(e));
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
  }

  onWindowKeyDown = (e) => {
    if (e.keyCode !== ALT) return;
    this.titlebar.className = `${this.titlebar.className} ${styles.alt}`;
  }

  onWindowKeyUp = (e) => {
    if (e.keyCode !== ALT) return;
    this.titlebar.className = this.titlebar.className.replace(classRegex, '');
  }

  onClose = (...args) => {
    if (this.props.onClose) this.props.onClose(...args);
  }

  onMinimize = (...args) => {
    if (this.props.onMinimize) this.props.onMinimize(...args);
  }

  onFullscreen = (e) => {
    if (e.altKey) {
      if (this.props.onFullscreen) this.props.onMaximize();
    } else if (this.props.onFullscreen) this.props.onFullscreen();
  }

  render() {
    /* eslint-disable max-len, jsx-a11y/no-static-element-interactions */
    return (
      <div className={`${styles.titlebar} ${styles['webkit-draggable']} titlebar-hide`} ref={(div) => { this.titlebar = div; }}>
        <div className={styles['titlebar-stoplight']}>
          <div className={styles['titlebar-close']} onClick={this.onClose}>
            <svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
              <polygon
                fill="#4d0000"
                points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"
              />
            </svg>
          </div>
          <div className={styles['titlebar-minimize']} onClick={this.onMinimize}>
            <svg x="0px" y="0px" viewBox="0 0 8 1.1">
              <rect fill="#995700" width="8" height="1.1" />
            </svg>
          </div>
          <div className={styles['titlebar-fullscreen']} onClick={this.onFullscreen}>
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
    /* eslint-enable max-len, jsx-a11y/no-static-element-interactions */
  }
}
