import { downloadFile } from "./api";
import { File } from "./type";

export class PlayingList {
  playing: {
    node: AudioBufferSourceNode;
    duration: number;
    currentTime: number;
    startAt: number;
    stopAt: number;
    isPaused: boolean;
    buffer: {
      now: AudioNodeWrapper;
      next: AudioNodeWrapper;
    };
  };
  list: File[];
  index: number;
  history: (File | number)[];
  isLoop: boolean;

  intervalID: number;

  context: AudioContext;

  constructor() {
    this.context = new AudioContext();

    this.playing = {
      node: this.context.createBufferSource(),
      duration: 0,
      currentTime: 0,
      startAt: 0,
      stopAt: 0,
      isPaused: true,
      buffer: {
        now: new AudioNodeWrapper(this.context),
        next: new AudioNodeWrapper(this.context),
      },
    };
    this.list = [];
    this.index = 0;
    this.history = [];
    this.isLoop = false;

    this.intervalID = 0;

    this.onEnded();
  }

  addMusicToPlaying(music: File) {
    console.log("add music", music.name);

    this.list.push(music);

    if (this.list.length === 1) {
      // if list has only one item (no items before add)
      this.setIndex(0);
      this.play();
    } else if (this.list.length === 2) {
      // if list has only two item (one playing item before add)
      this.loadNextMusic();
    }
  }

  deleteMusicFromPlaying(index: number) {
    this.list.splice(index, 1);
    if (index === this.index + 1) {
      // if deleted item was next playing
      this.loadNextMusic();
    }
  }

  loadMusic() {
    if (this.list.length < 1) {
      // if list has no item
      this.playing.buffer.now.setId();
      return;
    }

    const id = this.list[this.index].id;

    this.playing.buffer.now.setId(id);
    this.setMusic(this.playing.buffer.now);

    console.log("set playing", id);
  }

  loadNextMusic() {
    if (
      this.list.length < 2 ||
      // if list has only one item
      (this.index + 1 === this.list.length && !this.isLoop)
      // if playing music is last item and dont loop
    ) {
      this.playing.buffer.next.setId();
      return;
    }

    const id = this.list[this.calcIndex(this.index, 1)].id;
    this.playing.buffer.next.setId(id);

    console.log("set next playing", id);
  }

  skipToNext() {
    console.log("skip next");

    if (this.playing.buffer.next.id.length === 0) {
      // if not has nextsource
      const index = this.calcIndex(this.index, 1);
      this.setIndex(index);
      return;
    }

    // change next to now
    const tmp = this.playing.buffer.now;
    this.playing.buffer.now = this.playing.buffer.next;
    this.playing.buffer.next = tmp;
    this.setMusic(this.playing.buffer.now);

    // reload
    this.index = this.calcIndex(this.index, 1);
    this.loadNextMusic();
  }

  skipTo(move: number) {
    console.log("skip", move);

    if (move === 1) {
      this.skipToNext();
      return;
    }
    const index = this.calcIndex(this.index, move);
    this.setIndex(index);
  }

  setIndex(index: number) {
    console.log("set index", index);

    this.index = this.calcIndex(index, 0);
    this.loadMusic();
    this.loadNextMusic();
  }

  setMusic(wrapper?: AudioNodeWrapper) {
    this.playing.node = this.context.createBufferSource();
    this.playing.node.connect(this.context.destination);
    this.playing.node.onended = this.onEnded;

    wrapper ??= this.playing.buffer.now;

    if (wrapper.loaded) {
      this.playing.node.buffer = wrapper.source;
      this.playing.duration = wrapper.source?.duration ?? 0;
      this.start();
    } else {
      this.playing.buffer.now.onload = source => {
        this.playing.node.buffer = source;
        this.playing.duration = source?.duration ?? 0;
        this.start();
      };
    }
  }

  start() {
    this.print();
    if (this.playing.isPaused) {
      this.playing.startAt = this.context.currentTime;
      this.playing.stopAt = 0;
      this.playing.isPaused = false;

      this.intervalID = window.setInterval(() => this.updateTime(), 250);

      this.playing.node.start(this.context.currentTime, 0);
    }
    this.print();
  }

  stop() {
    this.print();
    if (!this.playing.isPaused) {
      this.playing.stopAt = 0;
      this.playing.isPaused = true;

      window.clearInterval(this.intervalID);

      this.playing.node.stop(this.context.currentTime);
    }
    this.print();
  }

  play() {
    this.print();
    if (this.playing.isPaused) {
      this.playing.startAt = this.context.currentTime - this.playing.stopAt;
      this.playing.isPaused = false;

      this.intervalID = window.setInterval(() => this.updateTime(), 250);

      this.playing.node.start(this.context.currentTime, this.playing.stopAt);
    }
    this.print();
  }

  pause() {
    this.print();
    if (!this.playing.isPaused) {
      this.playing.stopAt = this.context.currentTime - this.playing.startAt;
      this.playing.isPaused = true;

      window.clearInterval(this.intervalID);

      this.playing.node.stop(this.context.currentTime);
    }
    this.print();
  }

  seek(time: number) {
    this.print();
    time = Math.round(time * 1000) / 1000;

    if (this.playing.isPaused) {
      this.playing.stopAt = time;
    } else {
      this.playing.node.stop();
      this.playing.node.start(this.context.currentTime, time);
    }
    this.print();
  }

  calcIndex(index: number, move: number): number {
    if (this.isLoop) {
      return (index + move) % this.list.length;
    } else {
      return Math.max(0, Math.min(this.list.length - 1, index + move));
    }
  }

  print() {
    console.log("duration", this.playing.duration);
    console.log("currentTime", this.playing.currentTime);
    console.log("startAt", this.playing.startAt);
    console.log("stopAt", this.playing.stopAt);
  }

  onLoadNowPlaying = () => {};
  onLoadNextPlaying = () => {};
  onTimeUpdate = () => {};

  updateTime() {
    this.onTimeUpdate();
    if (!this.playing.isPaused) {
      this.playing.currentTime =
        this.context.currentTime - this.playing.startAt;
    }
  }

  onEnded = () => {
    this.skipToNext();
  };
}

class AudioNodeWrapper {
  context: AudioContext;
  id: string = "";
  source: AudioBuffer | null = null;
  loaded: boolean = false;
  onload: ((source: AudioBuffer | null) => void) | null = null;

  constructor(context: AudioContext) {
    this.context = context;
  }

  async setId(id?: string) {
    if (id === undefined) {
      id = "";
    }
    this.id = id;
    this.source = null;
    this.loaded = false;

    if (this.id !== "") {
      console.log("download", this.id);
      const fileData = await downloadFile(this.id);
      const dataArray = Array.from(fileData).map(c => c.charCodeAt(0));
      const buffer = new Uint8Array(dataArray).buffer;
      this.source = await this.context.decodeAudioData(buffer);
      this.loaded = true;

      this.onload && this.onload(this.source);

      console.log("downloaded", this.id);
    }

    return this.source;
  }
}
