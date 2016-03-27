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

You probably want to run the application in development mode with hot module reloading.  To facilitate this, run the following commands in two different console tabs:

```shell
$ npm run hot
$ npm run start:hot
```

`hot` will start the background build processes and `start:hot` runs the application configured to look for the hot-reloading resources.  There are several more specific options if you need:

Command | Description
------- | -----------
`npm run build:backend` | Build the backend application code
`npm run build:ui` | Build the frontend application UI
`npm run build` | Run both `build:backend` and `build:frontend`
`npm run hot:backend` | Watch for file changes, build the backend application code, and serve hot updates
`npm run hot:server` | Run the hot module reload server
`npm run hot:ui` | Watch for file changes, build the frontend application UI, and serve hot updates
`npm run hot` | Run `hot:backend`, `hot:server`, and `hot:ui` simultaneously
`npm run lint` | Lint the code
`npm run prod:backend` | Build the production backend application code
`npm run prod:ui` | Build the production frontend application UI
`npm run prod` | Run both `prod:backend` and `prod:frontend`
`npm run start` | Start the application in development mode
`npm run start:hot` | Start the application in development mode with hot reloading
`npm run test` | Run tests
`npm run watch:backend` | Watch for file changes and build the backend application code
`npm run watch:ui` | Watch for file changes and build the frontend application UI
`npm run watch` | Run both `watch:backend` and `watch:frontend` simultaneously

## Architecture

* `src/backend` - the main application code and the interface with the native OS
* `src/ui` - the frontend UI code that displays the webview and handles all state and logic
* `src/gpm` - the control module that is injected into the webview to control the player and communicate with the UI
* `src/ipc` - an IPC framework for communicating between the various layers

## License

MIT License - see the included `LICENSE` file.
