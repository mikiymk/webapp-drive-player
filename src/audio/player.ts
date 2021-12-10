import { readTagFromData } from "tag/index";
import { downloadFile } from "google-api/file";
import Repeat from "audio/repeat";
import ShuffleArray from "audio/shuffleArray";
import { File } from "file";
import BufferLoader from "./bufferLoader";
import AudioInfo from "./audioInfo";

/**
 * play audio manager
 */
class AudioPlayer {
  private context = new AudioContext();
  private node: AudioBufferSourceNode;

  private readonly buffer = new BufferLoader(this.context);
  private readonly nextBuffer = new BufferLoader(this.context);

  /** play music file list */
  musicIds: ShuffleArray<File> = new ShuffleArray([], false);

  /** play music ids index */
  private index = NaN;

  /** set and clear interval id */
  private intervalID = 0;

  repeat: Repeat = new Repeat();
  duration = 0;
  currentTime = 0;
  startAt = 0;
  isPaused = true;

  onSetDuration: (duration: number) => void = () => {
    // empty
  };

  onSetCurrentTime: (currentTime: number) => void = () => {
    // empty
  };

  onSetPause: (isPaused: boolean) => void = () => {
    // empty
  };

  onSetRepeat: (repeat: Repeat) => void = () => {
    // change repeat
  };

  onSetShuffle: (shuffle: boolean) => void = () => {
    // empty
  };

  onSetInfo: (info: AudioInfo) => void = () => {
    // empty
  };

  constructor() {
    this.node = this.context.createBufferSource();
  }

  /**
   * play music with id.
   *
   * music download with id and play
   * if plays, stop
   * @param id music id
   */
  async playWithId(id: string) {
    this.stop();
    await this.buffer.load(id);
    this.start();
  }

  /**
   * load audio buffer and set to next buffer
   * @param id music id
   */
  private loadNextBuffer(id: string) {
    this.nextBuffer.load(id);
  }

  /**
   * play to next music play start
   *
   * if next buffer loaded, set to buffer.
   * not loaded, load and play.
   * and, load next buffer.
   */
  skipToNext() {
    this.stop();
    this.index = this.nextIndex;
    if (this.nextBuffer.isLoaded) {
      this.buffer.copyFrom(this.nextBuffer);
      this.setBuffer();
      this.loadNextBuffer(this.musicIds.get(this.nextIndex).id);
      this.start();
    } else {
      this.playAndLoad();
    }
  }

  /**
   * start to play previous music
   */
  playPrev() {
    this.stop();
    this.index = this.index - 1;
    if (this.index === -1) {
      this.index = this.musicIds.length - 1;
    }
    this.playAndLoad();
  }

  /**
   * play now music, and load next music
   *
   * id by music id list and index
   */
  async playAndLoad() {
    await this.playWithId(this.musicIds.get(this.index).id);
    this.loadNextBuffer(this.musicIds.get(this.nextIndex).id);
  }

  /**
   * play music
   *
   * set music list and index, and play music
   * @param ids music id list
   * @param index start index
   */
  playWithIdList(ids: File[], index: number) {
    this.musicIds = new ShuffleArray(ids, false);
    this.index = index;

    this.playAndLoad();
  }

  /** next index. if repeat "repeat on", last to first */
  get nextIndex() {
    if (this.repeat.value === "repeat on") {
      return (this.index + 1) % this.musicIds.length;
    } else {
      return this.index + 1;
    }
  }

  /**
   * buffer source node recreate and set node
   */
  private setBuffer() {
    this.node.disconnect();
    this.node = this.context.createBufferSource();

    if (this.buffer.buffer === null) {
      return;
    }

    this.node.buffer = this.buffer.buffer;
    this.node.connect(this.context.destination);
    this.setDuration(this.buffer.buffer.duration);
    this.setRepeat(this.repeat);
    this.setInfo(this.buffer.info);
  }

  setInfo(info: AudioInfo) {
    this.onSetInfo(info);

    console.log(info);
  }

  /**
   * set repeat and on end
   * @param repeat new repeat
   */
  setRepeat(repeat: Repeat) {
    this.repeat = repeat.copy();
    this.node.loop = false;
    this.node.onended = () => {
      console.log("ended", this.currentTime, this.duration);
      if (this.duration - this.currentTime <= 1) {
        switch (this.repeat.value) {
          case "repeat off":
          case "repeat on":
            this.skipToNext();
            break;
          case "repeat one":
            this.stop();
            this.start();
            break;
        }
      }
    };
    this.onSetRepeat(repeat);
  }

  setShuffle(shuffle: boolean) {
    this.musicIds.shuffle = shuffle;
    this.onSetShuffle(shuffle);
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
  }

  private setPause(isPaused: boolean) {
    this.isPaused = isPaused;
    this.onSetPause(this.isPaused);
  }

  /**
   * time has passed.
   */
  private updateTime() {
    if (!this.isPaused) {
      this.setCurrentTime(this.context.currentTime - this.startAt);
    }
  }

  /**
   * time passes, update time every second
   */
  private setInterval() {
    if (this.intervalID) {
      throw new Error("interval has already set");
    } else {
      this.intervalID = window.setInterval(() => this.updateTime(), 1000 / 24);
    }
  }

  /**
   * on paused, not update
   */
  private unsetInterval() {
    if (!this.intervalID) {
      throw new Error("interval is no set");
    } else {
      window.clearInterval(this.intervalID);
      this.intervalID = 0;
    }
  }

  /** play start at begin */
  start() {
    if (!this.isPaused) return;

    this.setStartAt(this.context.currentTime);
    this.setPause(false);

    this.setInterval();

    this.setBuffer();
    if (this.node.buffer === null) return;

    this.node.start(this.context.currentTime, 0);
  }

  /** play stop and jump to begin */
  stop() {
    if (this.isPaused) return;

    this.setPause(true);

    this.unsetInterval();

    this.node.stop(this.context.currentTime);
  }

  /** play start at pause time */
  play() {
    if (!this.isPaused) return;

    this.setStartAt(this.context.currentTime - this.currentTime);
    this.setPause(false);

    this.setInterval();

    this.setBuffer();
    if (this.node.buffer === null) return;

    this.node.start(this.context.currentTime, this.currentTime);
  }

  /** play stop and save pause time */
  pause() {
    if (this.isPaused) return;

    this.setCurrentTime(
      (this.context.currentTime - this.startAt) % this.duration
    );
    this.setPause(true);

    this.unsetInterval();

    this.node.stop(this.context.currentTime);
  }

  /** jump time */
  seek(time: number) {
    if (this.isPaused) {
      this.setCurrentTime(time % this.duration);
    } else {
      this.stop();
      this.setCurrentTime(time % this.duration);
      this.play();
    }
  }
}

export default AudioPlayer;
