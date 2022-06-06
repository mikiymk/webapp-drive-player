import { parseOnContentType } from "./ParserFactory";
import { findApeFooterOffset } from "./apev2/APEv2Parser";
import { hasID3v1Header } from "./id3v1/ID3v1Parser";
import { getLyricsHeaderLength } from "./lyrics3/Lyrics3";
import { fromBuffer } from "./strtok3";

import type { IAudioMetadata, IOptions, IPrivateOptions } from "./type";

import type { ITokenizer } from "strtok3/lib/core";

/**
 * Parse audio from Node Buffer
 * @param buffer - Uint8Array holding audio data
 * @returns Metadata
 * Ref: https://github.com/Borewit/strtok3/blob/e6938c81ff685074d5eb3064a11c0b03ca934c1d/src/index.ts#L15
 */
export async function parseBuffer(
  buffer: ArrayBuffer
): Promise<IAudioMetadata> {
  const uint8 = new Uint8Array(buffer);
  const options = scanAppendingHeaders(uint8);
  const tokenizer = fromBuffer(uint8);

  return parseFromTokenizer(tokenizer, options);
}

/**
 * Parse audio from ITokenizer source
 * @param tokenizer - Audio source implementing the tokenizer interface
 * @param options - Parsing options
 * @returns Metadata
 */
const parseFromTokenizer = (
  tokenizer: ITokenizer,
  options?: IOptions
): Promise<IAudioMetadata> => {
  return parseOnContentType(tokenizer, options);
};

const scanAppendingHeaders = (reader: Uint8Array): IPrivateOptions => {
  let apeOffset = reader.byteLength;
  if (hasID3v1Header(reader)) {
    apeOffset -= 128;
    const lyricsLen = getLyricsHeaderLength(reader);
    apeOffset -= lyricsLen;
  }

  const options: IPrivateOptions = {};
  options.apeHeader = findApeFooterOffset(reader, apeOffset);

  return options;
};
