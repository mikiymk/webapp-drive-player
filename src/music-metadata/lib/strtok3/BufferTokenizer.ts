import { EndOfStreamError } from "./EndOfStreamError";

import type {
  Tokenizer,
  FileInfo,
  ReadChunkOptions,
  GetToken,
  Token,
} from "./types";

interface INormalizedReadChunkOptions extends ReadChunkOptions {
  offset: number;
  length: number;
  position: number;
  mayBeLess?: boolean;
}

export class BufferTokenizer implements Tokenizer {
  public fileInfo: FileInfo;
  public position = 0;
  private numBuffer = new Uint8Array(8);

  /**
   * Construct BufferTokenizer
   * @param uint8Array - Uint8Array to tokenize
   */
  constructor(private uint8Array: Uint8Array) {
    this.fileInfo = { size: uint8Array.length };
  }

  public async peekBuffer(
    uint8Array: Uint8Array,
    options?: ReadChunkOptions
  ): Promise<number> {
    const normOptions = this.normalizeOptions(uint8Array, options);

    const bytes2read = Math.min(
      this.uint8Array.length - normOptions.position,
      normOptions.length
    );
    if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
      throw new EndOfStreamError();
    } else {
      uint8Array.set(
        this.uint8Array.subarray(
          normOptions.position,
          normOptions.position + bytes2read
        ),
        normOptions.offset
      );
      return bytes2read;
    }
  }

  public async readBuffer(
    uint8Array: Uint8Array,
    options?: ReadChunkOptions
  ): Promise<number> {
    if (options && options.position) {
      if (options.position < this.position) {
        throw new Error(
          "`options.position` must be equal or greater than `tokenizer.position`"
        );
      }
      this.position = options.position;
    }

    const bytesRead = await this.peekBuffer(uint8Array, options);
    this.position += bytesRead;
    return bytesRead;
  }

  public async peekToken<Value>(
    token: GetToken<Value>,
    position: number = this.position
  ): Promise<Value> {
    const uint8Array = Buffer.alloc(token.len);
    const len = await this.peekBuffer(uint8Array, { position });
    if (len < token.len) throw new EndOfStreamError();
    return token.get(uint8Array, 0);
  }

  public async readToken<Value>(
    token: GetToken<Value>,
    position: number = this.position
  ): Promise<Value> {
    const uint8Array = Buffer.alloc(token.len);
    const len = await this.readBuffer(uint8Array, { position });
    if (len < token.len) throw new EndOfStreamError();
    return token.get(uint8Array, 0);
  }

  public async peekNumber(token: Token<number>): Promise<number> {
    const len = await this.peekBuffer(this.numBuffer, { length: token.len });
    if (len < token.len) throw new EndOfStreamError();
    return token.get(this.numBuffer, 0);
  }

  public async readNumber(token: Token<number>): Promise<number> {
    const len = await this.readBuffer(this.numBuffer, { length: token.len });
    if (len < token.len) throw new EndOfStreamError();
    return token.get(this.numBuffer, 0);
  }

  public async ignore(length: number): Promise<number> {
    const bytesLeft = this.uint8Array.length - this.position;
    if (length > bytesLeft) {
      this.position += bytesLeft;
      return bytesLeft;
    }

    this.position += length;
    return length;
  }

  public async close(): Promise<void> {
    // empty
  }

  protected normalizeOptions(
    uint8Array: Uint8Array,
    options?: ReadChunkOptions
  ): INormalizedReadChunkOptions {
    if (
      options &&
      options.position !== undefined &&
      options.position < this.position
    ) {
      throw new Error(
        "`options.position` must be equal or greater than `tokenizer.position`"
      );
    }

    if (options) {
      return {
        mayBeLess: options.mayBeLess === true,
        offset: options.offset ? options.offset : 0,
        length: options.length
          ? options.length
          : uint8Array.length - (options.offset ? options.offset : 0),
        position: options.position ? options.position : this.position,
      };
    }

    return {
      mayBeLess: false,
      offset: 0,
      length: uint8Array.length,
      position: this.position,
    };
  }
}
