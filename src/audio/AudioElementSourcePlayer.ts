import type { AudioPlayer } from "./AudioPlayer";

export class AudioElementSourcePlayer implements AudioPlayer {
  private context: AudioContext;
  private node: MediaElementAudioSourceNode | null;
  private blob: Blob | null = null;

  onEnd: (() => void) | undefined;
  onChangePause: ((pause: boolean) => void) | undefined;
  onUpdateTime: ((time: number) => void) | undefined;
  onUpdateDuration: ((duration: number) => void) | undefined;

  constructor(context?: AudioContext) {
    this.context = context ?? new AudioContext();
    this.node = null;
  }

  async setBuffer(blob: Promise<Blob | null>): Promise<void> {
    const awaited = await blob;
    if (awaited === this.blob) {
      return;
    }
    this.blob = awaited;

    this.node?.disconnect();
    if (null === awaited) {
      URL.revokeObjectURL(this.node?.mediaElement.src ?? "");
      this.node = null;
      return;
    }

    const elem = new Audio();
    elem.src = URL.createObjectURL(awaited);
    elem.addEventListener("ended", () => this.onEnd?.());

    elem.addEventListener("timeupdate", () =>
      this.onUpdateTime?.(elem.currentTime)
    );
    elem.addEventListener("durationchange", () =>
      this.onUpdateDuration?.(elem.duration)
    );
    elem.load();
    this.node = this.context.createMediaElementSource(elem);
    this.node.connect(this.context.destination);
  }

  setLoop(loop: boolean): void {
    if (this.node) this.node.mediaElement.loop = loop;
  }

  start() {
    if (this.node) {
      this.node.mediaElement.currentTime = 0;
      this.play();
    }
  }

  stop() {
    if (this.node) {
      this.pause();
      this.node.mediaElement.currentTime = 0;
    }
  }

  /** 記録された停止位置から再生 */
  play() {
    if (this.node) {
      if (this.node.mediaElement.src === "" || !this.node.mediaElement.paused) {
        return;
      }

      this.node.mediaElement
        .play()
        .then(() => this.onChangePause?.(false))
        .catch(() => this.onChangePause?.(true));
    }
  }

  /** 停止して現在の位置を停止位置として記録 */
  pause() {
    if (this.node) {
      this.node.mediaElement.pause();
      this.onChangePause?.(true);
    }
  }

  /** 再生位置を指定のものに変更 */
  seek(time: number) {
    if (this.node) this.node.mediaElement.currentTime = time;
  }
}
