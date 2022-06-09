import { StringType, UINT32_BE } from "token-types";

import { isBitSet } from "../common/Util";

import { ExtendedLameHeader } from "./ExtendedLameHeader";

import type { IExtendedLameHeader } from "./ExtendedLameHeader";

import type { IGetToken, ITokenizer } from "strtok3/lib/core";

export interface IXingHeaderFlags {
  frames: boolean;
  bytes: boolean;
  toc: boolean;
  vbrScale: boolean;
}

/**
 * Info Tag: Xing, LAME
 */
export const InfoTagHeaderTag = new StringType(4, "ascii");

/**
 * LAME TAG value
 * Did not find any official documentation for this
 * Value e.g.: "3.98.4"
 */
export const LameEncoderVersion = new StringType(6, "ascii");

export interface IXingInfoTag {
  /**
   * total bit stream frames from Vbr header data
   */
  numFrames?: number;

  /**
   * Actual stream size = file size - header(s) size [bytes]
   */
  streamSize?: number;

  toc?: Buffer;

  /**
   * the number of header data bytes (from original file)
   */
  vbrScale?: number;

  lame?: {
    version: string;
    extended?: IExtendedLameHeader;
  };
}

/**
 * Info Tag
 * Ref: http://gabriel.mp3-tech.org/mp3infotag.html
 */
export const XingHeaderFlags: IGetToken<IXingHeaderFlags> = {
  len: 4,

  get: (buf, off) => {
    return {
      frames: isBitSet(buf, off, 31),
      bytes: isBitSet(buf, off, 30),
      toc: isBitSet(buf, off, 29),
      vbrScale: isBitSet(buf, off, 28),
    };
  },
};

// /**
//  * XING Header Tag
//  * Ref: http://gabriel.mp3-tech.org/mp3infotag.html
//  */
export async function readXingHeader(
  tokenizer: ITokenizer
): Promise<IXingInfoTag> {
  const flags = await tokenizer.readToken(XingHeaderFlags);
  const xingInfoTag: IXingInfoTag = {};
  if (flags.frames) {
    xingInfoTag.numFrames = await tokenizer.readToken(UINT32_BE);
  }
  if (flags.bytes) {
    xingInfoTag.streamSize = await tokenizer.readToken(UINT32_BE);
  }
  if (flags.toc) {
    xingInfoTag.toc = Buffer.alloc(100);
    await tokenizer.readBuffer(xingInfoTag.toc);
  }
  if (flags.vbrScale) {
    xingInfoTag.vbrScale = await tokenizer.readToken(UINT32_BE);
  }
  const lameTag = await tokenizer.peekToken(new StringType(4, "ascii"));
  if (lameTag === "LAME") {
    await tokenizer.ignore(4);
    xingInfoTag.lame = {
      version: await tokenizer.readToken(new StringType(5, "ascii")),
    };
    const match = xingInfoTag.lame.version.match(/\d+.\d+/g);
    if (match) {
      const majorMinorVersion = xingInfoTag.lame.version.match(/\d+.\d+/g)[0]; // e.g. 3.97
      const version = majorMinorVersion.split(".").map(n => parseInt(n, 10));
      if (version[0] >= 3 && version[1] >= 90) {
        xingInfoTag.lame.extended = await tokenizer.readToken(
          ExtendedLameHeader
        );
      }
    }
  }
  return xingInfoTag;
}