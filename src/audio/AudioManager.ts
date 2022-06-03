import { BufferLoader } from "./BufferLoader";
import { Repeat } from "./Repeat";
import { ShuffleArray } from "./ShuffleArray";

import type { AudioInfo } from "./AudioInfo";
import type { AudioPlayer } from "./AudioPlayer";

/**
 * 音楽再生の管理
 */
export class AudioManager {
  private player: AudioPlayer;

  private readonly buffer = new BufferLoader((id, info) =>
    this.loadInfo(id, info)
  );
  private readonly nextBuffer = new BufferLoader((id, info) =>
    this.loadInfo(id, info)
  );

  /** play music file list */
  musicIds = new ShuffleArray([], false);

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

  constructor(player: AudioPlayer) {
    this.player = player;
    player.onEnd = () => this.onEnd();
    player.changePause = pause => this.onSetPause(pause);
    player.updateTime = time => this.onSetCurrentTime(time);
    player.updateDuration = duration => this.onSetDuration(duration);
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
  playWithIdList(ids: readonly string[], index: number) {
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

    this.player.setBuffer(this.buffer.loaded);
    this.onChangeMusic(this.buffer.loadedID);
  }

  setRepeat(repeat: Repeat) {
    this.repeat = repeat;
    this.player.setLoop(repeat.value === "repeat one");
    this.onSetRepeat(repeat);
    this.loadNextBuffer();
  }

  setShuffle(shuffle: boolean) {
    this.musicIds.shuffle = shuffle;
    this.onSetShuffle(shuffle);
    this.loadNextBuffer();
  }

  setAccessToken(accessToken: string | undefined) {
    this.buffer.setAccessToken(accessToken);
    this.nextBuffer.setAccessToken(accessToken);
  }

  private loadInfo(id: string, info: AudioInfo) {
    this.onLoadInfo(id, info);
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

  start() {
    this.setBuffer();
    this.player.start();
  }

  stop() {
    this.player.stop();
  }

  play() {
    this.setBuffer();
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  seek(time: number) {
    this.player.seek(time);
  }
}
