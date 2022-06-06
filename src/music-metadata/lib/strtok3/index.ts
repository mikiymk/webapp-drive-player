import { BufferTokenizer } from "./BufferTokenizer";

export { EndOfStreamError } from "./EndOfStreamError";

export type {
  Tokenizer as ITokenizer,
  FileInfo as IFileInfo,
  Token as IToken,
  GetToken as IGetToken,
} from "./types";

/**
 * Construct ReadStreamTokenizer from given Buffer.
 * @param uint8Array - Uint8Array to tokenize
 * @returns BufferTokenizer
 */
export function fromBuffer(uint8Array: Uint8Array): BufferTokenizer {
  return new BufferTokenizer(uint8Array);
}
