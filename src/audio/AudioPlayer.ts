interface AudioPlayer {
  onEnd: (() => void) | undefined;
  changePause: ((pause: boolean) => void) | undefined;
  updateTime: ((time: number) => void) | undefined;
  updateDuration: ((duration: number) => void) | undefined;

  setBuffer: (blob: Blob) => void;

  setLoop(loop: boolean): void;

  /** 先頭から再生 */
  start(): void;

  /** 停止して停止位置を先頭に戻す */
  stop(): void;

  /** 記録された停止位置から再生 */
  play(): void;

  /** 停止して現在の位置を停止位置として記録 */
  pause(): void;

  /** 再生位置を指定のものに変更 */
  seek(time: number): void;
}

export default AudioPlayer;
