import { parseOnContentType } from "./ParserFactory";
import { findApeFooterOffset } from "./apev2/APEv2Parser";
import { hasID3v1Header } from "./id3v1/ID3v1Parser";
import { getLyricsHeaderLength } from "./lyrics3/Lyrics3";

import type { IAudioMetadata, IOptions, IPrivateOptions } from "./type";
import type { ITokenizer } from "strtok3/lib/core";

/**
 * Parse audio from ITokenizer source
 * @param tokenizer - Audio source implementing the tokenizer interface
 * @param options - Parsing options
 * @returns Metadata
 */
export function parseFromTokenizer(
  tokenizer: ITokenizer,
  options?: IOptions
): Promise<IAudioMetadata> {
  return parseOnContentType(tokenizer, options);
}

export const scanAppendingHeaders = (reader: Uint8Array): IPrivateOptions => {
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
