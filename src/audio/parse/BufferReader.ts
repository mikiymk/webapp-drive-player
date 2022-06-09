import { EndOfStreamError } from "~/music-metadata/lib/strtok3";

export type BufferReader = {
  readonly view: DataView;
  readonly array: Uint8Array;

  pos: number;
};

export const getReader = (buffer: ArrayBuffer): BufferReader => {
  return {
    view: new DataView(buffer),
    array: new Uint8Array(buffer),

    pos: 0,
  };
};

export const restLength = (reader: BufferReader) => {
  return reader.view.byteLength - reader.pos;
};

export const ensureRestLength = (reader: BufferReader, length: number) => {
  if (reader.view.byteLength <= reader.pos + length) {
    throw new EndOfStreamError();
  }
};

export const seek = (reader: BufferReader, length: number) => {
  ensureRestLength(reader, length);

  reader.pos += length;
};

export const peekBuffer = (
  reader: BufferReader,
  length: number
): Uint8Array => {
  length = Math.min(length, restLength(reader));
  return reader.array.subarray(reader.pos, reader.pos + length);
};

export const readSubBuffer = (
  reader: BufferReader,
  length: number
): BufferReader => {
  ensureRestLength(reader, length);

  const subBuffer = {
    view: new DataView(reader.view.buffer, reader.pos, length),
    array: reader.array.subarray(reader.pos, reader.pos + length),
    pos: 0,
  };

  reader.pos += length;

  return subBuffer;
};

const decoder = new TextDecoder("l1");
export const readString = (reader: BufferReader, length: number): string => {
  ensureRestLength(reader, length);

  const read = reader.array.subarray(reader.pos, reader.pos + length);
  reader.pos += length;

  return decoder.decode(read);
};

const INT8_SIZE = 1;
const INT16_SIZE = 2;
const INT32_SIZE = 4;

export const readI8 = (reader: BufferReader): number => {
  ensureRestLength(reader, INT8_SIZE);

  const read = reader.view.getInt8(reader.pos);
  reader.pos += INT8_SIZE;

  return read;
};

export const readBits = (
  reader: BufferReader
): [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean] => {
  const read = readI8(reader);

  return [
    (read & (1 << 0)) !== 0,
    (read & (1 << 1)) !== 0,
    (read & (1 << 2)) !== 0,
    (read & (1 << 3)) !== 0,
    (read & (1 << 4)) !== 0,
    (read & (1 << 5)) !== 0,
    (read & (1 << 6)) !== 0,
    (read & (1 << 7)) !== 0,
  ];
};

export const readU32BE = (reader: BufferReader): number => {
  ensureRestLength(reader, INT32_SIZE);

  const read = reader.view.getUint32(reader.pos);
  reader.pos += INT32_SIZE;

  return read;
};

export const readU32LE = (reader: BufferReader): number => {
  ensureRestLength(reader, INT32_SIZE);

  const read = reader.view.getUint32(reader.pos, true);
  reader.pos += INT32_SIZE;

  return read;
};

export const readU32SyncSafe = (reader: BufferReader): number => {
  ensureRestLength(reader, INT32_SIZE);

  const read =
    (reader.view.getUint8(reader.pos + 3) & 0x7f) |
    (reader.view.getUint8(reader.pos + 2) << 7) |
    (reader.view.getUint8(reader.pos + 1) << 14) |
    (reader.view.getUint8(reader.pos) << 21);
  reader.pos += INT32_SIZE;

  return read;
};
