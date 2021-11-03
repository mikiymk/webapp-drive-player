type TagInfo = None | ID3v1 | ID3v1_1;

type None = { type: "" };
type ID3v1 = {
  type: "ID3v1";
  title: string;
  artist: string;
  album: string;
  year: number;
  comment: string;
  genre: number;
};
type ID3v1_1 = {
  type: "ID3v1.1";
  title: string;
  artist: string;
  album: string;
  track: number;
  year: number;
  comment: string;
  genre: number;
};

export const readTagFromData = (data: ArrayBuffer): TagInfo => {
  try {
    return readID3v1(data);
  } catch {}

  return { type: "" };
};

const readID3v1 = (data: ArrayBuffer): ID3v1 | ID3v1_1 => {
  const slicedData = new Uint8Array(data.slice(-128));

  const getString = (start: number, length: number) =>
    String.fromCharCode(...slicedData.slice(start, start + length));
  const obj: Partial<ID3v1 | ID3v1_1> = {};

  const tag = getString(0, 3);
  if (tag !== "TAG") {
    throw new Error("tag is not ID3v1");
  }
  const title = getString(3, 30);
  const artist = getString(33, 30);
  const album = getString(63, 30);
  const year = parseInt(getString(93, 4));
  let comment, track;
  if (slicedData[97 + 28]) {
    comment = getString(97, 30);
  } else {
    comment = getString(97, 28);
    track = slicedData[97 + 29];
  }
  const genre = slicedData[127];

  return track
    ? {
        type: "ID3v1.1",
        title,
        artist,
        album,
        year,
        comment,
        track,
        genre,
      }
    : {
        type: "ID3v1",
        title,
        artist,
        album,
        year,
        comment,
        genre,
      };
};
