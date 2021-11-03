import { readTagFromData } from "../tag/index";
import { downloadFile } from "../google-api/file";

/**
 * play audio manager
 */
class AudioPlayer {
  /** audio context and source node */
  private context = new AudioContext();
  private node: AudioBufferSourceNode;

  /** audio buffer playing */
  private buffer: AudioBuffer | null = null;

  /**
   * audio buffer next playing.
   * null if will load and not loaded.
   */
  private nextBuffer: AudioBuffer | null = null;
  private loadedNextBuffer: boolean = false;

  /** play music ids list */
  private musicIds: string[] = [];

  /** play music ids index */
  private index: number = NaN;

  /** set and clear interval id */
  private intervalID = 0;

  /**
   * loop
   * - "no" not loop, play through all musics in list once and stop on end.
   * - "one" loop only one music plays.
   * - "all" loop all musics, all music plays and start play first on end.
   */
  loop: "no" | "one" | "all" = "no";

  /** play music duration second */
  duration = 0;

  /** play music current play time second */
  currentTime = 0;

  /** play music start at time second */
  startAt = 0;

  /** play music stop at second */
  stopAt = 0;

  /** play music paused */
  isPaused = true;

  /** called on duration change with new duration */
  onSetDuration = (duration: number) => {};

  /** called on current time change with new current time */
  onSetCurrentTime = (currentTime: number) => {};

  /** called on pause change with new pause state */
  onSetPause = (isPaused: boolean) => {};

  /** called on loop change with new loop state */
  onSetLoop = (loop: "no" | "one" | "all") => {};

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

    if (!id) return;
    const audioBuffer = await this.downloadAudio(id);

    this.buffer = audioBuffer;

    this.start();
  }

  /**
   * download music data from google drive
   * @param id music id
   * @returns decoded audio buffer
   */
  private async downloadAudio(id: string) {
    const fileData = await downloadFile(id);
    const dataArray = Array.from(fileData).map(c => c.charCodeAt(0));
    const arrayBuffer = new Uint8Array(dataArray).buffer;
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    const tag = readTagFromData(arrayBuffer);
    console.log(tag);
    return audioBuffer;
  }

  /**
   * load audio buffer and set to next buffer
   * @param id music id
   */
  private loadNextBuffer(id: string) {
    this.loadedNextBuffer = false;
    this.nextBuffer = null;

    if (!id) return;

    this.downloadAudio(id).then(buffer => {
      if (!this.loadedNextBuffer) {
        this.nextBuffer = buffer;
        this.loadedNextBuffer = true;
      }
    });
  }

  /**
   * play to next music play start
   *
   * if next buffer loaded, set to buffer.
   * not loaded, load and play.
   * and, load next buffer.
   */
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

  /**
   * play now music, and load next music
   *
   * id by music id list and index
   */
  async playAndLoad() {
    await this.playWithId(this.musicIds[this.index]);
    this.loadNextBuffer(this.musicIds[this.nextIndex]);
  }

  /**
   * play music
   *
   * set music list and index, and play music
   * @param ids music id list
   * @param index start index
   */
  playWithIdList(ids: string[], index: number) {
    this.musicIds = ids;
    this.index = index;

    this.playAndLoad();
  }

  /** next index. if loop "all", last to first */
  get nextIndex() {
    if (this.loop === "all") {
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

    if (this.buffer === null) return;
    this.node.buffer = this.buffer;
    this.node.connect(this.context.destination);
    this.setDuration(this.buffer.duration);
    this.setLoop(this.loop);
  }

  /**
   * set loop and on end
   * @param loop new loop
   */
  setLoop(loop: "no" | "one" | "all") {
    this.loop = loop;
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
  }

  private setStopAt(stopAt: number) {
    this.stopAt = stopAt;
  }

  private setPause(isPaused: boolean) {
    this.isPaused = isPaused;
    this.onSetPause(this.isPaused);
  }

  /**
   * time has passed.
   */
  private updateTime() {
    if (this.isPaused) {
      this.setCurrentTime(this.stopAt);
    } else {
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
    if (this.isPaused) {
      this.setStartAt(this.context.currentTime);
      this.setStopAt(0);
      this.setPause(false);

      this.setInterval();

      this.setBuffer();
      this.node.start(this.context.currentTime, 0);
    }
  }

  /** play stop and jump to begin */
  stop() {
    if (!this.isPaused) {
      this.setStopAt(0);
      this.setPause(true);

      this.unsetInterval();

      this.node.stop(this.context.currentTime);
    }
  }

  /** play start at pause time */
  play() {
    if (this.isPaused) {
      this.setStartAt(this.context.currentTime - this.stopAt);
      this.setPause(false);

      this.setInterval();

      this.setBuffer();
      this.node.start(this.context.currentTime, this.stopAt);
    }
  }

  /** play stop and save pause time */
  pause() {
    if (!this.isPaused) {
      this.setStopAt((this.context.currentTime - this.startAt) % this.duration);
      this.setPause(true);

      this.unsetInterval();

      this.node.stop(this.context.currentTime);
    }
  }

  /** jump time */
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

export default AudioPlayer;
