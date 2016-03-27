import EventEmitter from 'events';
import uuid from 'node-uuid';

export const connectToIPC = ({ namespace, ipc, send }) => ({
  call(name, ...args) {
    return new Promise((resolve, reject) => {
      const id = uuid.v4();

      ipc.once(`ipc:${namespace}:result:${id}`, (e, ...resultArgs) => resolve(...resultArgs));
      ipc.once(`ipc:${namespace}:error:${id}`, (e, ...errorArgs) => reject(...errorArgs));

      send(`ipc:${namespace}:call`, {
        id,
        name,
        args,
      });
    });
  },

  on(event, cb) {
    return ipc.on(`ipc:${namespace}:event:${event}`, cb);
  },

  once(event, cb) {
    return ipc.once(`ipc:${namespace}:event:${event}`, cb);
  },
});

export const proxyToObject = ({ ipc, send, namespace, object }) => {
  ipc.on(`ipc:${namespace}:call`, (e, signature) => {
    const { id, name, args } = signature;

    let fn = object;
    name.split('.').forEach(key => fn = fn[key]);

    try {
      const result = fn(...args);
      send(`ipc:${namespace}:result:${id}`, result);
    } catch (err) {
      send(`ipc:${namespace}:error:${id}`, e);
    }
  });
};

export const proxyEvents = ({ send, namespace, object, events }) => {
  console.log('called with', send, namespace, object, events);
  events.forEach(event => {
    object.on(event, (...args) => {
      console.log('sending', event, args);
      send(`ipc:${namespace}:event:${event}`, ...args);
    });
  });
};

// Returns a DOM object as an IPC interface
export const domIPCBridge = originalElement => {
  const emitter = new EventEmitter();
  let element = null;

  emitter.attach = newElement => {
    element = newElement;
    element.addEventListener('ipc-message', (event) => {
      console.log('received dom', event);
      const { channel, args } = event;
      emitter.emit(channel, event, ...args);
    });
  };

  if (originalElement) emitter.attach(originalElement);

  emitter.send = (...args) => {
    if (!element) return null;
    element.send(...args);
  };

  return emitter;
};
