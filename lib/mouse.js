import EventEmitter from 'events';
import { Mouse } from '../build/Release/addon.node';

// TODO: build a cross-platform version of this

export default () => {
  const that = new EventEmitter();
  let mouse = null;

  that.once('newListener', () => {
    mouse = new Mouse((type, x, y) => {
      that.emit(type, x, y);
    });
  });

  that.ref = () => {
    if (mouse) mouse.ref();
  };

  that.unref = () => {
    if (mouse) mouse.unref();
  };

  that.destroy = () => {
    if (mouse) mouse.destroy();
    mouse = null;
  };

  return that;
};
