export const readID3v2_3 = (data: Uint8Array): ID3v2 => {
  const hasExtendHeader = data[5] & 0b0100_0000;

  const SIZE_MASK = 0b0111_1111;
  const size =
    (data[6] & SIZE_MASK) * 128 ** 3 +
    (data[7] & SIZE_MASK) * 128 ** 2 +
    (data[8] & SIZE_MASK) * 128 ** 1 +
    (data[9] & SIZE_MASK) * 128 ** 0;

  let extendHeaderSize = 0;
  if (hasExtendHeader) {
    extendHeaderSize =
      data[10] * 256 ** 3 +
      data[11] * 256 ** 2 +
      data[12] * 256 ** 1 +
      data[13] * 256 ** 0 +
      4;
  }
  const tags: ID3v2Frame[] = [];

  let index = 10 + extendHeaderSize;
  while (true) {
    const id = String.fromCharCode(...data.slice(index, index + 4));
    if (!/^[0-9A-Z]{4}$/.test(id)) {
      break;
    }
    const frameSize =
      data[index + 4] * 256 ** 3 +
      data[index + 5] * 256 ** 2 +
      data[index + 6] * 256 ** 1 +
      data[index + 7] * 256 ** 0;

    const converted = convertData(
      id,
      data.slice(index + 10, index + 10 + frameSize)
    );
    tags.push(converted);
    index += 10 + frameSize;
  }

  return {
    version: "2.3.0",
    tags,
  };
};

const convertData = (id: string, data: Uint8Array): ID3v2Frame => {
  console.log(id, data);

  if (id === "UFID") {
    return { id, data: getUFID(data) };
  } else if (id === "TXXX") {
    return { id, data: getTXXX(data) };
  } else if (id[0] === "T" || ["IPLS"].includes(id)) {
    return { id, data: getTEXT(data) };
  } else if (id === "WXXX") {
    return { id, data: getWXXX(data) };
  } else if (id[0] === "W") {
    return { id, data: getWEXT(data) };
  } else if (id === "USLT" || id === "COMM") {
    return { id, data: getCOMM(data) };
  } else if (id === "SYLT") {
    return { id, data: getSYLT(data) };
  } else if (id === "APIC") {
    return { id, data: getAPIC(data) };
  } else if (id === "GEOB") {
    return { id, data: getGEOB(data) };
  } else {
    return { id, data };
  }
};

const getUFID = (data: Uint8Array) => {
  // 4.1 Unique file identifier
  const [ownerIdentifier, sep] = readText(data, 0, false, true);
  const [identifier] = data.slice(sep);
  return { ownerIdentifier, identifier };
};

const getTXXX = (data: Uint8Array) => {
  // 4.2.2 User defined text information frame
  const isUnicode = data[0] === 1;

  const [description, sep] = readText(data, 1, isUnicode, true);
  const [value] = readText(data, sep, isUnicode, false);

  return { isUnicode, description, value };
};

const getTEXT = (data: Uint8Array) => {
  // 4.2 Text information frames
  // 4.4 Involved people list
  const [text] = readText(data, 1, data[0] === 1, false);
  return text;
};

const getWXXX = (data: Uint8Array) => {
  // 4.3.2 User defined URL link frame
  const isUnicode = data[0] === 1;

  const [description, sep] = readText(data, 1, isUnicode, true);
  const [url] = readText(data, sep, false, false);

  return { description, url };
};

const getWEXT = (data: Uint8Array) => {
  // 4.3 URL link frames
  const [url] = readText(data, 0, false, false);

  return url;
};

const getCOMM = (data: Uint8Array) => {
  // 4.9 Unsychronised lyrics/text transcription
  // 4.11 Comments
  const isUnicode = data[0] === 1;

  const language = String.fromCharCode(data[1], data[2], data[3]);
  const [contentDescriptor, sep] = readText(data, 4, isUnicode, true);
  const [text] = readText(data, sep, isUnicode, false);

  return {
    language,
    contentDescriptor,
    text,
  };
};

const getSYLT = (data: Uint8Array) => {
  // 4.10 Synchronised lyrics/text
  const isUnicode = data[0] === 1;

  const language = String.fromCharCode(data[1], data[2], data[3]);
  const timestampFormat = data[4];
  const contentType = data[5];

  const [contentDescriptor, sep] = readText(data, 6, isUnicode, true);

  const content: { text: string; timestamp: number }[] = [];
  let startIndex = sep;
  while (true) {
    let text, sep;
    try {
      [text, sep] = readText(data, startIndex, isUnicode, true);
    } catch {
      break;
    }
    const timestamp =
      data[sep + 0] * 256 ** 3 +
      data[sep + 1] * 256 ** 2 +
      data[sep + 2] * 256 ** 1 +
      data[sep + 3] * 256 ** 0;
    content.push({ text, timestamp });

    startIndex = sep + 4;
  }

  return {
    language,
    timestampFormat,
    contentType,
    contentDescriptor,
    content,
  };
};

const getAPIC = (data: Uint8Array) => {
  // 4.15 Attached picture
  const isUnicode = data[0] === 1;

  const [mimetype, msep] = readText(data, 1, false, true);
  const pictureType = data[msep];
  const [description, dsep] = readText(data, msep + 1, data[0] === 1, true);
  const pictureData = data.slice(dsep);

  return {
    mimetype,
    pictureType,
    description,
    pictureData,
  };
};

const getGEOB = (data: Uint8Array) => {
  // 4.16 General encapsulated object
  const isUnicode = data[0] === 1;

  const [mimetype, msep] = readText(data, 1, false, true);
  const [fileName, fsep] = readText(data, msep, isUnicode, true);
  const [description, dsep] = readText(data, fsep, isUnicode, true);
  const object = data.slice(dsep);

  return {
    mimetype,
    fileName,
    description,
    object,
  };
};

const UTF_16LE = new TextDecoder("utf-16le");
const UTF_16BE = new TextDecoder("utf-16be");
const ISO_8859_1 = new TextDecoder("iso-8859-1");

const getDecorder = (id: number, bom1?: number, bom2?: number): TextDecoder => {
  if (id === 1 && bom1 === 0xff && bom2 === 0xfe) {
    return UTF_16LE;
  } else if (id === 1 && bom1 === 0xfe && bom2 === 0xff) {
    return UTF_16BE;
  } else {
    return ISO_8859_1;
  }
};

const getSep = (
  data: Uint8Array,
  start: number,
  isUnicode: boolean
): number => {
  if (isUnicode) {
    for (let i = start; i < data.length; i += 2) {
      if (data[i] === 0 && data[i + 1] === 0) {
        return i;
      }
    }
  } else {
    for (let i = start; i < data.length; i++) {
      if (data[i] === 0) {
        return i;
      }
    }
  }
  throw new Error("no separator");
};

/**
 * read text from data start to null character or data end
 * @param data read from
 * @param start start index include
 * @param isUnicode if unicode true
 * @param hasSep if $ 00 or $ 00 00 ends true
 * @returns tuple readed text and next null character index
 */
const readText = (
  data: Uint8Array,
  start: number,
  isUnicode: boolean,
  hasSep: boolean
): [string, number] => {
  const end = hasSep ? getSep(data, start, isUnicode) : undefined;
  const decoder = getDecorder(isUnicode ? 1 : 0, data[start], data[start + 1]);

  const text = decoder.decode(data.slice(start, end));

  if (end === undefined) {
    return [text, data.length];
  } else {
    return [text, end + (isUnicode ? 2 : 1)];
  }
};
