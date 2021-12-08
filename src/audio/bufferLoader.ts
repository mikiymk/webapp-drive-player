import { downloadFile } from "google-api/file";
import AudioInfo from "./audioInfo";

class BufferLoader {
  buffer: AudioBuffer | null = null;
  info = new AudioInfo();

  private context: AudioContext;

  private loadedID = "";
  private willLoadID = "";

  constructor(context: AudioContext) {
    this.context = context;
  }

  /**
   * download music data from google drive
   * @param id music file id
   * @returns audio data or null if error
   */
  async load(id: string): Promise<AudioBuffer | null> {
    this.willLoadID = id;
    if (this.isLoaded) {
      return this.buffer;
    }
    this.buffer = null;

    if (id === "") {
      return null;
    }

    try {
      const fileData = await downloadFile(id);

      if (fileData === null) {
        return null;
      }

      const arrayBuffer = await fileData.arrayBuffer();
      const arrayBufferCopy = arrayBuffer.slice(0);
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      if (this.willLoadID === id) {
        this.info.close();

        this.loadedID = id;
        this.buffer = audioBuffer;
        this.info = await AudioInfo.getInfo(arrayBufferCopy);
        return this.buffer;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  copyFrom(other: BufferLoader) {
    this.info.close();

    this.willLoadID = other.willLoadID;
    this.buffer = other.buffer;
    this.info = other.info;
    this.loadedID = other.loadedID;
  }

  get isLoaded() {
    return this.loadedID === this.willLoadID;
  }
}

export default BufferLoader;
