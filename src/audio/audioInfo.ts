import { parseBlob } from "music-metadata-browser";

type Nullable<T extends object> = {
  [K in keyof T]: T[K] | null;
};

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> | undefined }
  : T;

type AudioInfoNumber = { of: number; no: number };
type AudioInfoBase = {
  readonly title: string;
  readonly artist: string;
  readonly artists: string[];
  readonly album: string;
  readonly albumartist: string;

  readonly track: Nullable<AudioInfoNumber>;
  readonly disk: Nullable<AudioInfoNumber>;
  readonly date: string | null;
  readonly genre: string[];
};

type AudioInfoAdditional = {
  composer: string[];
  lyricist: string[];
  writer: string[];
  conductor: string[];
  remixer: string[];
  arranger: string[];
  engineer: string[];
  producer: string[];
  technician: string[];
  djmixer: string[];
  mixer: string[];

  lyrics: string[];
  picture: Uint8Array[];

  comment: string[];
  work: string;
  label: string[];
  grouping: string;
  subtitle: string[];
  discsubtitle: string[];
  totaltracks: string;
  totaldiscs: string;
  compilation: boolean;
  rating: number[];
  bpm: number;
  mood: string;
  media: string;
  catalognumber: string[];
  website: string;
  notes: string[];
  key: string;

  original: AudioInfoOriginal;
  sort: AudioInfoSort;
};

type AudioInfoOriginal = {
  originalalbum: string;
  originalartist: string;
  originaldate: string;
  originalyear: number;
};

type AudioInfoSort = {
  albumsort: string;
  titlesort: string;
  artistsort: string;
  albumartistsort: string;
  composersort: string;
};

class AudioInfo {
  static getEmptyInfo() {
    return new AudioInfo({});
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
      year,
      track,
      disk,
      date,
      genre,
      comment,
      composer,
      lyricist,
      writer,
      conductor,
      remixer,
      arranger,
      engineer,
      producer,
      technician,
      djmixer,
      mixer,

      lyrics,
      picture,

      albumsort,
      titlesort,
      artistsort,
      albumartistsort,
      composersort,

      work,
      label,
      grouping,
      subtitle,
      discsubtitle,
      totaltracks,
      totaldiscs,
      compilation,
      rating,
      bpm,
      mood,
      media,
      catalognumber,
      website,
      notes,
      key,
      originalalbum,
      originalartist,
      originaldate,
      originalyear,
    } = metadata.common;

    const base = {
      title,
      artist,
      artists,
      album,
      albumartist,
      year,
      track,
      disk,
      date,
      genre,
    };

    const additional = {
      composer,
      lyricist,
      writer,
      conductor,
      remixer,
      arranger,
      engineer,
      producer,
      technician,
      djmixer,
      mixer,

      lyrics,
      picture: picture?.map(value => value.data),

      comment,
      work,
      label,
      grouping,
      subtitle,
      discsubtitle,
      totaltracks,
      totaldiscs,
      compilation,
      rating: rating?.map(value => value.rating),
      bpm,
      mood,
      media,
      catalognumber,
      website,
      notes,
      key,

      original: {
        originalalbum,
        originalartist,
        originaldate,
        originalyear,
      },

      sort: {
        albumsort,
        titlesort,
        artistsort,
        albumartistsort,
        composersort,
      },
    };

    let jacket;
    if (picture !== undefined && picture.length >= 1) {
      jacket = URL.createObjectURL(
        new Blob([picture[0].data], { type: picture[0].format })
      );
    }

    return new AudioInfo(base, additional, jacket);
  }

  readonly base: AudioInfoBase;
  readonly additional: DeepPartial<AudioInfoAdditional>;

  readonly jacket: string;

  private constructor(
    {
      title,
      artist,
      artists,
      album,
      albumartist,
      track,
      disk,
      date,
      genre,
    }: Partial<AudioInfoBase>,
    additional?: DeepPartial<AudioInfoAdditional>,
    jacket?: string
  ) {
    this.base = {
      title: title ?? "",
      artist: artist ?? "",
      artists: artists ?? [""],
      album: album ?? "",
      albumartist: albumartist ?? "",
      track: { no: track?.no ?? null, of: track?.of ?? null },
      disk: { no: disk?.no ?? null, of: disk?.of ?? null },
      date: date ?? null,
      genre: genre ?? [],
    };

    this.additional = additional ?? { original: {}, sort: {} };
    this.jacket = jacket ?? "";
  }

  /**
   * 消す前に呼ぶ
   */
  close() {
    if (this.jacket !== undefined) {
      URL.revokeObjectURL(this.jacket);
    }
  }
}

export default AudioInfo;
