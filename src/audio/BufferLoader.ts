import { downloadFile } from "~/google-api/file";
import AudioInfo from "./AudioInfo";

/**
 * 非同期なダウンロードを管理する
 */
class BufferLoader {
  /** 保持しているファイルのBLOB URL */
  public loaded: Blob | null = null;

  /** 保持しているファイルID */
  loadedID = "";

  /** 最後に送られたファイルID */
  private willLoadID = "";

  private setInfo: (id: string, info: AudioInfo) => void;

  private accessToken = "";

  constructor(setInfo: (id: string, info: AudioInfo) => void) {
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
  async load(id: string): Promise<Blob | null> {
    this.willLoadID = id;
    if (this.isLoaded) {
      return this.loaded;
    }
    this.loaded = null;

    if (id === null || id === undefined || id === "") {
      return this.loaded;
    }

    try {
      const fileData = await downloadFile(this.accessToken, id);

      if (fileData === null) {
        return this.loaded;
      }

      const blob = await fileData.blob();
      const info = await AudioInfo.getInfo(blob.slice());

      if (this.willLoadID === id) {
        this.loadedID = id;
        this.setInfo(id, info);
        this.loaded = blob;
        return this.loaded;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * 別のローダーから情報を持ってくる
   *
   * 勝手に close されないように別の情報は消しておく
   */
  copyFrom(other: BufferLoader) {
    this.willLoadID = other.willLoadID;
    this.loaded = other.loaded;
    this.loadedID = other.loadedID;

    other.loadedID = "";
  }

  get isLoaded() {
    return this.loadedID === this.willLoadID;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export default BufferLoader;
