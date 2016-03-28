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
        label: 'Undo!',
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
        accelerator: 'Space',
        enabled: false,
      },
      {
        label: 'Previous',
        accelerator: 'Left',
      },
      {
        label: 'Next',
        accelerator: 'Right',
      },
      {
        type: 'separator',
      },
      {
        label: 'Volume Up',
        accelerator: 'Alt+Up',
      },
      {
        label: 'Volume Down',
        accelerator: 'Alt+Down',
      },
      {
        type: 'separator',
      },
      {
        label: 'Thumbs Up',
        accelerator: 'CmdOrCtrl+J',
      },
      {
        label: 'Thumbs Down',
        accelerator: 'CmdOrCtrl+K',
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
          },
          {
            type: 'separator',
          },
          {
            label: 'Repeat All',
          },
          {
            label: 'Repeat One',
          },
          {
            label: 'No Repeat',
          },
        ],
      },
      {
        label: 'Toggle Shuffle',
        accelerator: 'CmdOrCtrl+S',
      },
      {
        label: 'Toggle Visualization',
        accelerator: 'CmdOrCtrl+T',
      },
      {
        type: 'separator',
      },
      {
        label: 'Search',
        accelerator: 'CmdOrCtrl+F',
      },
      {
        label: 'Go Back',
        accelerator: 'CmdOrCtrl+[',
      },
      {
        label: 'Go Forward',
        accelerator: 'CmdOrCtrl+]',
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
