import type { AudioPlayer } from "./AudioPlayer";

export class AudioElementPlayer implements AudioPlayer {
  private audio = new Audio();

  private blob: Blob | null = new Blob();
  private blobURL = "";

  onEnd: (() => void) | undefined;
  onChangePause: ((pause: boolean) => void) | undefined;
  onUpdateTime: ((time: number) => void) | undefined;
  onUpdateDuration: ((duration: number) => void) | undefined;

  constructor() {
    this.audio.addEventListener("ended", () => this.onEnd?.());

    this.audio.addEventListener("timeupdate", () =>
      this.onUpdateTime?.(this.audio.currentTime)
    );
    this.audio.addEventListener("durationchange", () =>
      this.onUpdateDuration?.(this.audio.duration)
    );
  }

  setBuffer(blob: Blob | null): void {
    if (blob === this.blob) {
      return;
    }

    URL.revokeObjectURL(this.blobURL);
    this.blob = blob;
    if (blob !== null) {
      this.blobURL = URL.createObjectURL(blob);
    } else {
      this.blobURL = "";
    }

    this.audio.src = this.blobURL;
    this.audio.load();
  }

  setLoop(loop: boolean) {
    this.audio.loop = loop;
  }

  start() {
    this.audio.currentTime = 0;
    this.play();
  }

  stop() {
    this.pause();
    this.audio.currentTime = 0;
  }

  /** 記録された停止位置から再生 */
  play() {
    if (this.audio.src === "" || !this.audio.paused) {
      return;
    }

    this.audio
      .play()
      .then(() => this.onChangePause?.(false))
      .catch(() => this.onChangePause?.(true));
  }

  /** 停止して現在の位置を停止位置として記録 */
  pause() {
    this.audio.pause();
    this.onChangePause?.(true);
  }

  /** 再生位置を指定のものに変更 */
  seek(time: number) {
    this.audio.currentTime = time;
  }
}
