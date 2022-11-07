import { audios } from "~/signals/audios";

import type { AudioPlayer } from "./AudioPlayer";

export class AudioBufferSourcePlayer implements AudioPlayer {
  private context: AudioContext;
  private node: AudioBufferSourceNode | null;
  private buffer: AudioBuffer | null;
  private blob: Blob | null = null;

  /** `AudioContext.currentTime` 基準 */
  private startTime = 0;

  /** `AudioBuffer.duration` 基準 */
  private currentTime = 0;

  onEnd: (() => void) | undefined;
  onChangePause: ((pause: boolean) => void) | undefined;
  onUpdateTime: ((time: number) => void) | undefined;
  onUpdateDuration: ((duration: number) => void) | undefined;

  constructor(context?: AudioContext) {
    this.context = context ?? new AudioContext();
    this.node = null;
    this.buffer = null;

    const timeUpdate = () => {
      if (this.startTime) {
        this.onUpdateTime?.(this.context.currentTime - this.startTime);
      } else {
        this.onUpdateTime?.(this.currentTime);
      }

      requestAnimationFrame(timeUpdate);
    };

    requestAnimationFrame(timeUpdate);
  }

  async setBuffer(
    id: string | undefined,
    blob: Promise<Blob | null>,
  ): Promise<void> {
    const awaited = await blob;
    if (awaited === this.blob) {
      return;
    }
    this.blob = awaited;

    if (awaited === null) {
      this.node?.disconnect();
      this.node = null;
      this.buffer = null;
      return;
    }

    this.buffer = await this.context.decodeAudioData(
      await awaited.arrayBuffer(),
    );

    const info = id && audios().get(id);
    info && (info.duration = this.buffer.duration);
    this.onUpdateDuration?.(this.buffer.duration);
  }

  setLoop(loop: boolean): void {
    if (this.node) this.node.loop = loop;
  }

  start(): void {
    this.currentTime = 0;
    this.play();
  }

  stop(): void {
    this.pause();
    this.currentTime = 0;
  }

  play(): void {
    if (this.buffer) {
      this.startTime = this.context.currentTime - this.currentTime;
      this.node = this.context.createBufferSource();
      this.node.buffer = this.buffer;

      this.node.addEventListener("ended", () => {
        if (
          Math.abs(
            this.startTime +
              (this.buffer?.duration ?? 0) -
              this.context.currentTime,
          ) < 1
        )
          this.onEnd?.();
      });

      this.node.connect(this.context.destination);

      try {
        this.node.start(0, this.currentTime);
        this.onChangePause?.(false);
      } catch (e) {
        this.onChangePause?.(true);
        alert(e);
      }
    }
  }

  pause(): void {
    this.node?.stop();
    this.currentTime = this.context.currentTime - this.startTime;
    this.startTime = 0;
    this.node?.disconnect();
    this.node = null;
    this.onChangePause?.(true);
  }

  seek(time: number): void {
    if (this.startTime) {
      this.pause();
      this.currentTime = time;
      this.play();
    } else {
      this.currentTime = time;
    }
  }
}
