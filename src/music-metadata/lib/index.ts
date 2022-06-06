import { fromBuffer } from "strtok3";

import { parseFromTokenizer, scanAppendingHeaders } from "./core";

import type { IAudioMetadata, IOptions } from "./type";
import type { IFileInfo } from "strtok3";

/**
 * Parse audio from Node Buffer
 * @param uint8Array - Uint8Array holding audio data
 * @param fileInfo - File information object or MIME-type string
 * @param options - Parsing options
 * @returns Metadata
 * Ref: https://github.com/Borewit/strtok3/blob/e6938c81ff685074d5eb3064a11c0b03ca934c1d/src/index.ts#L15
 */
export async function parseBuffer(
  uint8Array: Uint8Array,
  fileInfo?: IFileInfo | string,
  options: IOptions = {}
): Promise<IAudioMetadata> {
  Object.assign(options, scanAppendingHeaders(uint8Array));

  const tokenizer = fromBuffer(
    uint8Array,
    typeof fileInfo === "string" ? { mimeType: fileInfo } : fileInfo
  );
  return parseFromTokenizer(tokenizer, options);
}
