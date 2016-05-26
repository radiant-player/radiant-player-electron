# Radiant Player - Electron Edition

**NOTE:** this is an experimental player, and most all features are not implemented.  You are welcome to hack away, but if you want a functional player, you probably want [Radiant Player for Mac][1].

No affiliation with Google. Google Play is a trademark of Google Inc.

[1]: http://kbhomes.github.io/radiant-player-mac/

## Development

### Install

Install dependencies.

```
$ npm install
```

### Run

You probably want to run the application in development mode with file reloading.  To facilitate this, run the following commands in two different console tabs:

```shell
$ npm run watch
$ npm run start
```

Other `npm` scripts include:

Command | Description
------- | -----------
`npm run build` | Builds the application for development
`npm run build:dist` | Builds the application for distribution
`npm run clean` | Removes built assets and packages
`npm run dist:all` | Builds the application for distribution to all platforms
`npm run dist:osx` | Builds the application for distribution to OS X
`npm run start` | Starts the application that was built using `build` or `build:dist`
`npm run test` | Runs application tests
`npm run watch` | Watches for file changes and rebuilds the app for development

## Architecture

* `src/backend` - the main application code and the interface with the native OS
* `src/app` - the frontend UI code that displays the webview and handles all state and logic
* `src/gpm` - the control module that is injected into the webview to control the player and communicate with the UI
* `src/ipc` - an IPC framework for communicating between the various layers

## License

MIT License - see the included `LICENSE` file.
