import { downloadFile } from "google-api/file";
import AudioInfo from "./audioInfo";

/**
 * 非同期なダウンロードを管理する
 */
class BufferLoader {
  /** 保持しているファイルのBLOB URL */
  url = "";
  info = AudioInfo.getEmptyInfo();

  /** 保持しているファイルID */
  private loadedID = "";

  /** 最後に送られたファイルID */
  private willLoadID = "";

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

    if (id === "") {
      return "";
    }

    try {
      const fileData = await downloadFile(id);

      if (fileData === null) {
        return "";
      }

      const blob = await fileData.blob();
      const arrayBuffer = await blob.slice().arrayBuffer();

      if (this.willLoadID === id) {
        this.info.close();

        this.loadedID = id;
        URL.revokeObjectURL(this.url);
        this.url = URL.createObjectURL(blob);
        this.info = await AudioInfo.getInfo(arrayBuffer);
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
    this.info.close();
    URL.revokeObjectURL(this.url);

    this.willLoadID = other.willLoadID;
    this.url = other.url;
    this.info = other.info;
    this.loadedID = other.loadedID;

    other.url = "";
    other.loadedID = "";
    // TODO info消す
  }

  get isLoaded() {
    return this.loadedID === this.willLoadID;
  }
}

export default BufferLoader;
