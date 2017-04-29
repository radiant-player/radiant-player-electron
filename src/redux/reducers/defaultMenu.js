const isOSX = process.platform === 'darwin';

const defaultMenu = [
  ...(isOSX ? [{
    label: 'Radiant Player',
    submenu: [
      {
        label: 'About Radiant Player',
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      {
        type: 'separator',
      },
      {
        label: 'Hide Radiant Player',
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: 'quit',
      },
    ],
  }] : []),
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+Shift+R',
        click: 'reload',
      },
      {
        label: 'Toggle Full Screen',
        accelerator: isOSX ? 'Ctrl+Command+F' : 'F11',
        click: 'toggleFullScreen',
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: isOSX ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: 'toggleDevTools',
      },
    ],
  },
  {
    label: 'Controls',
    submenu: [
      {
        redux: 'play-pause',
        label: 'Play/Pause',
        // accelerator: 'Space',
        enabled: false,
        click: 'playPause',
      },
      {
        label: 'Previous',
        accelerator: 'Left',
        click: 'previous',
      },
      {
        label: 'Next',
        accelerator: 'Right',
        click: 'next',
      },
      {
        type: 'separator',
      },
      {
        label: 'Volume Up',
        accelerator: 'Alt+Up',
        click: 'volumeUp',
      },
      {
        label: 'Volume Down',
        accelerator: 'Alt+Down',
        click: 'volumeDown',
      },
      {
        type: 'separator',
      },
      {
        redux: 'thumbs-up',
        label: 'Thumbs Up',
        accelerator: 'CmdOrCtrl+J',
        type: 'checkbox',
        checked: false,
        click: 'thumbsUp',
      },
      {
        redux: 'thumbs-down',
        label: 'Thumbs Down',
        accelerator: 'CmdOrCtrl+K',
        type: 'checkbox',
        checked: false,
        click: 'thumbsDown',
      },
      {
        type: 'separator',
      },
      {
        label: 'Repeat Mode',
        submenu: [
          {
            label: 'Toggle Repeat Mode',
            accelerator: 'CmdOrCtrl+R',
            click: 'toggleRepeatMode',
          },
          {
            type: 'separator',
          },
          {
            redux: 'repeat-all',
            label: 'Repeat All',
            type: 'checkbox',
            checked: false,
            click: 'repeatAll',
          },
          {
            redux: 'repeat-one',
            label: 'Repeat One',
            type: 'checkbox',
            checked: false,
            click: 'repeatOne',
          },
          {
            redux: 'repeat-none',
            label: 'No Repeat',
            type: 'checkbox',
            checked: false,
            click: 'repeatNone',
          },
        ],
      },
      {
        redux: 'shuffle',
        label: 'Toggle Shuffle',
        accelerator: 'CmdOrCtrl+S',
        type: 'checkbox',
        checked: false,
        click: 'toggleShuffle',
      },
      {
        label: 'Toggle Visualization',
        accelerator: 'CmdOrCtrl+T',
        click: 'toggleVisualization',
      },
      {
        type: 'separator',
      },
      {
        label: 'Search',
        accelerator: 'CmdOrCtrl+F',
        click: 'search',
      },
      {
        label: 'Go Back',
        accelerator: 'CmdOrCtrl+[',
        click: 'goBack',
      },
      {
        label: 'Go Forward',
        accelerator: 'CmdOrCtrl+]',
        click: 'goForward',
      },
      {
          type: 'separator',
      },
      {
          label: 'I\'m Feeling Lucky',
          accelerator: 'CmdOrCtrl+L',
          click: 'rollDice',
      },
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      ...(isOSX ? [
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          role: 'front',
        },
      ] : []),
    ],
  },
];

export default defaultMenu;
