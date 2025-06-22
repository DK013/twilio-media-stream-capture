import { openSync, writeSync, createWriteStream } from 'fs';
import type { WriteStream } from 'fs';

export interface TwilioMediaStreamOptions {
  saveLocation?: string;
  saveFilename?: string | number;
  onSaved?: () => void;
}

export class TwilioMediaStreamSaveAudioFile {
  private saveLocation: string;
  private saveFilename: string | number;
  private onSaved: (() => void) | null;
  private wstream: WriteStream | null = null;
  private websocket: any = null;

  constructor(options: TwilioMediaStreamOptions) {
    this.saveLocation = options.saveLocation || __dirname;
    this.saveFilename = options.saveFilename || Date.now();
    this.onSaved = options.onSaved || null;
  }

  private get filename(): string {
    return `${this.saveFilename}.wav`;
  }

  private get writeStreamPath(): string {
    return `${this.saveLocation}/${this.filename}`;
  }

  public twilioStreamStart(): void {
    this.wstream = createWriteStream(this.writeStreamPath, {
      encoding: 'binary' as BufferEncoding,
    });
    
    // This is a mu-law header for a WAV-file compatible with twilio format
    this.wstream.write(
      Buffer.from([
        0x52, 0x49, 0x46, 0x46, 0x62, 0xb8, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
        0x66, 0x6d, 0x74, 0x20, 0x12, 0x00, 0x00, 0x00, 0x07, 0x00, 0x01, 0x00,
        0x40, 0x1f, 0x00, 0x00, 0x80, 0x3e, 0x00, 0x00, 0x02, 0x00, 0x04, 0x00,
        0x00, 0x00, 0x66, 0x61, 0x63, 0x74, 0x04, 0x00, 0x00, 0x00, 0xc5, 0x5b,
        0x00, 0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0x00, 0x00, 0x00, // Those last 4 bytes are the data length
      ])
    );
  }

  /**
   * @deprecated
   */
  public setWebsocket(websocket: any): void {
    this.websocket = websocket;
  }

  public twilioStreamMedia(mediaPayload: string): void {
    if (!this.wstream) {
      throw new Error('Stream not started. Call twilioStreamStart() first.');
    }
    // decode the base64-encoded data and write to stream
    this.wstream.write(Buffer.from(mediaPayload, 'base64'));
  }

  public twilioStreamStop(): void {
    if (!this.wstream) {
      throw new Error('Stream not started. Call twilioStreamStart() first.');
    }

    // Now the only thing missing is to write the number of data bytes in the header
    this.wstream.write('', () => {
      if (!this.wstream) return;
      
      const fd = openSync(this.wstream.path, 'r+'); // `r+` mode is needed to write to arbitrary position
      const count = this.wstream.bytesWritten;
      const dataLength = count - 58; // The header itself is 58 bytes long
      
      writeSync(
        fd,
        Buffer.from([
          dataLength % 256,
          (dataLength >> 8) % 256,
          (dataLength >> 16) % 256,
          (dataLength >> 24) % 256,
        ]),
        0, // offset
        4, // length: Write 4 bytes
        54 // position: starts writing at byte 54 in the file
      );
      
      if (this.onSaved) {
        this.onSaved();
      }
    });
  }
}

export { TwilioMediaStreamSaveAudioFile as default };
