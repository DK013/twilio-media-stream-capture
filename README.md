<h1 align="center">
  <img src="https://cdn.iconscout.com/icon/free/png-256/twilio-1-285957.png" width="100" alt="Twilio Logo" />
  <br>
  Twilio Media Stream Save Audio File<br>
  <small>Save Twilio Media Streams as WAV files in Node.js</small>
</h1>

[![NPM](https://nodei.co/npm/twilio-media-stream-save-audio-file.png)](https://npmjs.org/package/twilio-media-stream-save-audio-file)

<p>
  <img alt="Node.js CI" src="https://github.com/jremi/twilio-media-stream-save-audio-file/workflows/Node.js%20CI/badge.svg?branch=main">
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.4-blue.svg?cacheSeconds=2592000" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-%3E%3D4.0.0-blue.svg" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-%3E%3D14.0.0-green.svg" />
  <a href="#" target="_blank">
    <img alt="License: UNLICENSED" src="https://img.shields.io/badge/License-UNLICENSED-yellow.svg" />
  </a>
</p>

> A TypeScript/JavaScript library for saving Twilio Media Streams to WAV files in Node.js

This library provides a simple way to save Twilio media streams to local WAV files. It's written in TypeScript with full type definitions and works with both JavaScript and TypeScript projects.

## Features

- 🎙️ Save Twilio Media Streams to WAV files
- 🚀 Written in TypeScript with full type definitions
- ⚡ Works with both JavaScript and TypeScript projects
- 📦 Zero dependencies (only Node.js built-in modules)
- ✅ Well-tested with Mocha
- 🔄 Supports both CommonJS and ES Modules

## Installation

```bash
npm install twilio-media-stream-save-audio-file
```

## Usage

### TypeScript / ES Modules

```typescript
import TwilioMediaStreamSaveAudioFile from 'twilio-media-stream-save-audio-file';

const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
  saveLocation: __dirname,
  saveFilename: 'my-twilio-media-stream-output',
  onSaved: () => console.log('File was saved!'),
});

// Handle WebSocket messages from Twilio
wss.on('connection', (ws) => {
  console.log('New connection initiated!');

  ws.on('message', (message) => {
    const msg = JSON.parse(message.toString());
    switch (msg.event) {
      case 'connected':
        console.log('A new call has connected');
        break;
      case 'start':
        console.log('Starting media stream...');
        mediaStreamSaver.twilioStreamStart();
        break;
      case 'media':
        mediaStreamSaver.twilioStreamMedia(msg.media.payload);
        break;
      case 'stop':
        console.log('Call has ended');
        mediaStreamSaver.twilioStreamStop();
        break;
    }
  });
});
```

### JavaScript (CommonJS)

```javascript
const TwilioMediaStreamSaveAudioFile = require('twilio-media-stream-save-audio-file');

const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
  saveLocation: __dirname,
  saveFilename: 'my-twilio-media-stream-output',
  onSaved: () => console.log('File was saved!'),
});

// ... rest of the code is the same as TypeScript example
```

## API Reference

### `new TwilioMediaStreamSaveAudioFile(options)`

Creates a new instance of the media stream saver.

**Options:**

- `saveLocation` (string): Directory where the audio file will be saved
- `saveFilename` (string): Base filename (without extension) for the output file
- `onSaved` (function, optional): Callback function that's called when the file is saved

### Methods

#### `twilioStreamStart()`

Initializes the file stream and writes the WAV header. Call this when you receive the 'start' event from Twilio.

#### `twilioStreamMedia(payload: string)`

Writes media payload to the file. Call this when you receive the 'media' event from Twilio.

#### `twilioStreamStop()`

Finalizes the WAV file and closes the file stream. Call this when you receive the 'stop' event from Twilio.

## Development

### Prerequisites

- Node.js 14+
- npm or yarn

### Building

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Testing

```bash
# Run tests
npm test
```

### Linting

```bash
# Run linter
npm run lint
```

## License

This project is [UNLICENSED](UNLICENSED).

## Acknowledgments

- Inspired by [@tdeo's StackOverflow answer](https://stackoverflow.com/a/58439317/123033) about saving μ-law audio streams from Twilio
        console.log(`Starting media stream...`);
        mediaStreamSaver.twilioStreamStart();
        break;
      case "media":
        console.log("Receiving audio...");
        mediaStreamSaver.twilioStreamMedia(msg.media.payload);
        break;
      case "stop":
        console.log("Call has ended");
        mediaStreamSaver.twilioStreamStop();
        break;
      default:
        break;
    }
  });
});

```

## Options

When you instantiate the library you can pass in the following options. They are not required and all optional.

- `saveLocation` - **(Optional)** Defaults to the local dir using `__dirname`. You can set any path you wish. Make sure path exists.

- `saveFilename` - **(Optional)** Defaults to the current date timestamp using `Date.now()`. You can set any filename you wish.

- `onSaved` - **(Optional)** This is a optional callback function that you can provide if you want to be notified when the audio wav file has been saved.

## Notes

- Inside the connected websocket `message` event make sure to call each of the corresponding methods for the incoming Twilio Media Stream message events: 

  ### Twilio Media Stream Message Event: `start` 
  - ` mediaStreamSaver.twilioStreamStart()`

  ### Twilio Media Stream Message Event: `media`
  - `mediaStreamSaver.twilioStreamMedia(twilioMediaPayload)`

  ### Twilio Media Stream Message Event: `stop`
  - `mediaStreamSaver.twilioStreamStop()`

For getting started on how Twilio media streams work, check out [Twilio](https://www.twilio.com/media-streams).

## Author

👤 **Jremi <jremi@jzbg.dev>**

* Website: http://stackoverflow.com/users/1062503/jremi
* Github: [@jremi](https://github.com/jremi)

***
_Made with ❤️ in San Diego_
