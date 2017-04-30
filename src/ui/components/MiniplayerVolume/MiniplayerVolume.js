import React, { Component, PropTypes } from 'react';

import classnames from 'classnames';

import Slider from 'rc-slider';

import miniplayer from '../Miniplayer/Miniplayer.scss';

class VolumeStorage {
  callback = null;

  hide() {
    this.register(null);
  }

  register(c) {
    if (this.callback) {
      this.callback();
    }
    this.callback = c;
  }

  unregister(c) {
    if (this.callback === c) {
      this.callback = null;
    }
  }
}

export const volumeStorage = new VolumeStorage();

// Adopted from MiniplayControls
export class DraggableVolume extends Slider {
  onChange(state) {
    const props = this.props;
    this.setState(state);
    const data = { ...this.state, ...state };
    const changedValue = props.range ? [data.lowerBound, data.upperBound] : data.upperBound;
    props.onChange(changedValue);
  }
}

const createSliderWithTooltip = DraggableVolume.createSliderWithTooltip;
const SliderVolume = createSliderWithTooltip(DraggableVolume);

export class MiniplayerVolume extends Component {
  static propTypes = {
    className: PropTypes.string,
    triggerClassName: PropTypes.string,
    children: PropTypes.node, // eslint-disable-line
    trigger: PropTypes.any.isRequired, // eslint-disable-line
    position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    volumeValue: PropTypes.any, // eslint-disable-line
  };

  static defaultProps = {
    className: null,
    triggerClassName: 'volume__trigger',
    children: null,
    trigger: null,
    position: 'top',
    onShow: null,
    onHide: null,
    volumeValue: null,
  };

  state = {
    isVolumeShown: !1,
    volumeValue: 100,
  };

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.volumeValue.style.height.replace(/\D/g,''));
    if (nextProps.volumeValue && (this.state.volumeValue !== nextProps.volumeValue)) {
      this.setState({ volumeValue: nextProps.volumeValue });// .style.height.replace(/\D/g,'')
    }
  }

  /* shouldComponentUpdate() {

  }*/

  componentWillUnmount = () => {
    volumeStorage.unregister(this.hide);
    this.setState({ volumeValue: this.volume });
  };

  setVolumeUpdate(percent) {
    const { actions } = this.props; // eslint-disable-line
    actions('setVolume', percent);
  }

  show = (e) => {
    volumeStorage.register(this.hide);
    this.setState({ isVolumeShown: !!1 });
    if (this.props.onShow) { this.props.onShow(e); }
  };

  hide = (e) => {
    this.setState({ isVolumeShown: !1 });
    if (this.props.onHide) { this.props.onHide(e); }
  };

  toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.isVolumeShown) {
      this.hide(e);
      window.document.querySelector('body').classList.remove(miniplayer.noD);
      volumeStorage.unregister(this.hide);
    } else {
      window.document.querySelector('body').classList.add(miniplayer.noD);
      this.show(e);
    }
  };

  hasClass = (e, c) => e.classList.contains(c);

  clickOutside = (e) => {
        // console.log(e.target);
        // console.log(e.target.parentNode);
    if ((this.hasClass(e.target, miniplayer.flex) || this.hasClass(e.target, miniplayer.pos_rel) || this.hasClass(e.target, 'rp_selected') || this.hasClass(e.target, 'svg') || this.hasClass(e.target.parentNode, miniplayer.menu_bo) || this.hasClass(e.target.parentNode, miniplayer.open))) {
      this.setState({ isVolumeShown: !1 });
      this.setState({ volumeValue: this.volume });
      window.document.querySelector('body').classList.remove(miniplayer.noD);
    }
  };

  VolumeStatus = (percent) => {
    const vol = window.document.querySelector(`[class*='${miniplayer.menu_vol}'] path`);

    switch (!!1) {
      case (percent === 100):
        vol.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
        break;
      case (percent > 50):
        vol.setAttribute('d', 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z');
        break;
      case (percent === 10):
        vol.setAttribute('d', 'M7 9v6h4l5 5V4l-5 5H7z');
        break;
      case (percent === 0):
        vol.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
        break;
      default:
        vol.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
        break;
    }
  }

  renderVolSlider = () => {
    const { actions, volume } = this.props; // eslint-disable-line

    // this.setState({ volumeValue: volume });

    const onChange = (percent) => {
      // update svg here soon
      this.setState({ volumeValue: percent });
    };

    const onAfterChange = (percent) => {
            // console.log(percent);
      actions('setVolume', percent).then(() =>
                this.setState({ volumeValue: percent }),
                // window.document.querySelector("body").dataset.volume = percent,
                this.VolumeStatus(percent),
                this.setVolumeUpdate(percent)
            );
    };

    return (<SliderVolume
      max={100}
      min={0}
      step={10}
      value={this.state.volumeValue}
      defaultValue={this.state.volumeValue}
      onChange={onChange}
      onAfterChange={onAfterChange}
      vertical
    />);
  }

  render() {
    const { className, triggerClassName, position, trigger, volume } = this.props; // eslint-disable-line

    const volumeClasses = classnames('volume', className, `volume__${position}`, { volume__active: this.state.isVolumeShown });

    const style = { height: '100px' };

    document.addEventListener('click', this.clickOutside, false);

    /* window.onblur = () => {
      this.setState({ isVolumeShown: !1 });
      window.document.querySelector("body").classList.remove(miniplayer.noD);
    } */

    // {this.props.children} use for items not sliding
    return (<div className={volumeClasses}>
      <a href="" onClick={this.toggle} className={triggerClassName}>{trigger}</a>
      <div>
        <div style={style} className={`volume__content ${miniplayer.minilayout} ${miniplayer.flex_center} ${miniplayer.self_center}`}>
          {this.renderVolSlider()}
        </div>
      </div>
    </div>
    );
  }
}

export class VolumeWrapper extends Component { // eslint-disable-line
  static propTypes = {
    children: React.PropTypes.node, // eslint-disable-line
  };

  hideVolume = () => {
    volumeStorage.hide();
  }

  render() {
    // onClick={this.hideVolume} onTouchEnd={this.hideVolume}
    return (
      <div {...this.props}>
        {this.props.children}
      </div>
    );
  }
}


export default MiniplayerVolume;
