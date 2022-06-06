import { UINT64_LE, INT64_LE, INT32_LE } from "token-types";

import { FourCcToken } from "../common/FourCC";

import type { IGetToken } from "strtok3/lib/core";

/**
 * Common interface for the common chunk DSD header
 */
export interface IChunkHeader {
  /**
   * Chunk ID
   */
  id: string;

  /**
   * Chunk size
   */
  size: bigint;
}

/**
 * Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
 */
export const ChunkHeader: IGetToken<IChunkHeader> = {
  len: 12,

  get: (buf: Uint8Array, off: number): IChunkHeader => {
    return {
      id: FourCcToken.get(buf, off),
      size: UINT64_LE.get(buf, off + 4),
    };
  },
};

/**
 * Interface to DSD payload chunk
 */
export interface IDsdChunk {
  /**
   * Total file size
   */
  fileSize: bigint;

  /**
   * If Metadata doesn’t exist, set 0. If the file has ID3v2 tag, then set the pointer to it.
   * ID3v2 tag should be located in the end of the file.
   */
  metadataPointer: bigint;
}

/**
 * Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
 */
export const DsdChunk: IGetToken<IDsdChunk> = {
  len: 16,

  get: (buf: Uint8Array, off: number): IDsdChunk => {
    return {
      fileSize: INT64_LE.get(buf, off),
      metadataPointer: INT64_LE.get(buf, off + 8),
    };
  },
};

export enum ChannelType {
  mono = 1,
  stereo = 2,
  channels = 3,
  quad = 4,
  "4 channels" = 5,
  "5 channels" = 6,
  "5.1 channels" = 7,
}

/**
 * Interface to format chunk payload chunk
 */
export interface IFormatChunk {
  /**
   * Version of this file format
   */
  formatVersion: number;

  /**
   * Format ID
   */
  formatID: number;

  /**
   * Channel Type
   */
  channelType: ChannelType;

  /**
   * Channel num
   */
  channelNum: number;

  /**
   * Sampling frequency
   */
  samplingFrequency: number;

  /**
   * Bits per sample
   */
  bitsPerSample: number;

  /**
   * Sample count
   */
  sampleCount: bigint;

  /**
   * Block size per channel
   */
  blockSizePerChannel: number;
}

/**
 * Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
 */
export const FormatChunk: IGetToken<IFormatChunk> = {
  len: 40,

  get: (buf: Buffer, off: number): IFormatChunk => {
    return {
      formatVersion: INT32_LE.get(buf, off),
      formatID: INT32_LE.get(buf, off + 4),
      channelType: INT32_LE.get(buf, off + 8),
      channelNum: INT32_LE.get(buf, off + 12),
      samplingFrequency: INT32_LE.get(buf, off + 16),
      bitsPerSample: INT32_LE.get(buf, off + 20),
      sampleCount: INT64_LE.get(buf, off + 24),
      blockSizePerChannel: INT32_LE.get(buf, off + 32),
    };
  },
};
