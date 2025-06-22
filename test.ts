import * as assert from 'assert';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import TwilioMediaStreamSaveAudioFile from './dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to wait for a file to be created
function waitForFile(filePath: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (fs.existsSync(filePath)) {
        resolve(true);
      } else if (Date.now() - start > timeout) {
        resolve(false);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

describe('TwilioMediaStreamSaveAudioFile', function() {
  // Increase timeout since file operations might take time
  this.timeout(30000);
  
  const outputFilename = "test-output";
  const outputPath = path.join(__dirname, `${outputFilename}.wav`);

  // Clean up before and after tests
  before(async () => {
    try {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    } catch (error) {
      console.error('Error cleaning up before test:', error);
    }
  });

  // after(async () => {
  //   try {
  //     if (fs.existsSync(outputPath)) {
  //       fs.unlinkSync(outputPath);
  //     }
  //   } catch (error) {
  //     console.error('Error cleaning up after test:', error);
  //   }
  // });

  it('should save a twilio media stream to a local audio file in wav format', async function() {
    const testFile = path.join(__dirname, 'fixtures', 'hello-world.txt');
    const fileStream = fs.createReadStream(testFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let saveComplete = false;
    let saveError: Error | null = null;

    const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
      saveLocation: __dirname,
      saveFilename: outputFilename,
      onSaved: () => {
        saveComplete = true;
        console.log('File save completed');
      },
    });

    // Process the file line by line
    for await (const line of rl) {
      try {
        const msg = JSON.parse(line);
        switch (msg.event) {
          case 'connected':
            console.log('A new call has connected');
            break;
          case 'start':
            console.log('Starting media stream...');
            mediaStreamSaver.twilioStreamStart();
            break;
          case 'media':
            console.log('Receiving audio...');
            mediaStreamSaver.twilioStreamMedia(msg.media.payload);
            break;
          case 'stop':
            console.log('Call has ended');
            mediaStreamSaver.twilioStreamStop();
            break;
          default:
            break;
        }
      } catch (error) {
        saveError = error as Error;
        break;
      }
    }

    // Wait for the file to be saved
    const fileExists = await waitForFile(outputPath);
    
    // Verify the results
    if (saveError) {
      throw saveError;
    }

    assert.ok(fileExists, 'Output file was not created');
    
    if (fileExists) {
      const stats = fs.statSync(outputPath);
      console.log(`File size: ${stats.size} bytes`);
      assert.ok(stats.size > 0, 'Output file is empty');
    }
  });
});
