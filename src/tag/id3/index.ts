import { readID3v2_3 } from "./2_3";

export const readTagFromData = (data: ArrayBuffer): TagInfo => {
  let v1;

  try {
    v1 = readID3v1(data);
  } catch (error) {
    console.error(error);
  }

  let v2;
  try {
    v2 = readID3v2(data);
  } catch (error) {
    console.error(error);
  }

  return { v1, v2 };
};

const readID3v1 = (data: ArrayBuffer): ID3v1 | ID3v1_1 => {
  const slicedData = new Uint8Array(data.slice(-128));

  const getString = (start: number, length: number) =>
    String.fromCharCode(...slicedData.slice(start, start + length));

  const tag = getString(0, 3);
  if (tag !== "TAG") {
    throw new Error("audio has no ID3v1");
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
        version: "1.1",
        title,
        artist,
        album,
        year,
        comment,
        track,
        genre,
      }
    : {
        version: "1",
        title,
        artist,
        album,
        year,
        comment,
        genre,
      };
};

const readID3v2 = (data: ArrayBuffer): ID3v2 => {
  const uint8 = new Uint8Array(data);

  const id3 = String.fromCharCode(...uint8.slice(0, 3));
  if (id3 !== "ID3") {
    throw new Error("audio has no ID3v2");
  }

  const version = `2.${uint8[3]}.${uint8[4]}`;

  if (version === "2.3.0") {
    return readID3v2_3(uint8);
  }

  throw new Error(`no supported version ${version}`);
};
