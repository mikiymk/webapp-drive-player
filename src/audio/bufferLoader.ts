import { downloadFile } from "google-api/file";
import AudioInfo from "./audioInfo";

/**
 * 非同期なダウンロードを管理する
 */
class BufferLoader {
  /** 保持しているファイルのBLOB URL */
  url = "";

  /** 保持しているファイルID */
  loadedID = "";

  /** 最後に送られたファイルID */
  private willLoadID = "";

  /**  */
  private setInfo: (info: AudioInfo) => void;

  constructor(setInfo: (info: AudioInfo) => void) {
    this.setInfo = setInfo;
  }

  /**
   * ダウンロードする
   *
   * 最後に送られたIDのファイルのみ保持
   *
   * @param id ファイルID
   * @returns ファイルがない場合は空文字列
   */
  async load(id: string): Promise<string> {
    this.willLoadID = id;
    if (this.isLoaded) {
      return this.url;
    }
    URL.revokeObjectURL(this.url);
    this.url = "";

    if (id === null || id === undefined || id === "") {
      return "";
    }

    try {
      const fileData = await downloadFile(id);

      if (fileData === null) {
        return "";
      }

      const blob = await fileData.blob();
      const info = await AudioInfo.getInfo(id, blob.slice());

      if (this.willLoadID === id) {
        this.loadedID = id;
        URL.revokeObjectURL(this.url);
        this.setInfo(info);
        this.url = URL.createObjectURL(blob);
        return this.url;
      } else {
        return "";
      }
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  /**
   * 別のローダーから情報を持ってくる
   *
   * 勝手に close されないように別の情報は消しておく
   */
  copyFrom(other: BufferLoader) {
    URL.revokeObjectURL(this.url);

    this.willLoadID = other.willLoadID;
    this.url = other.url;
    this.loadedID = other.loadedID;

    other.url = "";
    other.loadedID = "";
  }

  get isLoaded() {
    return this.loadedID === this.willLoadID;
  }
}

export default BufferLoader;
