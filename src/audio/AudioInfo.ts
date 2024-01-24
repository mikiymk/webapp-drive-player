import type { IAudioMetadata } from "music-metadata";

type Partial<T> = { [P in keyof T]?: T[P] | undefined };
interface AudioInfoNumber {
  of: number | undefined;
  no: number | undefined;
}

interface AudioInfoSort {
  albumsort: string;
  titlesort: string;
  artistsort: string;
  albumartistsort: string;
}

export class AudioInfo {
  static getEmptyInfo() {
    return new AudioInfo();
  }

  static getNamedInfo(name: string) {
    return new AudioInfo(name);
  }

  /**
   * @param data オーディオファイルデータ
   * @returns データから読み取ったオーディオ情報
   */
  static async getInfo(data: Blob) {
    let metadata: IAudioMetadata;
    try {
      const { parseBuffer } = await import("./music-metadata");
      const buffer = await data.arrayBuffer();
      metadata = await parseBuffer(new Uint8Array(buffer));
      console.log(metadata);
    } catch (error) {
      console.log("error");
      console.log(error);

      return AudioInfo.getEmptyInfo();
    }

    const {
      title,
      artists,
      album,
      albumartist,
      track,
      disk,
      picture,

      albumsort,
      titlesort,
      artistsort,
      albumartistsort,
      composersort,
    } = metadata.common;

    const sort = {
      albumsort,
      titlesort,
      artistsort,
      albumartistsort,
      composersort,
    };

    return new AudioInfo(
      title,
      artists,
      album,
      albumartist,
      { of: track.of ?? undefined, no: track.no ?? undefined },
      { of: disk.of ?? undefined, no: disk.no ?? undefined },
      0,
      picture?.[0]?.data.buffer,
      sort,
    );
  }

  static copyInfo(base: AudioInfo) {
    return new AudioInfo(
      base.title,
      base.artists,
      base.album,
      base.albumartist,
      base.track,
      base.disk,
      base.duration,
      base.picture,
      base.sort,
    );
  }

  readonly title: string;
  readonly artists: string[];
  readonly album: string;
  readonly albumartist: string;

  readonly track: AudioInfoNumber;
  readonly disk: AudioInfoNumber;

  duration: number;

  readonly picture: ArrayBuffer;
  readonly sort: AudioInfoSort;

  private constructor(
    title?: string,
    artists?: string[],
    album?: string,
    albumartist?: string,
    track?: AudioInfoNumber,
    disk?: AudioInfoNumber,
    duration?: number,
    picture?: ArrayBuffer,
    sort?: Partial<AudioInfoSort>,
  ) {
    this.title = title ?? "";
    this.artists = artists ?? [""];
    this.album = album ?? "";
    this.albumartist = albumartist ?? "";
    this.track = { no: track?.no ?? undefined, of: track?.of ?? undefined };
    this.disk = { no: disk?.no ?? undefined, of: disk?.of ?? undefined };
    this.duration = duration ?? 0;
    this.picture = picture ?? new ArrayBuffer(0);
    this.sort = {
      albumsort: sort?.albumsort ?? "",
      titlesort: sort?.titlesort ?? "",
      artistsort: sort?.artistsort ?? "",
      albumartistsort: sort?.albumartistsort ?? "",
    };
  }
}
