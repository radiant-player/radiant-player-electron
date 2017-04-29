import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import MiniplayerControls from '../MiniplayerControls';
import MiniplayerSong from '../MiniplayerSong';
import MiniplayerDropmenu from '../MiniplayerDropmenu';
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

  DockMiniPlayer = () => {
      const { actions } = this.props;
      actions('DockMiniPlayer', true); // add a menu for check box Always on top to pass in the !!1 or !1
  }

  render() {
    const { gpm, actions } = this.props;
    const { state, time, shuffle, repeat, volume, youtube, hasYoutube } = gpm;

    return (
        <div className={styles.pB + ' '+ styles.container}>
          <div className={'rp_selected ' + styles.minilayout  + ' ' + styles.horizontal + ' ' + styles.end_justified}>
              <div className={styles.pos_rel + ' ' + styles.zdex}>
                  <MiniplayerDropmenu
                      volume={volume}
                      actions={actions}
                  />
              </div>
          </div>
          <MiniplayerSong
              song={gpm.song}
              youtube={youtube}
              hasYoutube={hasYoutube}
              actions={actions}
              state={state}
          />
          <MiniplayerControls
              actions={actions}
              state={state}
              time={time}
              shuffle={shuffle}
              repeat={repeat}
              rating={gpm.rating}
              onThumbsUp={this.onThumbsUp}
              onThumbsDown={this.onThumbsDown}
          />
        </div>
    );
  }
}

const mapStateToProps = ({ gpm }) => ({ gpm });

export default connect(mapStateToProps)(Miniplayer);
