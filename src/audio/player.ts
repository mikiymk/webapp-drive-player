import { downloadFile } from "../google-api/file";

/**
 * play audio manager
 */
class AudioPlayer {
  private context = new AudioContext();
  private node: AudioBufferSourceNode;

  private buffer: AudioBuffer | null = null;
  private nextBuffer: AudioBuffer | null = null;
  private loadedNextBuffer: boolean = false;

  private musicIds: string[] = [];
  private index: number = NaN;

  private intervalID = 0;

  loop: "no" | "one" | "all" = "no";
  duration = 0;
  currentTime = 0;
  startAt = 0;
  stopAt = 0;
  isPaused = true;

  onSetDuration = (duration: number) => {};
  onSetCurrentTime = (currentTime: number) => {};
  onSetStartAt = (startAt: number) => {};
  onSetStopAt = (stopAt: number) => {};
  onSetPause = (isPaused: boolean) => {};
  onSetLoop = (loop: "no" | "one" | "all") => {};

  onEnd = () => {};

  constructor() {
    this.node = this.context.createBufferSource();
  }

  async playWithId(id: string) {
    this.stop();

    if (!id) return;
    const audioBuffer = await this.downloadAudio(id);

    this.buffer = audioBuffer;

    this.start();
  }

  private async downloadAudio(id: string) {
    const fileData = await downloadFile(id);
    const dataArray = Array.from(fileData).map(c => c.charCodeAt(0));
    const arrayBuffer = new Uint8Array(dataArray).buffer;
    return await this.context.decodeAudioData(arrayBuffer);
  }

  private loadNextBuffer(id: string) {
    if (!id) return;
    this.loadedNextBuffer = false;
    this.nextBuffer = null;

    this.downloadAudio(id).then(buffer => {
      if (!this.loadedNextBuffer) {
        this.nextBuffer = buffer;
        this.loadedNextBuffer = true;
      }
    });
  }

  private skipToNext() {
    this.stop();
    this.index = this.nextIndex;
    if (this.loadedNextBuffer) {
      this.buffer = this.nextBuffer;
      this.setBuffer();
      this.loadNextBuffer(this.musicIds[this.nextIndex]);
      this.start();
    } else {
      this.playAndLoad();
    }
  }

  async playAndLoad() {
    await this.playWithId(this.musicIds[this.index]);
    this.loadNextBuffer(this.musicIds[this.nextIndex]);
  }

  playWithIdList(ids: string[], index: number) {
    this.musicIds = ids;
    this.index = index;

    this.playAndLoad();
  }

  get nextIndex() {
    if (this.loop === "all") {
      return (this.index + 1) % this.musicIds.length;
    } else {
      return this.index + 1;
    }
  }

  private setBuffer() {
    if (this.buffer === null) {
      return;
    }
    this.node.disconnect();
    this.node = this.context.createBufferSource();
    this.node.buffer = this.buffer;
    this.node.connect(this.context.destination);
    this.setDuration(this.buffer.duration);
    this.setLoop(this.loop);
  }

  setLoop(loop: "no" | "one" | "all") {
    this.node.loop = false;
    this.node.onended = () => {
      console.log("ended", this.currentTime, this.duration);
      if (this.duration - this.currentTime <= 1) {
        ({
          no: () => {
            this.skipToNext();
          },
          one: () => {
            this.stop();
            this.start();
          },
          all: () => {
            this.skipToNext();
          },
        }[loop]());
      }
    };
    this.onSetLoop(loop);
  }

  private setDuration(duration: number) {
    this.duration = duration;
    this.onSetDuration(this.duration);
  }

  private setCurrentTime(currentTime: number) {
    this.currentTime = currentTime;
    this.onSetCurrentTime(this.currentTime);
  }

  private setStartAt(startAt: number) {
    this.startAt = startAt;
    this.onSetStartAt(this.startAt);
  }

  private setStopAt(stopAt: number) {
    this.stopAt = stopAt;
    this.onSetStopAt(this.stopAt);
  }

  private setPause(isPaused: boolean) {
    this.isPaused = isPaused;
    this.onSetPause(this.isPaused);
  }

  private updateTime() {
    if (this.isPaused) {
      this.setCurrentTime(this.stopAt);
    } else {
      this.setCurrentTime(this.context.currentTime - this.startAt);
    }
  }

  private setInterval() {
    if (this.intervalID) {
      throw new Error("interval has already set");
    } else {
      this.intervalID = window.setInterval(() => this.updateTime(), 1000 / 24);
    }
  }

  private unsetInterval() {
    if (!this.intervalID) {
      throw new Error("interval is no set");
    } else {
      window.clearInterval(this.intervalID);
      this.intervalID = 0;
    }
  }

  start() {
    if (this.isPaused) {
      this.setStartAt(this.context.currentTime);
      this.setStopAt(0);
      this.setPause(false);

      this.setInterval();

      this.setBuffer();
      this.node.start(this.context.currentTime, 0);
    }
  }

  stop() {
    if (!this.isPaused) {
      this.setStopAt(0);
      this.setPause(true);

      this.unsetInterval();

      this.node.stop(this.context.currentTime);
    }
  }

  play() {
    if (this.isPaused) {
      this.setStartAt(this.context.currentTime - this.stopAt);
      this.setPause(false);

      this.setInterval();

      this.setBuffer();
      this.node.start(this.context.currentTime, this.stopAt);
    }
  }

  pause() {
    if (!this.isPaused) {
      this.setStopAt((this.context.currentTime - this.startAt) % this.duration);
      this.setPause(true);

      this.unsetInterval();

      this.node.stop(this.context.currentTime);
    }
  }

  seek(time: number) {
    if (this.isPaused) {
      this.setStopAt(time % this.duration);
    } else {
      this.stop();
      this.setStopAt(time % this.duration);
      this.play();
    }
  }
}

const player = new AudioPlayer();

export default player;
