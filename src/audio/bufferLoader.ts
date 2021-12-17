import { downloadFile } from "google-api/file";
import AudioInfo from "./audioInfo";

class BufferLoader {
  url = "";
  info = AudioInfo.getEmptyInfo();

  private loadedID = "";
  private willLoadID = "";

  /**
   * download music data from google drive
   * @param id music file id
   * @returns audio file url or empty string if error
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

  copyFrom(other: BufferLoader) {
    this.info.close();
    URL.revokeObjectURL(this.url);

    this.willLoadID = other.willLoadID;
    this.url = other.url;
    this.info = other.info;
    this.loadedID = other.loadedID;

    other.url = "";
    other.loadedID = "";
  }

  get isLoaded() {
    return this.loadedID === this.willLoadID;
  }
}

export default BufferLoader;
