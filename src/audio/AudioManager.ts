import { downloadAudio } from "./AudioDownloader";

import { RepeatDefault, RepeatOff, RepeatOn, RepeatOne } from "./Repeat";
import { ShuffleArray } from "./ShuffleArray";

import type { AudioInfo } from "./AudioInfo";
import type { AudioPlayer } from "./AudioPlayer";
import type { RepeatType } from "./Repeat";

/**
 * 音楽再生の管理
 */
export class AudioManager {
  private player: AudioPlayer;

  private accessToken: string | undefined;
  /** play music file list */
  musicIds = new ShuffleArray([], false);

  /** play music ids index */
  private index = Number.NaN;

  repeat: RepeatType = RepeatDefault;
  isPaused = true;

  onSetDuration?: (duration: number) => void;
  onSetCurrentTime?: (currentTime: number) => void;
  onSetPause?: (isPaused: boolean) => void;
  onSetRepeat?: (repeat: RepeatType) => void;
  onSetShuffle?: (shuffle: boolean) => void;
  onLoadInfo?: (id: string, info: AudioInfo) => void;
  onChangeMusic?: (id: string | undefined) => void;

  constructor(player: AudioPlayer) {
    this.player = player;
    player.onEnd = () => {
      this.onEnd();
    };
    player.onChangePause = (pause) => this.onSetPause?.(pause);
    player.onUpdateTime = (time) => this.onSetCurrentTime?.(time);
    player.onUpdateDuration = (duration) => this.onSetDuration?.(duration);
  }

  /**
   * 今の曲の再生バッファをロード
   */
  private loadBuffer() {
    const id = this.musicIds.get(this.index);
    const [data, info] = downloadAudio(id, this.accessToken);
    void info.then((info) => {
      if (id) this.loadInfo(id, info);
    });
    return data;
  }

  /**
   * 次の曲の再生バッファをロード
   */
  private loadNextBuffer() {
    const id = this.musicIds.get(this.nextIndex);
    const [data, info] = downloadAudio(id, this.accessToken);
    void info.then((info) => {
      if (id) this.loadInfo(id, info);
    });
    return data;
  }

  /**
   * 次の曲のバッファがロード済みならそれを設定
   * 未ロードならロードして再生
   */
  playToNext() {
    this.stop();

    this.index = this.nextIndex;

    this.playAndLoad();
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
  playAndLoad() {
    this.stop();

    void this.loadBuffer();
    void this.loadNextBuffer();

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
    if (this.repeat === RepeatOn) {
      return (this.index + 1) % this.musicIds.length;
    }
    return this.index + 1;
  }

  /**
   * オーディオオブジェクトにバッファをセットする
   * 必要がなければ何もしない
   * オーディオ情報も一緒に設定
   */
  private async setBuffer() {
    const id = this.musicIds.get(this.index);
    const data = this.loadBuffer();

    this.onChangeMusic?.(id);
    await this.player.setBuffer(id, data);
    return id;
  }

  setRepeat(repeat: RepeatType) {
    this.repeat = repeat;
    this.player.setLoop(repeat === RepeatOne);
    this.onSetRepeat?.(repeat);
    void this.loadNextBuffer();
  }

  setShuffle(shuffle: boolean) {
    this.musicIds.shuffle = shuffle;
    this.onSetShuffle?.(shuffle);
    void this.loadNextBuffer();
  }

  setAccessToken(accessToken: string | undefined) {
    this.accessToken = accessToken;
  }

  private loadInfo(id: string, info: AudioInfo) {
    this.onLoadInfo?.(id, info);
  }

  /** コールバック用 曲が終わった時 */
  private onEnd() {
    switch (this.repeat) {
      case RepeatOff:
      case RepeatOn:
        this.playToNext();
        break;
      case RepeatOne:
        break;
    }
  }

  start() {
    void this.setBuffer().then((id) => {
      if (this.musicIds.get(this.index) === id) this.player.start();
    });
  }

  stop() {
    this.player.stop();
  }

  play() {
    void this.setBuffer().then((id) => {
      if (this.musicIds.get(this.index) === id) this.player.play();
    });
  }

  pause() {
    this.player.pause();
  }

  seek(time: number) {
    this.player.seek(time);
  }
}
