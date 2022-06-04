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

  async setBuffer(blob: Promise<Blob | null>): Promise<void> {
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
      await awaited.arrayBuffer()
    );
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
      this.node = getBufferSourceNode(
        this.context,
        this.buffer,
        this.startTime,
        this.onEnd
      );
      this.node.connect(this.context.destination);

      try {
        this.node.start(0, this.startTime);
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
    this.currentTime = time;
  }
}

const getBufferSourceNode = (
  context: AudioContext,
  buffer: AudioBuffer,
  startTime: number,
  onEnd?: () => void
) => {
  const node = context.createBufferSource();
  node.buffer = buffer;

  node.addEventListener("ended", () => {
    if (Math.abs(startTime + (buffer?.duration ?? 0) - context.currentTime) < 1)
      onEnd?.();
  });

  return node;
};
