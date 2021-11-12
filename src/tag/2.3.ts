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
    // 4.2 Text information frames
    const decoder = getDecorder(data[0], data[1], data[2]);
    const isUnicode = data[0] === 1;
    const text = decoder.decode(data.slice(isUnicode ? 3 : 1));

    return {
      id,
      data: text,
    };
  } else if (id === "WXXX") {
    // 4.3.2 User defined URL link frame
    const decoder = getDecorder(data[0], data[1], data[2]);
    const isUnicode = data[0] === 1;
    const sepIndex = getSep(data, 1, isUnicode);
    if (sepIndex === -1) {
      throw new Error("WXXX has no separator");
    }

    const description = decoder.decode(data.slice(isUnicode ? 3 : 1, sepIndex));
    const url = String.fromCharCode(...data.slice(sepIndex + 1));

    return {
      id,
      data: { description, url },
    };
  } else if (id[0] === "W") {
    // 4.3 URL link frames
    const sepIndex = data.indexOf(0);

    let url;
    if (sepIndex === -1) {
      url = String.fromCharCode(...data);
    } else {
      url = String.fromCharCode(...data.slice(0, sepIndex));
    }

    return {
      id,
      data: url,
    };
  } else if (id === "USLT" || id === "COMM") {
    // 4.9 Unsychronised lyrics/text transcription
    const decoder = getDecorder(data[0], data[4], data[5]);
    const isUnicode = data[0] === 1;
    const sepIndex = getSep(data, 4, isUnicode);
    if (sepIndex === -1) {
      throw new Error("USLT has no separator");
    }
    const language = String.fromCharCode(data[1], data[2], data[3]);
    const contentDescriptor = decoder.decode(
      data.slice(isUnicode ? 3 : 1, sepIndex)
    );
    const text = decoder.decode(data.slice(sepIndex + (isUnicode ? 2 : 1)));

    return {
      id,
      data: {
        language,
        contentDescriptor,
        text,
      },
    };
  } else if (id === "SYLT") {
    // 4.10 Synchronised lyrics/text
    const decoder = getDecorder(data[0], data[6], data[7]);
    const isUnicode = data[0] === 1;
    const sepIndex = getSep(data, 6, isUnicode);
    if (sepIndex === -1) {
      throw new Error("SYLT has no separator");
    }

    const language = String.fromCharCode(data[1], data[2], data[3]);
    const timestampFormat = data[4];
    const contentType = data[5];

    const contentDescriptor = decoder.decode(
      data.slice(isUnicode ? 3 : 1, sepIndex)
    );

    const sepLength = isUnicode ? 2 : 1;

    const content: { text: string; timestamp: number }[] = [];
    let startIndex = sepIndex + sepLength;
    while (true) {
      const sepIndex = getSep(data, startIndex, isUnicode);
      if (sepIndex === -1) {
        break;
      }

      const text = decoder.decode(data.slice(startIndex, sepIndex));
      const timestamp =
        data[sepIndex + sepLength + 0] * 256 ** 3 +
        data[sepIndex + sepLength + 1] * 256 ** 2 +
        data[sepIndex + sepLength + 2] * 256 ** 1 +
        data[sepIndex + sepLength + 3] * 256 ** 0;
      content.push({ text, timestamp });

      startIndex = sepIndex + sepLength + 4;
    }
    return {
      id,
      data: {
        language,
        timestampFormat,
        contentType,
        contentDescriptor,
        content,
      },
    };
  } else if (id === "APIC") {
    const decoder = getDecorder(data[0], data[6], data[7]);
    const isUnicode = data[0] === 1;
    const mimetypeSepIndex = getSep(data, 1, false);
    if (mimetypeSepIndex === -1) {
      throw new Error("APIC has no separator");
    }
    const descriptionSepIndex = getSep(data, mimetypeSepIndex + 2, isUnicode);
    if (mimetypeSepIndex === -1) {
      throw new Error("APIC has no separator");
    }

    const mimetype = String.fromCharCode(...data.slice(1, mimetypeSepIndex));
    const pictureType = data[mimetypeSepIndex + 1];
    const description = decoder.decode(
      data.slice(mimetypeSepIndex + 2, descriptionSepIndex)
    );
    const pictureData = data.slice(descriptionSepIndex + (isUnicode ? 2 : 1));

    return {
      id,
      data: {
        mimetype,
        pictureType,
        description,
        pictureData,
      },
    };
  } else if (id === "GEOB") {
    const decoder = getDecorder(data[0], data[6], data[7]);
    const isUnicode = data[0] === 1;
    const sepLength = isUnicode ? 2 : 1;
    const mimetypeSepIndex = getSep(data, 1, false);
    if (mimetypeSepIndex === -1) {
      throw new Error("GEOB has no separator");
    }
    const fileNameSepIndex = getSep(data, mimetypeSepIndex + 1, isUnicode);
    if (fileNameSepIndex === -1) {
      throw new Error("GEOB has no separator");
    }
    const descriptionSepIndex = getSep(
      data,
      fileNameSepIndex + sepLength,
      isUnicode
    );
    if (descriptionSepIndex === -1) {
      throw new Error("GEOB has no separator");
    }

    const mimetype = String.fromCharCode(...data.slice(1, mimetypeSepIndex));
    const fileName = decoder.decode(
      data.slice(mimetypeSepIndex + 1, fileNameSepIndex)
    );
    const description = decoder.decode(
      data.slice(fileNameSepIndex + sepLength, descriptionSepIndex)
    );
    const object = data.slice(descriptionSepIndex + sepLength);

    return {
      id,
      data: {
        mimetype,
        fileName,
        description,
        object,
      },
    };
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

const readText = (
  data: Uint8Array,
  start: number,
  isUnicode: boolean,
  hasSep: boolean
): [string, number] => {
  const end = hasSep
    ? getSep(data, start, isUnicode) + (isUnicode ? 2 : 1)
    : undefined;
  const decoder = getDecorder(isUnicode ? 1 : 0, data[start], data[start + 1]);

  const text = decoder.decode(data.slice(start, end));

  return [text, end ?? data.length];
};
