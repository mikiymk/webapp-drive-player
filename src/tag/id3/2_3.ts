export const readID3v2_3 = (data: Uint8Array): ID3v2 => {
  const hasExtendHeader = readBit(data, 5, 6);

  const size = readSynchsafeInteger(data, 6, 4);

  let extendHeaderSize = 0;
  if (hasExtendHeader) {
    extendHeaderSize = readInteger(data, 10, 4) + 4;
  }
  const tags: ID3v2Frame[] = [];

  let index = 10 + extendHeaderSize;
  while (true) {
    const id = readFixText(data, index, 4);
    if (!/^[0-9A-Z]{4}$/.test(id)) {
      break;
    }

    const frameSize = readInteger(data, index + 4, 4);
    const frameData = data.subarray(index + 10, index + 10 + frameSize);

    const converted = convertData(id, frameData);
    console.log(id, frameData, converted);

    tags.push(converted);

    index += 10 + frameSize;
  }

  return {
    version: "2.3.0",
    tags,
  };
};

const convertData = (id: string, data: Uint8Array): ID3v2Frame => {
  if (id === "UFID") {
    // 4.1 Unique file identifier
    return { id, data: getUFID(data) };
  } else if (id === "TXXX") {
    // 4.2.2 User defined text information frame
    return { id, data: getTXXX(data) };
  } else if (id[0] === "T") {
    // 4.2 Text information frames
    return { id, data: getTEXT(data) };
  } else if (id === "WXXX") {
    // 4.3.2 User defined URL link frame
    return { id, data: getWXXX(data) };
  } else if (id[0] === "W") {
    // 4.3 URL link frames
    return { id, data: getWEXT(data) };
  } else if (id === "IPLS") {
    // 4.4 Involved people list
    return { id, data: getTEXT(data) };
  } else if (id === "MCDI") {
    // 4.5 usic CD identifier
    return { id, data };
  } else if (id === "ETCO") {
    // 4.6 Event timing codes
    return { id, data: getETCO(data) };
  } else if (id === "MLLT") {
    // 4.7 MPEG location lookup table
    return { id, data: getMLLT(data) };
  } else if (id === "SYTC") {
    // 4.8 Synchronised tempo codes
    return { id, data: getSYTC(data) };
  } else if (id === "USLT") {
    // 4.9 Unsychronised lyrics/text transcription
    return { id, data: getCOMM(data) };
  } else if (id === "SYLT") {
    // 4.10 Synchronised lyrics/text
    return { id, data: getSYLT(data) };
  } else if (id === "COMM") {
    // 4.11 Comments
    return { id, data: getCOMM(data) };
  } else if (id === "RVAD") {
    // 4.12 Relative volume adjustment
    return { id, data: getRVAD(data) };
  } else if (id === "EQUA") {
    // 4.13 Equalisation
    return { id, data: getEQUA(data) };
  } else if (id === "RVRB") {
    // 4.14 Reverb
    return { id, data: getRVRB(data) };
  } else if (id === "APIC") {
    // 4.15 Attached picture
    return { id, data: getAPIC(data) };
  } else if (id === "GEOB") {
    // 4.16 General encapsulated object
    return { id, data: getGEOB(data) };
  } else if (id === "PCNT") {
    // 4.17 Play counter
    return { id, data: getPCNT(data) };
  } else if (id === "POPM") {
    // 4.18 Popularimeter
    return { id, data: getPOPM(data) };
  } else if (id === "RBUF") {
    // 4.19 Recommended buffer size
    return { id, data: getRBUF(data) };
  } else if (id === "AENC") {
    // 4.20 Audio encryption
    return { id, data: getAENC(data) };
  } else if (id === "LINK") {
    // 4.21 Linked information
    return { id, data: getLINK(data) };
  } else if (id === "POSS") {
    // 4.22 Position synchronisation frame
    return { id, data: getPOSS(data) };
  } else if (id === "USER") {
    // 4.23 Terms of use frame
    return { id, data: getUSER(data) };
  } else if (id === "OWNE") {
    // 4.24 Ownership frame
    return { id, data: getOWNE(data) };
  } else if (id === "COMR") {
    // 4.25 Commercial frame
    return { id, data: getCOMR(data) };
  } else if (id === "ENCR") {
    // 4.26 Encryption method registration
    return { id, data: getENCR(data) };
  } else if (id === "GRID") {
    // 4.27 Group identification registration
    return { id, data: getGRID(data) };
  } else if (id === "PRIV") {
    // 4.28 Private frame
    return { id, data: getPRIV(data) };
  } else {
    console.warn("unknown tag" + id);
    return { id, data };
  }
};

const getUFID = (data: Uint8Array) => {
  const [ownerIdentifier, sep] = readText(data, 0, false, true);
  const [identifier] = readBinary(data, sep);

  return {
    ownerIdentifier,
    identifier,
  };
};

const getTXXX = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;

  const [description, sep] = readText(data, 1, isUnicode, true);
  const [value] = readText(data, sep, isUnicode, false);

  return {
    description,
    value,
  };
};

const getTEXT = (data: Uint8Array) => {
  const [text] = readText(data, 1, data[0] === 1, false);

  return {
    text,
  };
};

const getWXXX = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;

  const [description, sep] = readText(data, 1, isUnicode, true);
  const [url] = readText(data, sep, false, false);

  return {
    description,
    url,
  };
};

const getWEXT = (data: Uint8Array) => {
  const [url] = readText(data, 0, false, false);

  return {
    url,
  };
};

const getETCO = (data: Uint8Array) => {
  const timestampFormat = data[0];

  const timestamps = [];
  for (let i = 1; i < data.length; i += 5) {
    const eventType = data[i];
    const timestamp = readInteger(data, i + 1, 4);

    timestamps.push({ eventType, timestamp });
  }

  return {
    timestampFormat,
    timestamps,
  };
};

const getMLLT = (data: Uint8Array) => {
  console.warn("MLLT is no support yet");
  return data;
};

const getSYTC = (data: Uint8Array) => {
  const timestampFormat = data[0];
  const tempo = readBinary(data, 1);

  return {
    timestampFormat,
    tempo,
  };
};

const getCOMM = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;

  const language = readFixText(data, 1, 3);
  const [contentDescriptor, sep] = readText(data, 4, isUnicode, true);
  const [text] = readText(data, sep, isUnicode, false);

  return {
    language,
    contentDescriptor,
    text,
  };
};

const getSYLT = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;

  const language = readFixText(data, 1, 3);
  const timestampFormat = data[4];
  const contentType = data[5];

  const [contentDescriptor, sep] = readText(data, 6, isUnicode, true);

  const content: { text: string; timestamp: number }[] = [];
  let startIndex = sep;
  while (true) {
    let text, sep;
    try {
      [text, sep] = readText(data, startIndex, isUnicode, true);
    } catch (error) {
      if (error instanceof Error && error.message === "no separator") {
        break;
      } else {
        throw error;
      }
    }
    const timestamp = readInteger(data, sep, 4);
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

const getRVAD = (data: Uint8Array) => {
  const incrementDecrement = data[0];
  const bit = Math.ceil(data[1] / 8);

  const rerativeVolumeChangeRight = readInteger(data, 2, bit);
  const rerativeVolumeChangeLeft = readInteger(data, 2 + bit, bit);

  const peakVolumeRight = readInteger(data, 2 + bit * 2, bit);
  const peakVolumeLeft = readInteger(data, 2 + bit * 3, bit);

  let rerativeVolumeChangeRightBack,
    rerativeVolumeChangeLeftBack,
    peakVolumeRightBack,
    peakVolumeLeftBack;
  if (data.length >= 2 + bit * 4) {
    rerativeVolumeChangeRightBack = readInteger(data, 2 + bit * 4, bit);
    rerativeVolumeChangeLeftBack = readInteger(data, 2 + bit * 5, bit);

    peakVolumeRightBack = readInteger(data, 2 + bit * 6, bit);
    peakVolumeLeftBack = readInteger(data, 2 + bit * 7, bit);
  }

  let rerativeVolumeChangeCenter, peakVolumeCenter;
  if (data.length >= 2 + bit * 8) {
    rerativeVolumeChangeCenter = readInteger(data, 2 + bit * 8, bit);
    peakVolumeCenter = readInteger(data, 2 + bit * 9, bit);
  }

  let rerativeVolumeChangeBass, peakVolumeBass;
  if (data.length >= 2 + bit * 10) {
    rerativeVolumeChangeBass = readInteger(data, 2 + bit * 10, bit);
    peakVolumeBass = readInteger(data, 2 + bit * 11, bit);
  }

  return {
    incrementDecrement,
    rerativeVolumeChangeRight,
    rerativeVolumeChangeLeft,
    rerativeVolumeChangeRightBack,
    rerativeVolumeChangeLeftBack,
    rerativeVolumeChangeCenter,
    rerativeVolumeChangeBass,
    peakVolumeRight,
    peakVolumeLeft,
    peakVolumeRightBack,
    peakVolumeLeftBack,
    peakVolumeCenter,
    peakVolumeBass,
  };
};

const getEQUA = (data: Uint8Array) => {
  const adjustmentBit = Math.ceil(data[0] / 8);
  const isIncrement = readBit(data, 1, 7);
  const frequency = (data[1] & 0b0111_1111) * 256 + data[2];
  const adjustment = readInteger(data, 3, adjustmentBit);

  return {
    isIncrement,
    frequency,
    adjustment,
  };
};

const getRVRB = (data: Uint8Array) => {
  const reverbLeft = readInteger(data, 0, 2);
  const reverbRight = readInteger(data, 2, 2);
  const reverbBouncesLeft = readInteger(data, 4, 1);
  const reverbBouncesRight = readInteger(data, 5, 1);
  const reverbFeedbackLeftToLeft = readInteger(data, 6, 1);
  const reverbFeedbackLeftToRight = readInteger(data, 7, 1);
  const reverbFeedbackRightToRight = readInteger(data, 8, 1);
  const reverbFeedbackRightToLeft = readInteger(data, 9, 1);
  const premixLeftToRight = readInteger(data, 10, 1);
  const premixRightToLeft = readInteger(data, 11, 1);

  return {
    reverbLeft,
    reverbRight,
    reverbBouncesLeft,
    reverbBouncesRight,
    reverbFeedbackLeftToLeft,
    reverbFeedbackLeftToRight,
    reverbFeedbackRightToRight,
    reverbFeedbackRightToLeft,
    premixLeftToRight,
    premixRightToLeft,
  };
};

const getAPIC = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;

  const [mimetype, msep] = readText(data, 1, false, true);
  const pictureType = data[msep];
  const [description, dsep] = readText(data, msep + 1, isUnicode, true);
  const pictureData = readBinary(data, dsep);

  return {
    mimetype,
    pictureType,
    description,
    pictureData,
  };
};

const getGEOB = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;

  const [mimetype, msep] = readText(data, 1, false, true);
  const [fileName, fsep] = readText(data, msep, isUnicode, true);
  const [description, dsep] = readText(data, fsep, isUnicode, true);
  const object = readBinary(data, dsep);

  return {
    mimetype,
    fileName,
    description,
    object,
  };
};

const getPCNT = (data: Uint8Array) => readInteger(data, 0, data.length);

const getPOPM = (data: Uint8Array) => {
  const [email, sep] = readText(data, 0, false, true);
  const rating = data[sep];
  const counter = readInteger(data, sep + 1, data.length - (sep + 1));

  return {
    email,
    rating,
    counter,
  };
};

const getRBUF = (data: Uint8Array) => {
  const bufferSize = readInteger(data, 0, 3);
  const hasEmbedInfo = readBit(data, 4, 0);
  const offsetToNextTag = readInteger(data, 5, 4);

  return {
    bufferSize,
    hasEmbedInfo,
    offsetToNextTag,
  };
};

const getAENC = (data: Uint8Array) => {
  const [ownerIdentifier, sep] = readText(data, 0, false, true);
  const previewStart = data[sep];
  const previewLength = data[sep + 1];
  const encryptionInfo = readBinary(data, sep + 2);

  return {
    ownerIdentifier,
    previewStart,
    previewLength,
    encryptionInfo,
  };
};

const getLINK = (data: Uint8Array) => {
  const frameIdentifier = readInteger(data, 0, 3);
  const [url, sep] = readText(data, 3, false, true);
  const addtionalData = readText(data, sep, false, false);

  return {
    frameIdentifier,
    url,
    addtionalData,
  };
};

const getPOSS = (data: Uint8Array) => {
  const timestampFormat = data[0];
  const position = readInteger(data, 1, 4);

  return {
    timestampFormat,
    position,
  };
};

const getUSER = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;
  const language = readFixText(data, 1, 3);
  const text = readText(data, 4, isUnicode, false);

  return {
    language,
    text,
  };
};

const getOWNE = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;
  const [pricePayed, sep] = readText(data, 1, false, true);
  const dateOfPurch = readFixText(data, sep, 8);
  const [sellor] = readText(data, sep + 8, isUnicode, false);

  return {
    pricePayed,
    dateOfPurch,
    sellor,
  };
};

const getCOMR = (data: Uint8Array) => {
  const isUnicode = data[0] === 1;
  const [price, psep] = readText(data, 1, false, true);
  const validUntil = readFixText(data, psep, 8);
  const [contactUrl, csep] = readText(data, psep + 8, false, true);
  const receivedAs = data[csep];
  const [nameOfSeller, nsep] = readText(data, csep + 1, isUnicode, true);
  const [description, dsep] = readText(data, nsep, isUnicode, true);
  const [mimetype, msep] = readText(data, dsep, false, true);
  const sellerLogo = readBinary(data, msep);

  return {
    price,
    validUntil,
    contactUrl,
    receivedAs,
    nameOfSeller,
    description,
    mimetype,
    sellerLogo,
  };
};

const getENCR = (data: Uint8Array) => {
  const [ownerIdentifier, sep] = readText(data, 0, false, true);
  const methodSymbol = data[sep];
  const encryptionData = readBinary(data, sep + 1);

  return {
    ownerIdentifier,
    methodSymbol,
    encryptionData,
  };
};

const getGRID = (data: Uint8Array) => {
  const [ownerIdentifier, sep] = readText(data, 0, false, true);
  const groupSymbol = data[sep];
  const groupDependentData = readBinary(data, sep + 1);

  return {
    ownerIdentifier,
    groupSymbol,
    groupDependentData,
  };
};

const getPRIV = (data: Uint8Array) => {
  const [ownerIdentifier, sep] = readText(data, 0, false, true);
  const privateData = readBinary(data, sep);

  return {
    ownerIdentifier,
    privateData,
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

  const text = decoder.decode(data.subarray(start, end));

  if (end === undefined) {
    return [text, data.length];
  } else {
    return [text, end + (isUnicode ? 2 : 1)];
  }
};

const readFixText = (data: Uint8Array, start: number, length: number) => {
  return ISO_8859_1.decode(data.subarray(start, start + length));
};

const readInteger = (data: Uint8Array, start: number, length: number) => {
  let num = 0;
  for (let i = 0; i < length; i++) {
    num = (num << 8) + data[start + i];
  }
  return num;
};

const readSynchsafeInteger = (
  data: Uint8Array,
  start: number,
  length: number
) => {
  let num = 0;
  for (let i = 0; i < length; i++) {
    num = (num << 7) + data[start + i];
  }
  return num;
};

const readBinary = (data: Uint8Array, start: number, end?: number) => {
  return data.slice(start, end);
};

/**
 * read bit from data.
 *
 *     %xxxxxxxx
 *      76543210
 *      ^      ^
 *       \      \
 *        \       0 is Least Significant Bit
 *         7 is Most Significant Bit
 *
 * @param data read from the data array
 * @param index read data index
 * @param bit bit number between 0-7
 * @returns bit 1 true, bit 0 false
 */
const readBit = (data: Uint8Array, index: number, bit: number) => {
  if (bit < 0 || 7 < bit) {
    throw new Error(`bit number in 0-7 but ${bit}`);
  }

  return 0 !== (data[index] & (1 << bit));
};
