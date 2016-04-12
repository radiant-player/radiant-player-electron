import EventEmitter from 'events';
import lodashThrottle from 'lodash.throttle';
import uuid from 'node-uuid';

export const connectToIPC = ({ namespace, ipc, send }) => ({
  remoteObject(key) {
    return (name, ...args) => (
      new Promise((resolve, reject) => {
        const id = uuid.v4();

        ipc.once(`ipc:${namespace}:result:${key}:${id}`, (e, ...resultArgs) => (
          resolve(...resultArgs)
        ));

        ipc.once(`ipc:${namespace}:error:${key}:${id}`, (e, ...errorArgs) => (
          reject(...errorArgs)
        ));

        send(`ipc:${namespace}:call:${key}`, {
          id,
          name,
          args,
        });
      })
    );
  },

  exposeObject({ key, object }) {
    ipc.on(`ipc:${namespace}:call:${key}`, (e, signature) => {
      const { id, name, args } = signature;

      let fn = object;
      const keys = name.split('.');
      const lastKey = keys[keys.length - 1];
      keys.slice(0, -1).forEach(val => (fn = fn[val]));

      try {
        const result = fn[lastKey].call(fn, ...args);
        send(`ipc:${namespace}:result:${key}:${id}`, result);
      } catch (err) {
        send(`ipc:${namespace}:error:${key}:${id}`, err);
      }
    });
  },

  proxyEvents({ object, events, throttle }) {
    events.forEach(event => {
      const handler = (...args) => {
        send(`ipc:${namespace}:event:${event}`, ...args);
      };

      if (throttle) {
        object.on(event, lodashThrottle(handler, throttle));
      } else {
        object.on(event, handler);
      }
    });
  },

  emit(event, ...args) {
    send(`ipc:${namespace}:event:${event}`, ...args);
  },

  on(event, cb) {
    return ipc.on(`ipc:${namespace}:event:${event}`, cb);
  },

  once(event, cb) {
    return ipc.once(`ipc:${namespace}:event:${event}`, cb);
  },
});

// Returns a DOM object as an IPC interface
export const domIPCBridge = originalElement => {
  const emitter = new EventEmitter();
  let element = null;
  const listener = event => {
    const { channel, args } = event;
    emitter.emit(channel, event, ...args);
  };

  emitter.attach = newElement => {
    if (element) element.removeEventListener('ipc-message', listener);
    element = newElement;
    element.addEventListener('ipc-message', listener);
  };

  if (originalElement) emitter.attach(originalElement);

  emitter.send = (...args) => {
    if (!element) return null;
    return element.send(...args);
  };

  return emitter;
};
