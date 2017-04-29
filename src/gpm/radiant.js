import Radiant from 'radiant.js';

const setupRadiant = (ipcInterface) => {

    const radiant = new Radiant(window);
    window.Radiant = radiant;

    ipcInterface.exposeObject({
        key: 'radiant',
        object: radiant,
    });

    // Proxy events over IPC
    ipcInterface.proxyEvents({
        object: radiant,
        throttle: 100,
        events: [
            'change:ad',
            'change:radiant-playback',
            'change:radiant'
        ],
    });
};

export default setupRadiant;