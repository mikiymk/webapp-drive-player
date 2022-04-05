import { File } from "file";

import Repeat from "./repeat";
import ShuffleArray from "./shuffleArray";
import BufferLoader from "./bufferLoader";
import AudioInfo from "./audioInfo";

/**
 * 音楽再生の管理
 */
class AudioPlayer {
  private audio = new Audio();

  private readonly buffer = new BufferLoader((id, info) =>
    this.loadInfo(id, info)
  );
  private readonly nextBuffer = new BufferLoader((id, info) =>
    this.loadInfo(id, info)
  );

  /** play music file list */
  musicIds: ShuffleArray<string> = new ShuffleArray([], false);

  /** play music ids index */
  private index = NaN;

  repeat: Repeat = Repeat.DEFAULT;
  isPaused = true;

  onSetDuration: (duration: number) => void = () => {};
  onSetCurrentTime: (currentTime: number) => void = () => {};
  onSetPause: (isPaused: boolean) => void = () => {};
  onSetRepeat: (repeat: Repeat) => void = () => {};
  onSetShuffle: (shuffle: boolean) => void = () => {};
  onLoadInfo: (id: string, info: AudioInfo) => void = () => {};
  onChangeMusic: (id: string) => void = () => {};

  constructor() {
    this.audio.addEventListener("ended", () => this.onEnd());
    this.audio.addEventListener("timeupdate", () => this.updateTime());
    this.audio.addEventListener("durationchange", () => this.updateDuration());
  }
  /**
   * 今の曲の再生バッファをロード
   */
  private async loadBuffer() {
    return await this.buffer.load(this.musicIds.get(this.index));
  }

  /**
   * 次の曲の再生バッファをロード
   */
  private async loadNextBuffer() {
    return await this.nextBuffer.load(this.musicIds.get(this.nextIndex));
  }

  /**
   * 次の曲のバッファがロード済みならそれを設定
   * 未ロードならロードして再生
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
   * 前の曲に戻して再生
   * 最初の前は最後
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
   * ロードと再生をまとめて行う
   */
  async playAndLoad() {
    this.stop();
    await this.loadBuffer();
    this.loadNextBuffer();
    this.start();
  }

  /**
   * リストと最初のインデックスを渡して再生を始める
   */
  playWithIdList(ids: string[], index: number) {
    this.musicIds = new ShuffleArray(ids, false);
    this.index = index;

    this.playAndLoad();
  }

  /** リピートが `"repeat on"` なら最後の次は最初 */
  get nextIndex() {
    if (this.repeat.value === "repeat on") {
      return (this.index + 1) % this.musicIds.length;
    } else {
      return this.index + 1;
    }
  }

  /**
   * オーディオオブジェクトにバッファをセットする
   * 必要がなければ何もしない
   * オーディオ情報も一緒に設定
   */
  private setBuffer() {
    if (this.buffer.loaded === null) {
      return;
    }
    URL.revokeObjectURL(this.audio.src);
    const src = URL.createObjectURL(this.buffer.loaded);

    if (src === this.audio.src) {
      return;
    }

    this.audio.src = src;
    this.audio.load();
    this.onChangeMusic(this.buffer.loadedID);
  }

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

  private loadInfo(id: string, info: AudioInfo) {
    this.onLoadInfo(id, info);
  }

  /** コールバック用 曲を再生して現在の再生位置が変わった時 */
  private updateTime() {
    this.onSetCurrentTime(this.audio.currentTime);
  }

  /** コールバック用 新しい曲をロードして曲の長さが変わった時 */
  private updateDuration() {
    this.onSetDuration(this.audio.duration);
  }

  /** コールバック用 曲が終わった時 */
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

  /** 先頭から再生 */
  start() {
    if (!this.isPaused) return;
    this.setCurrentTime(0);
    this.play();
  }

  /** 停止して停止位置を先頭に戻す */
  stop() {
    if (this.isPaused) return;
    this.pause();
    this.setCurrentTime(0);
  }

  /** 記録された停止位置から再生 */
  play() {
    if (!this.isPaused) return;
    this.setPause(false);

    this.setBuffer();
    if (this.audio.src === "") return;

    this.audio.play();
  }

  /** 停止して現在の位置を停止位置として記録 */
  pause() {
    if (this.isPaused) return;
    this.setPause(true);
    this.audio.pause();
  }

  /** 再生位置を指定のものに変更 */
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
