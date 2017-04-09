import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import MiniplayerControls from '../MiniplayerControls';
import MiniplayerSong from '../MiniplayerSong';
import styles from './Miniplayer.scss';

class Miniplayer extends Component {
  static propTypes = {
    // TODO: fill out this prop types definition
    gpm: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    actions: PropTypes.func.isRequired,
  }

  onThumbsUp = () => {
    const { actions } = this.props;
    actions('thumbsUp');
  }

  onThumbsDown = () => {
    const { actions } = this.props;
    actions('thumbsDown');
  }

  render() {
    const { gpm, actions } = this.props;
    const { state, time, shuffle, repeat } = gpm;

    return (
      <div className={styles.container}>
        <MiniplayerSong
          song={gpm.song}
          rating={gpm.rating}
          onThumbsUp={this.onThumbsUp}
          onThumbsDown={this.onThumbsDown}
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
