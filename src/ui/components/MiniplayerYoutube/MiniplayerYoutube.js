import React, { Component, PropTypes } from 'react';

import YouTube from 'react-youtube';

import classnames from 'classnames';

import miniplayer from '../Miniplayer/Miniplayer.scss';

/* Youtube anyone? */
class YoutubeStorage {
  place = null;

  hide() {
    this.assign(null);
  }

  assign(c) {
    if (this.place) {
      this.place();
    }
    this.place = c;
  }

  retract(c) {
    if (this.place === c) {
      this.place = null;
    }
  }
}

export const youtubeStorage = new YoutubeStorage();

/**
 * Notes with <YouTube> events for this.state or setting doesn't work
 * results to an error stating setting state isn't a function
 * which is why for the dom selectors for a `bypass` ?
 */
class MiniplayerYoutube extends Component {
  static propTypes = {
    className: PropTypes.string,
    triggerClassName: PropTypes.string,
    // trigger: PropTypes.any.isRequired, // eslint-disable-line
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    youTubeID: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    triggerClassName: 'youtube_trigger',
    // trigger: null,
    onShow: null,
    onHide: null,
    youTubeID: null,
  };

  /* events: {
   'onPlayVideo': this.onPlayVideo()
   }*/
  state = {
    youTubeID: 'No Youtube video',
    isYouTubeShown: !1,
    isYouTubeFullScreen: !1,
    triggerClassName: 'youtube_trigger',
    player: null,
    options: {
      height: '356',
      width: '364',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        showinfo: 0,
        iv_load_policy: 3,
        html5: true,
        fs: 0,
        rel: 0,
        start: 1,
      },

    },
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.youTubeID && (this.state.youTubeID !== nextProps.youTubeID)) {
      this.setState({ youTubeID: nextProps.youTubeID });
    }
  }

  onError = () => {
    const restriction = "Looks like Radiant Player can't play this video as to grounds of restriction by YouTube. Click the `X` on the top right to continue";

    const check_error = (document.querySelector('.youtube iframe').contentDocument.querySelector('.ytp-error-content-wrap span') === null) ? !1 : !!1; // eslint-disable-line

    if (check_error) { // eslint-disable-line
      const error = document.querySelector('.youtube iframe').contentDocument.querySelector('.ytp-error-content-wrap span').textContent.match('restricted');

      if (error) {
        document.querySelector('.youtube iframe').contentDocument.querySelector('.ytp-error-content-wrap span').textContent = restriction;
      } else if (check_error) { // eslint-disable-line
        document.querySelector('.youtube iframe').contentDocument.querySelector('.ytp-error-content-wrap span a').innerHTML = '';
      }
    }
  }

  onEnd = () => document.querySelector('.youtube a').click()

  onPlayVideo = () => {

  }

  onPauseVideo = () => {

  }

  onChangeVideo = () => {
    this.setState({
      youTubeID: this.state.youTubeID === this.state.youTubeID ? this.state.youTubeID : 'No Youtube video',
    });
  }

  onReady = (e) => {
    const player = document.querySelector('.youtube iframe').contentDocument;// document.querySelector(e.target.a).contentDocument;
    const player_container = player.querySelector('.html5-video-container'); // eslint-disable-line

    // Remove elements so nothing fishy happens?
    player_container.parentNode.removeChild(player.querySelector('.ytp-gradient-top'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-chrome-top'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-cards-button'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-unmute.ytp-popup'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-paid-content-overlay'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-ad-persistent-progress-bar-container'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-cards-teaser'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-playlist-menu'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-share-panel'));
    player_container.parentNode.removeChild(player.querySelector('.ytp-watermark'));

    // console.log(e.target); //setFauxFullscreen maybe?
    e.target.pauseVideo();
  }

  setYoutubeFullScreen = () => {
    const { actions } = this.props; // eslint-disable-line
    actions('DockYoutubeFullScreen', this.state.isYouTubeFullScreen);

    if (this.state.isYouTubeFullScreen) {
      this.setState({ isYouTubeFullScreen: !1 }); // make sure we reset
    }
  }

  setYTState = () => {
    // only allow to toggle our fullscreen if we are clicking on our fullscreen button
    this.setState({ isYouTubeFullScreen: !!1 });
    this.setYoutubeFullScreen();
  }

  show = (e) => {
    youtubeStorage.assign(this.hide);
    this.setState({ isYouTubeShown: !!1 });
    if (this.props.onShow) { this.props.onShow(e); }
  }

  hide = (e) => {
    this.setState({ isYouTubeShown: !1 });
    if (this.props.onHide) {
      this.props.onHide(e);
    }
  }

  hasClass = (e, c) => e.classList.contains(c)

  toggle = (e) => { // eslint-disable-line
    const { actions, state } = this.props; // eslint-disable-line

    e.preventDefault();
    e.stopPropagation();

    const isPaused = document.querySelector('.youtube iframe').contentDocument.querySelector('.html5-video-player').classList.contains('paused-mode');
    const isPlayed = document.querySelector('.youtube iframe').contentDocument.querySelector('.html5-video-player').classList.contains('playing-mode');

    if (this.state.isYouTubeShown) {
      this.hide(e);

      if (isPlayed) {
        document.querySelector('.youtube iframe').contentDocument.querySelector('.html5-video-player').click();
      }

      youtubeStorage.retract(this.hide);

      if (this.hasClass(document.querySelector('body'), 'fullscreen')) {
        document.querySelector('.youtube_fullscreen').click();
      }

      if (state === 'paused') {
        return actions('playPause');
      }
    } else {
      if (isPaused) {
        document.querySelector('.youtube iframe').contentDocument.querySelector('.html5-video-player').click();
      }

      this.show(e);
      if (state === 'playing') {
        return actions('playPause');
      }
    }
  }

  render() {
    const { className, triggerClassName, trigger, youTubeID } = this.props; // eslint-disable-line

    const youtubeClasses = classnames('youtube', className, 'youtube__model', { youtube__active: this.state.isYouTubeShown });

    const renderTriger = (active = this.state.isYouTubeShown) => {
      if (active) {
        return (<svg
          className={
            `${'youtube_button ' + 'active' + ' '}${miniplayer.shadow}` // eslint-disable-line
          }
          viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
        >
          <g>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </g>
        </svg>);
      }
      return (<svg
        className={
          `${'youtube_button' + ' '}${miniplayer.shadow}` // eslint-disable-line
        }
        viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
      >
        <g>
          <path d="M23.74 6.6s-.23-1.65-.95-2.37c-.91-.96-1.93-.96-2.4-1.02C17.04 2.97 12 3 12 3s-5.02-.03-8.37.21c-.46.06-1.48.06-2.39 1.02C.52 4.95.28 6.6.28 6.6S.04 8.55 0 10.48v2.02c.04 1.94.28 3.87.28 3.87s.24 1.65.96 2.38c.91.95 2.1.92 2.64 1.02 1.88.19 7.91.23 8.12.23 0 0 5.05.01 8.4-.23.46-.06 1.48-.06 2.39-1.02.72-.72.96-2.37.96-2.37s.24-1.94.25-3.87v-2.02c-.02-1.94-.26-3.89-.26-3.89zM9.57 15V7.99L16 11.63 9.57 15z" />
        </g>
      </svg>);
    };

    const renderTrigerFullScreen = (active = this.state.isYouTubeFullScreen) => {
      if (active) {
        return (<svg
          className={
            `${'youtube_button fullscreen ' + 'active' + ' '}${miniplayer.shadow}` // eslint-disable-line
          }
          viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
        >
          <g>
            <path d="M8.6,17l2,2v-5.5H5.1l2,2L4,18.6L5.4,20C5.4,20.1,8.6,17,8.6,17z" />
          </g>
          <g>
            <path d="M15.4,7l-2-2v5.5h5.5l-2-2L20,5.4L18.6,4C18.6,3.9,15.4,7,15.4,7z" />
          </g>
        </svg>);
      }
      return (<svg
        className={
          `${'youtube_button fullscreen' + ' '}${miniplayer.shadow}` // eslint-disable-line
        }
        viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
      >
        <g>
          <path d="M6,16.5l-2-2V20h5.5l-2-2l3.1-3.1l-1.4-1.4C9.2,13.4,6,16.5,6,16.5z" />
        </g>
        <g>
          <path d="M18,7.5l2,2V4h-5.5l2,2l-3.1,3.1l1.4,1.4C14.8,10.6,18,7.5,18,7.5z" />
        </g>
      </svg>);
    };
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (<div onLoad={this.hide} className={youtubeClasses}>
      <a href="" onClick={this.toggle} className={`youtube__onset ${miniplayer.minilayout} ${miniplayer.flex_center} ${miniplayer.self_center}`}>{renderTriger()}</a>
      <span onClick={this.setYTState} className={`youtube__onset youtube_fullscreen ${miniplayer.minilayout} ${miniplayer.flex_center} ${miniplayer.self_center}`}>{renderTrigerFullScreen()}</span>
      <div>
        <div className={`youtube__content ${miniplayer.minilayout} ${miniplayer.flex_center} ${miniplayer.self_center}`}>
          <YouTube
            videoId={youTubeID}
            opts={this.state.options}
            onReady={this.onReady}
            onEnd={this.onEnd}
            onError={this.onError}
            onPause={this.onPauseVideo}
            onPlay={this.onPlayVideo}
          />
        </div>
      </div>
    </div>
    );
    /* eslint-disable jsx-a11y/no-static-element-interactions */
  }
}

export default MiniplayerYoutube;
