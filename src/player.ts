export class AudioPlayer {
  private readonly context: AudioContext;
  private node: AudioBufferSourceNode;

  private intervalID = 0;

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

  constructor(context: AudioContext) {
    this.context = context;
    this.node = this.context.createBufferSource();
  }

  setBuffer(buffer: AudioBuffer) {
    this.setDuration(buffer.duration);
    this.node = this.context.createBufferSource();
    this.node.buffer = buffer;
    this.node.connect(this.context.destination);
  }

  private setDuration(duration: number) {
    this.duration = duration;
    this.onSetDuration(duration);
  }

  private setCurrentTime(currentTime: number) {
    this.currentTime = currentTime;
    this.onSetCurrentTime(currentTime);
  }

  private setStartAt(startAt: number) {
    this.startAt = startAt;
    this.onSetStartAt(startAt);
  }

  private setStopAt(stopAt: number) {
    this.stopAt = stopAt;
    this.onSetStopAt(stopAt);
  }

  private setPause(isPaused: boolean) {
    this.isPaused = isPaused;
    this.onSetPause(isPaused);
  }

  private updateTime() {
    if (this.isPaused) {
      this.setCurrentTime(this.stopAt);
    } else {
      this.setCurrentTime(this.context.currentTime - this.startAt);
    }
  }

  start() {
    if (this.isPaused) {
      this.setStartAt(this.currentTime);
      this.setStopAt(0);
      this.setPause(false);

      this.intervalID = window.setInterval(() => this.updateTime(), 250);

      this.node.start(this.context.currentTime, 0);
    }
  }

  stop() {
    if (!this.isPaused) {
      this.setStopAt(0);
      this.setPause(true);

      window.clearInterval(this.intervalID);

      this.node.stop(this.context.currentTime);
    }
  }

  play() {
    if (this.isPaused) {
      this.setStartAt(this.context.currentTime - this.stopAt);
      this.setPause(false);

      this.intervalID = window.setInterval(() => this.updateTime(), 250);

      this.node.start(this.context.currentTime, this.stopAt);
    }
  }

  pause() {
    if (!this.isPaused) {
      this.setStopAt(this.context.currentTime - this.startAt);
      this.setPause(true);

      window.clearInterval(this.intervalID);

      this.node.stop(this.context.currentTime);
    }
  }

  seek(time: number) {
    if (this.isPaused) {
      this.setStopAt(time);
    } else {
      this.node.stop();
      this.node.start(this.context.currentTime, time);
    }
  }
}
