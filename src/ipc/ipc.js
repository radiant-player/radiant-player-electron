import EventEmitter from 'events';
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
      name.split('.').forEach(val => (fn = fn[val]));

      try {
        const result = fn(...args);
        send(`ipc:${namespace}:result:${key}:${id}`, result);
      } catch (err) {
        send(`ipc:${namespace}:error:${key}:${id}`, e);
      }
    });
  },

  proxyEvents({ object, events }) {
    events.forEach(event => {
      object.on(event, (...args) => {
        send(`ipc:${namespace}:event:${event}`, ...args);
      });
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

  emitter.attach = newElement => {
    element = newElement;
    element.addEventListener('ipc-message', (event) => {
      const { channel, args } = event;
      emitter.emit(channel, event, ...args);
    });
  };

  if (originalElement) emitter.attach(originalElement);

  emitter.send = (...args) => {
    if (!element) return null;
    return element.send(...args);
  };

  return emitter;
};
