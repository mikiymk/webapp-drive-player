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

  loop: "no" | "one" | "all" = "one";
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

  onEnd = () => {};

  constructor() {
    this.node = this.context.createBufferSource();
  }

  async playWithId(id: string) {
    this.stop();

    if (!id) return;
    const audioBuffer = await this.downloadAudio(id);

    this.setDuration(audioBuffer.duration);
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
      this.nextBuffer = buffer;
      this.loadedNextBuffer = true;
    });
  }

  playWithIdList(ids: string[], index: number) {
    this.musicIds = ids;
    this.index = index;

    this.playWithId(this.musicIds[this.index]).then(() =>
      this.loadNextBuffer(this.musicIds[this.index + 1])
    );
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
  }

  setLoop(loop: "no" | "one" | "all") {
    if (loop === "one") {
      this.node.loop = true;
      this.node.onended = null;
    } else {
      this.node.loop = false;
      this.node.onended = () => {};
    }
  }

  private setDuration(duration: number) {
    this.duration = duration;
    this.onSetDuration(this.duration);
  }

  private setCurrentTime(currentTime: number) {
    this.currentTime = currentTime % this.duration;
    this.onSetCurrentTime(this.currentTime);
  }

  private setStartAt(startAt: number) {
    this.startAt = startAt % this.duration;
    this.onSetStartAt(this.startAt);
  }

  private setStopAt(stopAt: number) {
    this.stopAt = stopAt % this.duration;
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
      this.setStopAt(this.context.currentTime - this.startAt);
      this.setPause(true);

      this.unsetInterval();

      this.node.stop(this.context.currentTime);
    }
  }

  seek(time: number) {
    if (this.isPaused) {
      this.setStopAt(time);
    } else {
      this.stop();
      this.setStopAt(time);
      this.play();
    }
  }
}

const player = new AudioPlayer();

export default player;
