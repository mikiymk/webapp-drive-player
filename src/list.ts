import { downloadFile } from "./api";
import { File } from "./type";

const BUFFER_MAX_SIZE = 5;

export class AudioList {
  private readonly context: AudioContext;

  readonly list: File[];
  index: number = 0;

  downloadIDs: string[] = [];
  buffers: AudioBuffer[] = [];
  history: File[] = [];
  isLoop: boolean = false;

  isDownloading: boolean = false;

  getBufferCallBack: ((buffer: AudioBuffer) => void) | null = null;

  constructor(context: AudioContext, files: File[], index: number) {
    this.context = context;
    this.list = files;

    console.log("audio list", files);

    this.setIndex(index);
  }

  getBuffer(callback: (buffer: AudioBuffer) => void) {
    console.log("get buffer");

    const buffer = this.buffers.shift();
    if (buffer !== undefined) {
      callback(buffer);
    } else {
      this.getBufferCallBack = (buffer: AudioBuffer) => {
        console.log("get buffer callback");

        callback(buffer);
        this.getBufferCallBack = null;
      };
    }
  }

  setIndex(index: number) {
    console.log("set index", index);

    this.index = this.calcIndex(index, 0);
    if (this.list.length === 0) {
      this.downloadIDs = [];
    } else if (this.list.length === 1) {
      this.downloadIDs = [this.list[this.index].id];
    } else {
      this.downloadIDs = [
        this.list[this.index].id,
        this.list[this.calcIndex(index, 1)].id,
      ];
    }
    this.buffers = [];
    this.noticeDownload();
  }

  addDownloadID(id: string) {
    console.log("add download id", id);

    this.downloadIDs.push(id);
    this.noticeDownload();
  }

  private noticeDownload() {
    console.log("notice");

    if (this.downloadIDs.length === 0) {
      return;
    } else if (this.buffers.length > BUFFER_MAX_SIZE) {
      return;
    } else if (this.isDownloading) {
      return;
    } else {
      this.isDownloading = true;
      this.downloadBuffer();
    }
  }

  private async downloadBuffer() {
    console.log("download");

    const id = this.downloadIDs.shift();
    if (id === undefined) {
      return;
    }

    const buffer = await this.download(id);

    if (this.getBufferCallBack) {
      this.getBufferCallBack(buffer);
    } else {
      this.buffers.push(buffer);
    }

    this.isDownloading = false;
    this.noticeDownload();
  }

  private async download(id: string) {
    const fileData = await downloadFile(id);
    const dataArray = Array.from(fileData).map(c => c.charCodeAt(0));
    const buffer = new Uint8Array(dataArray).buffer;
    return await this.context.decodeAudioData(buffer);
  }

  private calcIndex(index: number, move: number): number {
    if (this.isLoop) {
      return (index + move) % this.list.length;
    } else {
      return Math.max(0, Math.min(this.list.length - 1, index + move));
    }
  }
}
