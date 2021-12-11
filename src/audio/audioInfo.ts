import { readTagFromData } from "tag/index";

class AudioInfo {
  static async getInfo(data?: ArrayBuffer) {
    if (data === undefined) {
      return new AudioInfo();
    }

    const tag = readTagFromData(data);
    console.log(tag);

    let title;
    let artist;
    let album;
    let jacket;

    if (tag.v2 !== undefined) {
      title = tag.v2.tags.find(({ id }) => id === "TIT2")?.data?.text;
      artist = tag.v2.tags.find(({ id }) => id === "TPE1")?.data?.text;
      album = tag.v2.tags.find(({ id }) => id === "TALB")?.data?.text;
      const apic = tag.v2.tags.find(({ id }) => id === "APIC")?.data;
      if (apic !== undefined) {
        jacket = URL.createObjectURL(
          new Blob([apic.pictureData], { type: apic.mimetype })
        );
      }
    } else if (tag.v1 !== undefined) {
      title = tag.v1.title;
      artist = tag.v1.artist;
      album = tag.v1.album;
    }

    return new AudioInfo(title, artist, album, jacket);
  }

  constructor(
    readonly title?: string,
    readonly artist?: string,
    readonly album?: string,
    readonly jacket?: string
  ) {
    console.log(`TITLE : ${title}`);
    console.log(`ARTIST: ${artist}`);
    console.log(`ALBUM : ${album}`);
    console.log(`JACKET: ${jacket}`);
  }

  close() {
    if (this.jacket !== undefined) {
      URL.revokeObjectURL(this.jacket);
    }
  }
}

export default AudioInfo;