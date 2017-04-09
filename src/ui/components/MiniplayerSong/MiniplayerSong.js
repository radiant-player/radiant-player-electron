import React, { Component, PropTypes } from 'react';

import styles from './MiniplayerSong.scss';

const renderThumb = (direction = 'up', active = false) => {
  /* eslint-disable max-len */

  const activeTransform = direction === 'down'
    ? 'translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000)'
    : '';
  const inactiveTransform = direction === 'down'
    ? 'translate(2.000000, 3.000000)'
    : 'translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) translate(2.000000, 3.000000)';

  if (active) {
    return (
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g transform={activeTransform}>
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <g transform={inactiveTransform}>
        <path d="M13,0H4C3.2,0,2.5,0.5,2.2,1.2l-3,7.3C-0.9,8.7-1,8.9-1,9.2v2.1 c0,1.1,0.9,2.1,2,2.1h6.3l-1,4.7v0.3c0,0.4,0.2,0.8,0.4,1.1l0,0c0.6,0.6,1.5,0.5,2.1-0.1l5.6-5.7c0.4-0.4,0.6-0.9,0.6-1.4V2 C15,0.9,14.1,0,13,0L13,0z M12.7,12.6l-3.5,3.6c-0.2,0.2-0.5,0-0.4-0.2l1-4.7H2c-0.6,0-1-0.5-1-1V9.4l0-0.1l2.7-6.7 C3.9,2.3,4.3,2,4.7,2L12,2c0.6,0,1,0.5,1,1v8.8C13,12.2,12.9,12.4,12.7,12.6L12.7,12.6z" />
        <path d="M17,0h4v12h-4V0z" />
      </g>
    </svg>
  );
  /* eslint-enable line-len */
};

const renderEmpty = () => <div className={styles.empty}><div>No song playing</div></div>;

export default class MiniplayerSong extends Component {
  static propTypes = {
    // TODO: fill out the sub fields
    song: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    rating: PropTypes.string,
    onThumbsUp: PropTypes.func,
    onThumbsDown: PropTypes.func,
  }

  renderSong() {
    const { song, rating, onThumbsUp, onThumbsDown } = this.props;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div className={styles.container}>
        <div className={styles.image}>
          <img src={song.albumArt} width="64" alt="Cover Art" />
        </div>
        <div className={styles.details}>
          <span className={styles.title}>{song.title}</span>
          <span>{song.artist}</span>
          <span>{song.album}</span>
        </div>
        <div className={styles.rating}>
          <div className={styles.thumb} onClick={onThumbsUp}>
            {renderThumb('up', rating === '5')}
          </div>
          <div className={styles.thumb} onClick={onThumbsDown}>
            {renderThumb('down', rating === '1')}
          </div>
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }

  render() {
    if (!this.props.song || !this.props.song.title) {
      return renderEmpty();
    }

    return this.renderSong();
  }
}
