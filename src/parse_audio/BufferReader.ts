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

export const readSubBuffer = (
  reader: BufferReader,
  length: number
): BufferReader => {
  ensureRestLength(reader, length);

  return {
    view: new DataView(reader.view.buffer, reader.pos, length),
    array: reader.array.subarray(reader.pos, reader.pos + length),
    pos: 0,
  };
};

const decoder = new TextDecoder("l1");
export const readString = (reader: BufferReader, length: number): string => {
  ensureRestLength(reader, length);

  const read = reader.array.subarray(reader.pos, reader.pos + length);
  reader.pos += length;

  return decoder.decode(read);
};

export const readU32BE = (reader: BufferReader): number => {
  ensureRestLength(reader, 4);

  const read = reader.view.getUint32(reader.pos);
  reader.pos += 4;

  return read;
};

export const readU32LE = (reader: BufferReader): number => {
  ensureRestLength(reader, 4);

  const read = reader.view.getUint32(reader.pos, true);
  reader.pos += 4;

  return read;
};
