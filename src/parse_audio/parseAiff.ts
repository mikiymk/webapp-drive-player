import {
  getReader,
  readString,
  readSubBuffer,
  readU32BE,
  restLength,
  seek,
} from "./BufferReader";

import { EndOfStreamError, InvalidFormatError } from "./errors";

import type { BufferReader } from "./BufferReader";

import type { Tags } from "./type";

export const parseAiff = (buffer: ArrayBuffer): Tags => {
  const reader = getReader(buffer);
  const tags: Tags = {};

  const header = readChunkHeader(reader);
  if (header.id !== "FORM") {
    // Not AIFF format
    throw new InvalidFormatError(header.id);
  }

  const type = readFourCC(reader);
  if (type === "AIFC" || type === "AIFF") throw new InvalidFormatError(type);

  try {
    while (restLength(reader) >= ChunkHeaderLength) {
      const chunkHeader = readChunkHeader(reader);

      const chunkData = readChunkData(reader, chunkHeader);
      Object.assign(tags, chunkData);
    }
  } catch (error) {
    if (!(error instanceof EndOfStreamError)) {
      throw error;
    }
  }

  return tags;
};

type ChunkHeader = { id: string; size: number };
const ChunkHeaderLength = 8;
const readChunkHeader = (reader: BufferReader): ChunkHeader => {
  const id = readFourCC(reader);
  const size = readU32BE(reader);

  return { id, size };
};

const readChunkData = (reader: BufferReader, header: ChunkHeader) => {
  if (header.id === "ID3 ") {
    const id3Data = readSubBuffer(reader, header.size);
    return parseID3v2(id3Data);
  } else {
    const nextChunk = 2 * Math.round(header.size / 2);
    seek(reader, nextChunk);
  }
};

const validFourCC = /^[\x21-\x7e©][\x20-\x7e\0()]{3}/;
const readFourCC = (reader: BufferReader): string => {
  const id = readString(reader, 4);

  if (!validFourCC.test(id)) {
    throw new Error(invalidFormat + id);
  }

  return id;
};
