type TagInfo = {
  v1?: ID3v1 | ID3v1_1;
  v2?: ID3v2;
};

interface ID3v1 {
  version: "1";
  title: string;
  artist: string;
  album: string;
  year: number;
  comment: string;
  genre: number;
}

interface ID3v1_1 {
  version: "1.1";
  title: string;
  artist: string;
  album: string;
  track: number;
  year: number;
  comment: string;
  genre: number;
}

interface ID3v2 {
  version: "2.2.0" | "2.3.0" | "2.4.0";
  tags: ID3v2Frame[];
}

interface ID3v2Frame {
  id: string;
  data: any;
}

// ID3v1.1 https://id3.org/ID3v1
// --------------------------------
//   1 ...   3 |  3 Bytes | header "TAG"
//   4 ...  33 | 30 Bytes | title
//  34 ...  63 | 30 Bytes | artist
//  64 ...  93 | 30 Bytes | album
//  94 ...  97 |  4 Bytes | year
//  98 ... 127 | 30 Bytes | comment (v1)
//  98 ... 125 | 28 Bytes | comment (v1.1)
//         126 |  1 Byte  | separator $ 00 (v1.1)
//         127 |  1 Byte  | album track (v1.1)
//         128 |  1 Byte  | genre
// -------------------------------- < end of file

// ID3v1.2 https://www.birdcagesoft.com/ID3v12.txt
// --------------------------------
//   1 ...   3 |   3 Bytes | header "EXT"
//   4 ...  33 |  30 Bytes | last half of title
//  34 ...  63 |  30 Bytes | last half of artist
//  64 ...  93 |  30 Bytes | last half of album
//  94 ... 108 |  15 Bytes | last half of comment
// 109 ... 128 |  20 Bytes | sub genre
// 129 ... 256 | 128 Bytes | ID3v1.1 tag
// -------------------------------- < end of file

// ID3v1 enhanced https://en.wikipedia.org/wiki/ID3#Enhanced_TAG[10]
// --------------------------------
//   1 ...   4 |   4 Bytes | header "TAG+"
//   5 ...  64 |  60 Bytes | title
//  65 ... 124 |  60 Bytes | artist
// 125 ... 184 |  60 Bytes | album
//         185 |   1 Byte  | speed (0 = unset, 1 = slow, 2 = medium, 3 = fast, 4 = hardcore)
// 186 ... 215 |  30 Bytes | genre
// 216 ... 221 |   6 Bytes | start time
// 222 ... 227 |   6 Bytes | end time
// 228 ... 355 | 128 Bytes | ID3v1.1 tag
// -------------------------------- < end of file

// ID3v2.2 https://id3.org/id3v2-00
// -------------------------------- < start of file
//  1 ...  3 |    3 Bytes | header "ID3"
//  4 ...  5 |    2 Bytes | version $ 02 00
//         6 |    1 Byte  | flags %ab000000
//           |            |   a = unsynchronisation
//           |            |   b = compression
//  7 ... 10 |    4 Bytes | size %0xxxxxxx 0xxxxxxx 0xxxxxxx 0xxxxxxx
// 11 ...    | size Bytes | frames
// --------------------------------
//
// frame
// --------------------------------
// 1 ... 3 |    3 Bytes | frame identifier
// 4 ... 6 |    3 Bytes | frame size
// 7 ...   | size Bytes | frame data
// --------------------------------

// ID3v2.3 https://id3.org/d3v2.3.0
// -------------------------------- < start of file
//  1 ...  3 | 3 Bytes | header "ID3"
//  4 ...  5 | 2 Bytes | version $ 03 00
//         6 | 1 Byte  | flags %abc00000
//           |         |   a = Unsynchronisation
//           |         |   b = Extended header
//           |         |   c = Experimental indicator
//  7 ... 10 | 4 Bytes | size %0xxxxxxx 0xxxxxxx 0xxxxxxx 0xxxxxxx (size = x + f)
// 11 ...    | x Bytes | extended header (flag b)
//    ...    | f Bytes | frames
// --------------------------------
//
// extended header
// --------------------------------
//  1 ...  4 | 4 Bytes | extended header size (size = 6 or flag a 10)
//  5 ...  6 | 2 Bytes | flags %a0000000 00000000
//           |         |   a = CRC data present
//  7 ... 10 | 4 Bytes | padding size
// 11 ... 14 | 4 Bytes | CRC (flag a)
// --------------------------------
//
// frame
// --------------------------------
//  1 ...  4 |    4 Bytes | frame ID
//  5 ...  8 |    4 Bytes | frame size
//  9 ... 10 |    2 Bytes | frame flags %abc00000 ijk00000
//           |            |   a = Tag alter preservation
//           |            |   b = File alter preservation
//           |            |   c = Read only
//           |            |   i = Compression
//           |            |   j = Encryption
//           |            |   k = Grouping identity
// 11 ...    | size Bytes | frame data
// --------------------------------

// ID3v2.4 https://id3.org/id3v2.4.0-structure https://id3.org/id3v2.4.0-frames
// Synchsafe integers = %0xxxxxxx 0xxxxxxx 0xxxxxxx 0xxxxxxx
// -------------------------------- < start of file
//  1 ...  3 |  3 Bytes | header "ID3"
//  4 ...  5 |  2 Bytes | version $ 04 00
//         6 |  1 Byte  | flags %abcd0000
//           |          |   a = Unsynchronisation
//           |          |   b = Extended header
//           |          |   c = Experimental indicator
//           |          |   d = Footer present
//  7 ... 10 |  4 Bytes | size Synchsafe integers
//           |          |   size = ex + fr + (flag d) 10
// 11 ...    | ex Bytes | extended header (flag b)
//    ...    | fr Bytes | frames
//  1 ...  3 |  3 Bytes | header "3DI" (flag d)
//  4 ...  5 |  2 Bytes | version $ 04 00 (flag d)
//         6 |  1 Byte  | flags %abcd0000 (flag d)
//           |          |   a = Unsynchronisation
//           |          |   b = Extended header
//           |          |   c = Experimental indicator
//           |          |   d = Footer present
//  7 ... 10 |  4 Bytes | size Synchsafe integers (flag d)
//           |          |   size = ex + fr + ft
// --------------------------------
//
// extended header
// --------------------------------
//  1 ...  4 | 4 Bytes | extended header size Synchsafe integers
//           |         |   size = 6 + (flag b) 1 + (flag c) 6 + (flag d) 2
//         5 | 1 Byte  | flags size $ 01
//         6 | 1 Byte  | flags %0bcd0000
//           |         |   b = Tag is an update
//           |         |   c = CRC data present
//           |         |   d = Tag restrictions
//         7 | 1 Byte  | flag b data size $ 00 (flag b)
//         8 | 1 Byte  | flag c data size $ 05 (flag c)
//  9 ... 13 | 5 Bytes | flag c data (flag c)
//        14 | 1 Byte  | flag d data size $ 01 (flag d)
//        15 | 1 Byte  | flag d data %ppqrrstt (flag d)
//           |         |   p = Tag size restrictions
//           |         |   q = Text encoding restrictions
//           |         |   r = Text fields size restrictions
//           |         |   s = Image encoding restrictions
//           |         |   t = Image size restrictions
// --------------------------------
//
// frame
// --------------------------------
//  1 ...  4 |  4 Bytes | frame ID
//  5 ...  8 |  4 Bytes | frame size Synchsafe integers (size = ex + dt)
//  9 ... 10 |  2 Bytes | frame flags %0abc0000 0h00kmnp
//           |          |   a = Tag alter preservation
//           |          |   b = File alter preservation
//           |          |   c = Read only
//           |          |   h = Grouping identity
//           |          |   k = Compression
//           |          |   m = Encryption
//           |          |   n = Unsynchronisation
//           |          |   p = Data length indicator
// 11 ...    | ex Bytes | additional information (flag)
// 11 ...    | dt Bytes | frame data
// --------------------------------

/*
https://stackoverflow.com/questions/63578757/id3-parser-and-editor
1.  Check for ID3v1 at the end of the file.
2.  Check for ID3v1.2 in front of ID3v1.
3.  Check for Enhanced TAG in front of ID3v1.
4.  Check for multiple ID3v2 at the start of file and, as for ID3v2.4, a footer at the end of the file in front of all ID3v1-like tags.
*/

export const readTagFromData = (data: ArrayBuffer): TagInfo => {
  let v1;
  try {
    v1 = readID3v1(data);
  } catch {}

  let v2;
  try {
    v2 = readID3v2(data);
  } catch {}

  return { v1, v2 };
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
    throw new Error("tag is not ID3v2");
  }

  const version = `2.${uint8[3]}.${uint8[4]}`;

  if (version == "2.3.0") {
    const hasExtendHeader = uint8[5] & 0b0100_0000;

    const SIZE_MASK = 0b0111_1111;
    const size =
      (uint8[6] & SIZE_MASK) * 128 ** 3 +
      (uint8[7] & SIZE_MASK) * 128 ** 2 +
      (uint8[8] & SIZE_MASK) * 128 ** 1 +
      (uint8[9] & SIZE_MASK) * 128 ** 0;

    let extendHeaderSize = 0;
    if (hasExtendHeader) {
      extendHeaderSize =
        uint8[10] * 256 ** 3 +
        uint8[11] * 256 ** 2 +
        uint8[12] * 256 ** 1 +
        uint8[13] * 256 ** 0;
    }

    const framesData = new Uint8Array(data.slice(9 + extendHeaderSize, size));
    const tags: ID3v2Frame[] = [];

    let index = 0;
    while (true) {
      const id = String.fromCharCode(...framesData.slice(index, index + 4));
      if (!/^[0-9A-Z]{4}$/g.test(id)) {
        break;
      }
      const frameSize =
        uint8[index + 4] * 256 ** 3 +
        uint8[index + 5] * 256 ** 2 +
        uint8[index + 6] * 256 ** 1 +
        uint8[index + 7] * 256 ** 0;

      const data = uint8.slice(10, size + 10);
      tags.push({ id, data });
    }

    return {
      version,
      tags,
    };
  }

  throw new Error(`no supported version ${version}`);
};
