import { parseBlob } from "music-metadata-browser";

class AudioInfo {
  static getEmptyInfo() {
    return new AudioInfo();
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
      picture,

      comment,
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

    return new AudioInfo(title, artists?.join(", "), album, jacket);
  }

  readonly title: string;
  readonly artist: string;
  readonly album: string;
  readonly jacket: string;

  private constructor(
    title?: string,
    artist?: string,
    album?: string,
    jacket?: string
  ) {
    this.title = title ?? "";
    this.artist = artist ?? "";
    this.album = album ?? "";
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
