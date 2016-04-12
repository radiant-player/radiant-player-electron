import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import MiniplayerControls from '../MiniplayerControls';
import MiniplayerSong from '../MiniplayerSong';
import styles from './Miniplayer.scss';

export class Miniplayer extends Component {
  static propTypes = {
    gpm: PropTypes.object.isRequired,
    actions: PropTypes.func.isRequired,
  }

  onThumbsUp() {
    const { actions } = this.props;
    actions('thumbsUp');
  }

  onThumbsDown() {
    const { actions } = this.props;
    actions('thumbsDown');
  }

  render() {
    const { gpm, actions } = this.props;

    const boundOnThumbsUp = this.onThumbsUp.bind(this);
    const boundOnThumbsDown = this.onThumbsDown.bind(this);

    const { state, time, shuffle, repeat } = gpm;

    return (
      <div className={styles.container}>
        <MiniplayerSong
          song={gpm.song}
          rating={gpm.rating}
          onThumbsUp={boundOnThumbsUp}
          onThumbsDown={boundOnThumbsDown}
        />
        <MiniplayerControls
          actions={actions}
          state={state}
          time={time}
          shuffle={shuffle}
          repeat={repeat}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ gpm }) => ({ gpm });

export default connect(mapStateToProps)(Miniplayer);
