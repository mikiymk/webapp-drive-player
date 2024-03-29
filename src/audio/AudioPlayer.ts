export interface AudioPlayer {
  onEnd: (() => void) | undefined;
  onChangePause: ((pause: boolean) => void) | undefined;
  onUpdateTime: ((time: number) => void) | undefined;
  onUpdateDuration: ((duration: number) => void) | undefined;

  /**
   * オーディオデータを設定する。
   * undefined なら設定をとる。
   */
  setBuffer(
    id: string | undefined,
    data: Promise<Blob | undefined>,
  ): Promise<void>;

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
