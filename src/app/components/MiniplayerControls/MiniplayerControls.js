import React, { Component, PropTypes } from 'react';

import styles from './MiniplayerControls.scss';

import {
  REPEAT_STATE_SINGLE_REPEAT,
  REPEAT_STATE_NO_REPEAT,
  SHUFFLE_STATE_ALL_SHUFFLE,
} from '../../../redux/modules/gpm';

export default class MiniplayerControls extends Component {
  static propTypes = {
    actions: PropTypes.func.isRequired,
    repeat: PropTypes.string,
    shuffle: PropTypes.string,
    state: PropTypes.string,
    time: PropTypes.object,
  }

  onClick() {}

  _renderRepeat() {
    const { repeat, actions } = this.props;

    const active = repeat && repeat !== REPEAT_STATE_NO_REPEAT;
    const single = repeat === REPEAT_STATE_SINGLE_REPEAT;

    const toggleRepeatMode = () => actions('toggleRepeatMode');

    return (
      <svg onClick={toggleRepeatMode} className={active ? styles.active : ''} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d={`M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z${single ? 'm-4-2V9h-1l-2 1v1h1.5v4H13z' : ''}`}></path></g></svg> // eslint-disable-line max-len
    );
  }

  _renderPrev() {
    const { actions, state } = this.props;

    const disabled = state === 'stopped';
    const previous = () => !disabled && actions('previous');

    return (
      <svg className={disabled ? styles.disabled : ''} onClick={previous} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></g></svg> // eslint-disable-line max-len
    );
  }

  _renderPlayPause() {
    const { state, actions } = this.props;

    const disabled = state === 'stopped';
    const playPause = () => !disabled && actions('playPause');

    if (state === 'playing') {
      return (
        <svg onClick={playPause} className={`${styles.playing} ${styles.playPause}`} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"></path></g></svg> // eslint-disable-line max-len
      );
    }

    return (
      <svg onClick={playPause} className={`${styles.playPause} ${disabled ? styles.disabled : styles.paused}`} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g transform="translate(2.000000, 2.000000)"><path d="M20,10 C20,4.4775 15.5228125,0 10,0 C4.4771875,0 0,4.4775 0,10 C0,15.5228125 4.4771875,20 10,20 C15.5228125,20 20,15.5228125 20,10"></path><path d="M7.428625,6.04975 C7.428625,5.71525 7.795,5.50975 8.08075,5.684125 L14.54425,9.634375 C14.818,9.80125 14.818,10.198375 14.54425,10.365625 L8.08075,14.315875 C7.795,14.49025 7.428625,14.28475 7.428625,13.95025 L7.428625,6.04975 Z" fill="#FFFFFF"></path></g></svg> // eslint-disable-line max-len
    );
  }

  _renderNext() {
    const { state, actions } = this.props;

    const disabled = state === 'stopped';
    const next = () => !disabled && actions('next');

    return (
      <svg className={disabled ? styles.disabled : ''} onClick={next} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></g></svg>  // eslint-disable-line max-len
    );
  }

  _renderShuffle() {
    const { shuffle, actions } = this.props;

    const active = shuffle === SHUFFLE_STATE_ALL_SHUFFLE;
    const toggleShuffle = () => actions('toggleShuffle');

    return (
      <svg onClick={toggleShuffle} className={active ? styles.active : ''} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></g></svg> // eslint-disable-line max-len
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this._renderRepeat()}
        {this._renderPrev()}
        {this._renderPlayPause()}
        {this._renderNext()}
        {this._renderShuffle()}
      </div>
    );
  }
}
