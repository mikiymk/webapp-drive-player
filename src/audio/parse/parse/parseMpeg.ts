import {
  getReader,
  peekBuffer,
  readBits,
  readI8,
  readString,
  readU32SyncSafe,
  seek,
} from "./BufferReader";
import { EndOfStreamError } from "./errors";

import type { BufferReader } from "./BufferReader";

import type { Tags } from "./type";

/**
 * MPEGファイル (ID3タグ)
 */
export const parseMpeg = (buffer: ArrayBuffer): Tags => {
  const reader = getReader(buffer);
  const tags: Tags = {};

  try {
    let header;
    do {
      header = readId3v2Headers(reader);
      if (header === "ID3") {
        Object.assign<Tags, Tags>(tags, parseId3v2(reader));
      }
    } while (header === "ID3");

    postId3v2Parse(reader);

    if (Object.values(tags).filter(v => v).length === 0) {
      Object.assign(tags, parseId3v1(reader));
    }
    this.finalize();
  } catch (err) {
    if (err instanceof EndOfStreamError) {
      throw err;
    }
  }

  return tags;
};

const readId3v2Headers = (reader: BufferReader): string => {
  const fileIdentifier = readString(reader, 3);
  seek(reader, 7);

  // const versionMajor = readI8(reader);
  // const versionMinor = readI8(reader);

  // const bits = readBits(reader);
  // const unsynchronisation = bits[7];
  // const isExtendedHeader = bits[6];
  // const expIndicator = bits[5];
  // const footer = bits[4];

  // const size = readU32SyncSafe(reader);

  return fileIdentifier;
};

const postId3v2Parse = (reader: BufferReader) => {
  try {
    let quit = false;
    while (!quit) {
      sync(reader);
      quit = parseCommonMpegHeader(reader);
    }
  } catch (err) {
    if (!(err instanceof EndOfStreamError)) {
      throw err;
    }
  }
};

/** 0xff_e0 (mask 0xff_e0) の出現位置まで進む */
const sync = (reader: BufferReader) => {
  const MAX_PEEK_LENGTH = 1024;
  const SyncByte = 0xff;
  let gotFirstSync = false;

  // todo 一重ループにしたい
  while (true) {
    const syncPeekBuffer = peekBuffer(reader, MAX_PEEK_LENGTH);

    if (syncPeekBuffer.byteLength <= 163) {
      throw new EndOfStreamError();
    }

    let byteOffset = syncPeekBuffer.indexOf(SyncByte);

    while (true) {
      // 同期用バイトの次位置を見る
      const peekByte = syncPeekBuffer[byteOffset];
      if (gotFirstSync && peekByte && (peekByte & 0xe0) === 0xe0) {
        // 終了処理

        seek(reader, byteOffset - 1);
        return; // sync
      }

      gotFirstSync = false;
      // 同期用バイト位置を探す
      byteOffset = syncPeekBuffer.indexOf(SyncByte, byteOffset);
      if (byteOffset === -1) {
        // なかったら
        if (syncPeekBuffer.byteLength < MAX_PEEK_LENGTH) {
          throw new EndOfStreamError();
        }
        // 位置を進めて次へ
        seek(reader, syncPeekBuffer.byteLength);
        break; // continue with next buffer
      }

      // あったら同期用バイトの次位置を見る
      ++byteOffset;
      gotFirstSync = true;
    }
  }
};

const parseCommonMpegHeader = async (reader: BufferReader, object: Object) => {
  buf_frame_header[0] = SyncByte;
  buf_frame_header[1] = peekByte;

  if (syncFrameCount === frameCount) {
    frameCount = 0;
    frame_size = 0;
    mpegOffset = reader.pos;
  }
  syncFrameCount = frameCount;

  const buf_frame_header = peekBuffer(reader, 4);

  let header: MpegFrameHeader;
  try {
    header = parseMpegFrameHeader(buf_frame_header);
  } catch {
    seek(reader, 1);
    return false; // sync
  }
  seek(reader, 4);

  this.frameCount++;
  return header.version >= 2 && header.layer === 0
    ? this.parseAdts(header)
    : this.parseAudioFrameHeader(header);
};

const parseMpegFrameHeader = (reader: BufferReader) => {
  // B(20,19): MPEG Audio versionIndex ID
  this.versionIndex = getBitAllignedNumber(buf, off + 1, 3, 2);
  // C(18,17): Layer description
  this.layer =
    MpegFrameHeader.LayerDescription[getBitAllignedNumber(buf, off + 1, 5, 2)];

  if (this.versionIndex > 1 && this.layer === 0) {
    this.parseAdtsHeader(buf, off); // Audio Data Transport Stream (ADTS)
  } else {
    this.parseMpegHeader(buf, off); // Conventional MPEG header
  }

  // D(16): Protection bit (if true 16-bit CRC follows header)
  this.isProtectedByCRC = !isBitSet(buf, off + 1, 7);
};
