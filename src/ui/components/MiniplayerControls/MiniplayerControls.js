import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';

import styles from './MiniplayerControls.scss';

import main from '../Miniplayer/Miniplayer.scss';

import {
  REPEAT_STATE_SINGLE_REPEAT,
  REPEAT_STATE_NO_REPEAT,
  SHUFFLE_STATE_ALL_SHUFFLE,
} from '../../../redux/reducers/gpm';

const leftpad = (str, len, ch) => {
  let val = String(str);
  const character = (!ch && ch !== 0) ? ' ' : ch;
  const length = len - val.length;

  let i = -1;

  while (++i < length) { // eslint-disable-line no-plusplus
    val = character + val;
  }

  return val;
};

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

export class DraggableSlider extends Slider {
  onChange(state) {
    const props = this.props;
    this.setState(state);

    const data = { ...this.state, ...state };
    const changedValue = props.range ? [data.lowerBound, data.upperBound] : data.upperBound;
    props.onChange(changedValue);
  }
}

// allow tooltip to display
const createSliderWithTooltip = DraggableSlider.createSliderWithTooltip;
const SliderMini = createSliderWithTooltip(DraggableSlider);

export default class MiniplayerControls extends Component {
  static propTypes = {
    actions: PropTypes.func.isRequired,
    repeat: PropTypes.string,
    shuffle: PropTypes.string,
    state: PropTypes.string,
    rating: PropTypes.string,
    onThumbsUp: PropTypes.func,
    onThumbsDown: PropTypes.func,
    // TODO: fill out this prop type definition
    time: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    repeat: null,
    shuffle: null,
    state: null,
    time: null,
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  renderRepeat() {
    const { repeat, actions } = this.props;

    const active = repeat && repeat !== REPEAT_STATE_NO_REPEAT;
    const single = repeat === REPEAT_STATE_SINGLE_REPEAT;

    const toggleRepeatMode = () => actions('toggleRepeatMode');

    return (
      <svg onClick={toggleRepeatMode} className={active ? styles.active : ''} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g>
          <path d={`M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z${single ? 'm-4-2V9h-1l-2 1v1h1.5v4H13z' : ''}`} />
        </g>
      </svg>
    );
  }

  renderReplay10() {
    const { actions } = this.props;

    const ReplayBack = () => actions('replayBack');

    return (
      <svg onClick={ReplayBack} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g>
          <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1.1 11H10v-3.3L9 13v-.7l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1c.2.1.3.2.5.3s.2.3.3.6.1.5.1.8v.7zm-.9-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5z" />
        </g>
      </svg>
    );
  }

  renderForward30() {
    const { actions } = this.props;

    const SeekForward = () => actions('seekForward');

    return (
      <svg onClick={SeekForward} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g>
          <path d="M9.6 13.5h.4c.2 0 .4-.1.5-.2s.2-.2.2-.4v-.2s-.1-.1-.1-.2-.1-.1-.2-.1h-.5s-.1.1-.2.1-.1.1-.1.2v.2h-1c0-.2 0-.3.1-.5s.2-.3.3-.4.3-.2.4-.2.4-.1.5-.1c.2 0 .4 0 .6.1s.3.1.5.2.2.2.3.4.1.3.1.5v.3s-.1.2-.1.3-.1.2-.2.2-.2.1-.3.2c.2.1.4.2.5.4s.2.4.2.6c0 .2 0 .4-.1.5s-.2.3-.3.4-.3.2-.5.2-.4.1-.6.1c-.2 0-.4 0-.5-.1s-.3-.1-.5-.2-.2-.2-.3-.4-.1-.4-.1-.6h.8v.2s.1.1.1.2.1.1.2.1h.5s.1-.1.2-.1.1-.1.1-.2v-.5s-.1-.1-.1-.2-.1-.1-.2-.1h-.6v-.7zm5.7.7c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1.3.2.5.3.2.3.3.6.1.5.1.8v.7zm-.9-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zM4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z" />
        </g>
      </svg>
    );
  }

  renderPrev() {
    const { actions, state } = this.props;

    const disabled = state === 'stopped';
    const previous = () => !disabled && actions('previous');

    return (
      <svg className={disabled ? styles.disabled : ''} onClick={previous} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></g></svg> // eslint-disable-line max-len
    );
  }

  renderPlayPause() {
    const { state, actions } = this.props;

    const disabled = state === 'stopped';
    const playPause = () => !disabled && actions('playPause');

    if (state === 'playing') {
      return (
        <svg onClick={playPause} className={`${styles.playing} ${styles.playPause}`} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></g></svg> // eslint-disable-line max-len
      );
    }

    return (
      <svg onClick={playPause} className={`${styles.playPause} ${disabled ? styles.disabled : styles.paused}`} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g transform="translate(2.000000, 2.000000)"><path d="M20,10 C20,4.4775 15.5228125,0 10,0 C4.4771875,0 0,4.4775 0,10 C0,15.5228125 4.4771875,20 10,20 C15.5228125,20 20,15.5228125 20,10" /><path d="M7.428625,6.04975 C7.428625,5.71525 7.795,5.50975 8.08075,5.684125 L14.54425,9.634375 C14.818,9.80125 14.818,10.198375 14.54425,10.365625 L8.08075,14.315875 C7.795,14.49025 7.428625,14.28475 7.428625,13.95025 L7.428625,6.04975 Z" fill="#FFFFFF" /></g></svg> // eslint-disable-line max-len
    );
  }

  renderNext() {
    const { state, actions } = this.props;

    const disabled = state === 'stopped';
    const next = () => !disabled && actions('next');

    return (
      <svg className={disabled ? styles.disabled : ''} onClick={next} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></g></svg>  // eslint-disable-line max-len
    );
  }

  renderShuffle() {
    const { shuffle, actions } = this.props;

    const active = shuffle === SHUFFLE_STATE_ALL_SHUFFLE;
    const toggleShuffle = () => actions('toggleShuffle');

    return (
      <svg onClick={toggleShuffle} className={active ? styles.active : ''} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></g></svg> // eslint-disable-line max-len
    );
  }

  renderSlider() {
    const { time, actions, state } = this.props;
    const { cachedTime } = this.state;
    const that = this;
    const disabled = state === 'stopped';

    const onChange = (timecode) => {
      that.setState({ cachedTime: timecode });
    };

    const onAfterChange = (timecode) => {
      actions('setCurrentTime', timecode * 1000).then(() =>
        that.setState({ cachedTime: false })
      );
    };

    const timecodeFormatter = (position) => {
      const hours = leftpad(Math.floor(position / 60 / 60), 2, '0');
      const minutes = leftpad(Math.floor((position - (hours * 60 * 60)) / 60), 2, '0');
      const seconds = leftpad(Math.floor(position - (hours * 60 * 60) - (minutes * 60)), 2, '0');

      if (hours > 0) return `${hours}:${minutes}:${seconds}`;

      return `${minutes}:${seconds}`;
    };

    if (!disabled) {
      if (document.querySelector('.hold') != null) {
        document.querySelector('[data-reactroot]').classList.remove(main.rolledDice);
      }
    }

    if (disabled) {
      return (
        <section className={main.wvH}>
          <div className={main.sLmp}>
            <div className={`rc-slider-container ${main.slicde}`}>
              <SliderMini
                defaultValue={0}
                disabled
              />
            </div>
          </div>
          <div className={`${main.mp_cD} ${main.horizontal} ${main.justified} ${main.minilayout}`}>
            <div className={main.cT}>
                  0:00
                </div>
            <div className={main.eT} >
                  0:00
                </div>
          </div>
        </section>
      );
    }

    return (
      <section className={main.wvH}>
        <div className={main.sLmp}>
          <div className={`rc-slider-container ${main.slicde}`}>
            <SliderMini
              max={Math.floor(time.total / 1000)}
              value={Math.floor(cachedTime || (time.current / 1000))}
              defaultValue={0}
              onChange={onChange}
              onAfterChange={onAfterChange}
              tipFormatter={timecodeFormatter}
              tipTransitionName="rc-tooltip-zoom"
            />
          </div>
        </div>
        <div className={`${main.mp_cD} ${main.horizontal} ${main.justified} ${main.minilayout}`}>
          <div className={main.cT}>
            {timecodeFormatter(Math.floor(cachedTime || (time.current / 1000)))}
          </div>
          <div className={main.eT} >
            {timecodeFormatter(Math.floor(time.total / 1000))}
          </div>
        </div>
      </section>
    );
  }

  render() {
    const { actions, rating, onThumbsUp, onThumbsDown } = this.props;

    const rollDice = () => {
      actions('rollDice');
      document.querySelector('[data-reactroot]').classList.add(main.rolledDice);
    };

    const SongHold = `hold ${main.minilayout} ${main.vertical} ${main.align} ${main.player}`;

    return (
      <div className={SongHold}>
        <div className={main.flex} />
        <player className={main.sB}>
          <div className={`${main.m_b_5} ${main.minilayout} ${main.horizontal} ${main.justified}`}>
            <playerbutton className={`${main.bput} ${main.shadow} ${main.self_center} ${main.repeat}`}>{this.renderRepeat()}</playerbutton>
            <div className={main.flex} />
            <playerbutton className={`${main.bput} ${main.shadow} ${main.self_center}`}><dice id="dice" className={main.dice}><svg onClick={rollDice} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path fill="#000000" d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M8,9.5 C7.2,9.5,6.5,8.8,6.5,8S7.2,6.5,8,6.5S9.5,7.2,9.5,8S8.8,9.5,8,9.5z M12,13.5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5 s1.5,0.7,1.5,1.5S12.8,13.5,12,13.5z M16,17.5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S16.8,17.5,16,17.5z" /></g></svg></dice></playerbutton>
            <div className={main.flex} />
            <playerbutton className={`${main.bput} ${main.shadow} ${main.self_center} ${main.shuffle}`}>{this.renderShuffle()}</playerbutton>
          </div>

          <div className={`${main.mp_ok} ${main.minilayout} ${main.horizontal}`}>

            {this.renderSlider()}

            <div className={`${main.mp_Evs} ${main.minilayout} ${main.horizontal} ${main.justified}`}>

              <playerbutton className={`${main.bput} ${main.self_center}`} onClick={onThumbsUp}>
                {renderThumb('up', rating === '5')}
              </playerbutton>

              <playerbutton className={`${main.bput} ${main.self_center}`}>{this.renderReplay10()}</playerbutton>
              <div className={main.flex} />

              <div className={`${main.minilayout} ${main.horizontal} ${main.center} ${main.self_center}`}>
                <playerbutton className={`${main.bput} ${main.self_center}`}>{this.renderPrev()}</playerbutton>
                <playerbutton className={`${main.bput} ${main.self_center} ${styles.playPause}`}>{this.renderPlayPause()}</playerbutton>
                <playerbutton className={`${main.bput} ${main.self_center}`}>{this.renderNext()}</playerbutton>
              </div>
              <div className={main.flex} />

              <playerbutton className={`${main.bput} ${main.self_center}`}>{this.renderForward30()}</playerbutton>

              <playerbutton className={`${main.bput} ${main.self_center}`} onClick={onThumbsDown}>
                {renderThumb('down', rating === '1')}
              </playerbutton>

            </div>
          </div>

        </player>
      </div>
    );
  }
}
