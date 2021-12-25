import { File } from "file";

import Repeat from "./repeat";
import ShuffleArray from "./shuffleArray";
import BufferLoader from "./bufferLoader";
import AudioInfo from "./audioInfo";

/**
 * play audio manager
 */
class AudioPlayer {
  private audio = new Audio();

  private readonly buffer = new BufferLoader();
  private readonly nextBuffer = new BufferLoader();

  /** play music file list */
  musicIds: ShuffleArray<File> = new ShuffleArray([], false);

  /** play music ids index */
  private index = NaN;

  repeat: Repeat = Repeat.get();
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
    this.audio.addEventListener("ended", () => this.onEnd());
    this.audio.addEventListener("timeupdate", () => this.updateTime());
    this.audio.addEventListener("durationchange", () => this.updateDuration());
  }
  /**
   * play music with id.
   *
   * music download with id and play
   * if plays, stop
   * @param id music id
   */
  private async loadBuffer() {
    return await this.buffer.load(this.musicIds.get(this.index).id);
  }

  /**
   * load audio buffer and set to next buffer
   * @param id music id
   */
  private async loadNextBuffer() {
    return await this.nextBuffer.load(this.musicIds.get(this.nextIndex).id);
  }

  /**
   * play to next music play start
   *
   * if next buffer loaded, set to buffer.
   * not loaded, load and play.
   * and, load next buffer.
   */
  playToNext() {
    this.stop();
    this.index = this.nextIndex;
    if (this.nextBuffer.isLoaded) {
      this.buffer.copyFrom(this.nextBuffer);
      this.setBuffer();
      this.loadNextBuffer();
      this.start();
    } else {
      this.playAndLoad();
    }
  }

  /**
   * start to play previous music
   */
  playToPrev() {
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
    this.stop();
    await this.loadBuffer();
    this.loadNextBuffer();
    this.start();
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
    if (this.buffer.url === "") {
      return;
    }

    if (this.buffer.url === this.audio.src) {
      return;
    }

    this.audio.src = this.buffer.url;
    this.audio.load();
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
    this.repeat = repeat;
    this.audio.loop = repeat.value === "repeat one";
    this.onSetRepeat(repeat);
    this.loadNextBuffer();
  }

  setShuffle(shuffle: boolean) {
    this.musicIds.shuffle = shuffle;
    this.onSetShuffle(shuffle);
    this.loadNextBuffer();
  }

  private setCurrentTime(currentTime: number) {
    this.audio.currentTime = currentTime;
    this.onSetCurrentTime(this.audio.currentTime);
  }

  private setPause(isPaused: boolean) {
    this.isPaused = isPaused;
    this.onSetPause(this.isPaused);
  }

  /**
   * time has passed.
   */
  private updateTime() {
    this.onSetCurrentTime(this.audio.currentTime);
  }

  private updateDuration() {
    this.onSetDuration(this.audio.duration);
  }

  private onEnd() {
    switch (this.repeat.value) {
      case "repeat off":
      case "repeat on":
        this.playToNext();
        break;
      case "repeat one":
        break;
    }
  }

  /** play start at begin */
  start() {
    if (!this.isPaused) return;
    this.setCurrentTime(0);
    this.play();
  }

  /** play stop and jump to begin */
  stop() {
    if (this.isPaused) return;
    this.pause();
    this.setCurrentTime(0);
  }

  /** play start at pause time */
  play() {
    if (!this.isPaused) return;
    this.setPause(false);

    this.setBuffer();
    if (this.audio.src === "") return;

    this.audio.play();
  }

  /** play stop and save pause time */
  pause() {
    if (this.isPaused) return;
    this.setPause(true);
    this.audio.pause();
  }

  /** jump time */
  seek(time: number) {
    if (this.isPaused) {
      this.setCurrentTime(time);
    } else {
      this.pause();
      this.setCurrentTime(time);
      this.play();
    }
  }
}

export default AudioPlayer;
