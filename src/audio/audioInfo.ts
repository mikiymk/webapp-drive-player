import { parseBlob } from "music-metadata-browser";

type AudioInfoNumber = { of: number | null; no: number | null };

type AudioInfoSort = {
  albumsort: string;
  titlesort: string;
  artistsort: string;
  albumartistsort: string;
  composersort: string;
};

class AudioInfo {
  static getEmptyInfo() {
    return new AudioInfo("", "");
  }

  /**
   * @param data オーディオファイルデータ
   * @returns データから読み取ったオーディオ情報
   */
  static async getInfo(data: Blob) {
    let metadata;
    try {
      metadata = await parseBlob(data);
      console.log(metadata);
    } catch (error) {
      console.log("error");
      console.log(error);

      return AudioInfo.getEmptyInfo();
    }

    const {
      title,
      artist,
      artists,
      album,
      albumartist,
      track,
      disk,
      date,
      genre,
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
      artist,
      artists,
      album,
      albumartist,
      track,
      disk,
      date,
      genre,
      picture?.map(value => value.data.buffer),
      sort
    );
  }

  static copyInfo(base: AudioInfo) {
    return new AudioInfo(
      base.title,
      base.artist,
      base.artists,
      base.album,
      base.albumartist,
      base.track,
      base.disk,
      base.date,
      base.genre,
      base.picture,
      base.sort
    );
  }

  readonly title: string;
  readonly artist: string;
  readonly artists: string[];
  readonly album: string;
  readonly albumartist: string;

  readonly track: AudioInfoNumber;
  readonly disk: AudioInfoNumber;
  readonly date: string;
  readonly genre: string[];

  readonly picture: ArrayBuffer[];
  readonly sort: Partial<AudioInfoSort>;

  private constructor(
    title?: string,
    artist?: string,
    artists?: string[],
    album?: string,
    albumartist?: string,
    track?: AudioInfoNumber,
    disk?: AudioInfoNumber,
    date?: string,
    genre?: string[],
    picture?: ArrayBuffer[],
    sort?: Partial<AudioInfoSort>
  ) {
    this.title = title ?? "";
    this.artist = artist ?? "";
    this.artists = artists ?? [""];
    this.album = album ?? "";
    this.albumartist = albumartist ?? "";
    this.track = { no: track?.no ?? null, of: track?.of ?? null };
    this.disk = { no: disk?.no ?? null, of: disk?.of ?? null };
    this.date = date ?? "";
    this.genre = genre ?? [];
    this.picture = picture ?? [];
    this.sort = sort ?? {};
  }
}

export default AudioInfo;
