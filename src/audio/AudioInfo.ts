export class AudioInfo {
  readonly title: string;
  readonly artists: string[];
  readonly album: string;
  readonly albumartist: string;

  readonly track: number | undefined;
  readonly trackOf: number | undefined;
  readonly disk: number | undefined;
  readonly diskOf: number | undefined;
  readonly date: string;
  readonly genre: string[];

  readonly picture: ArrayBuffer;

  readonly albumsort: string;
  readonly titlesort: string;
  readonly artistsort: string;
  readonly albumartistsort: string;

  constructor(
    title?: string,
    artists?: string[],
    album?: string,
    albumartist?: string,
    track?: number,
    trackOf?: number,
    disk?: number,
    diskOf?: number,
    date?: string,
    genre?: string[],
    picture?: ArrayBuffer,
    albumsort?: string,
    titlesort?: string,
    artistsort?: string,
    albumartistsort?: string
  ) {
    this.title = title ?? "";
    this.artists = artists ?? [];
    this.album = album ?? "";
    this.albumartist = albumartist ?? "";
    this.track = track;
    this.trackOf = trackOf;
    this.disk = disk;
    this.diskOf = diskOf;
    this.date = date ?? "";
    this.genre = genre ?? [];
    this.picture = picture ?? new ArrayBuffer(0);
    this.albumsort = albumsort ?? "";
    this.titlesort = titlesort ?? "";
    this.artistsort = artistsort ?? "";
    this.albumartistsort = albumartistsort ?? "";
  }

  toJSON() {
    const properties: [
      keyof AudioInfo,
      string | number | string[] | undefined
    ][] = [];

    if (this.title) properties.push(["title", this.title]);
    if (this.artists.length) properties.push(["artists", this.artists]);
    if (this.album) properties.push(["album", this.album]);
    if (this.albumartist) properties.push(["albumartist", this.albumartist]);
    if (this.track) properties.push(["track", this.track]);
    if (this.trackOf) properties.push(["trackOf", this.trackOf]);
    if (this.disk) properties.push(["disk", this.disk]);
    if (this.diskOf) properties.push(["diskOf", this.diskOf]);
    if (this.date) properties.push(["date", this.date]);
    if (this.genre.length) properties.push(["genre", this.genre]);
    if (this.albumsort) properties.push(["albumsort", this.albumsort]);
    if (this.titlesort) properties.push(["titlesort", this.titlesort]);
    if (this.artistsort) properties.push(["artistsort", this.artistsort]);
    if (this.albumartistsort)
      properties.push(["albumartistsort", this.albumartistsort]);

    return Object.fromEntries(properties);
  }
}

export const emptyInfo = () => {
  return new AudioInfo();
};

export const namedInfo = (name: string) => {
  return new AudioInfo(name);
};

/**
 * @param data オーディオファイルデータ
 * @returns データから読み取ったオーディオ情報
 */
export const parseInfo = async (data: Blob) => {
  let metadata;
  try {
    const { parseBuffer } = await import("./music-metadata");
    const buffer = await data.arrayBuffer();
    metadata = await parseBuffer(new Uint8Array(buffer));
    console.log(metadata);
  } catch (error) {
    console.log("error");
    console.log(error);

    return emptyInfo();
  }

  const {
    title,
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
  } = metadata.common;

  return new AudioInfo(
    title,
    artists,
    album,
    albumartist,
    track.no ?? undefined,
    track.of ?? undefined,
    disk.no ?? undefined,
    disk.of ?? undefined,
    date,
    genre,
    picture?.[0]?.data.buffer,
    albumsort,
    titlesort,
    artistsort,
    albumartistsort
  );
};

export const copyInfo = (base: AudioInfo) => {
  return new AudioInfo(
    base.title,
    base.artists,
    base.album,
    base.albumartist,
    base.track,
    base.trackOf,
    base.disk,
    base.diskOf,
    base.date,
    base.genre,
    base.picture,
    base.albumsort,
    base.titlesort,
    base.artistsort,
    base.albumartistsort
  );
};
