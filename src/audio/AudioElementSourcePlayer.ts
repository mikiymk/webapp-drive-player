import type { AudioPlayer } from "./AudioPlayer";

export class AudioElementPlayer implements AudioPlayer {
  private context: AudioContext;

  onEnd: (() => void) | undefined;
  onChangePause: ((pause: boolean) => void) | undefined;
  onUpdateTime: ((time: number) => void) | undefined;
  onUpdateDuration: ((duration: number) => void) | undefined;

  constructor(context?: AudioContext) {
    this.context = context ?? new AudioContext();
  }

  setBuffer(data: Blob | null): void {
    throw new Error("Method not implemented.");
  }
  setLoop(loop: boolean): void {
    throw new Error("Method not implemented.");
  }
  start(): void {
    throw new Error("Method not implemented.");
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  play(): void {
    throw new Error("Method not implemented.");
  }
  pause(): void {
    throw new Error("Method not implemented.");
  }
  seek(time: number): void {
    throw new Error("Method not implemented.");
  }
}
