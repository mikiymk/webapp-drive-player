export interface FileInfo {
  /**
   * File size in bytes
   */
  size?: number;
}

export interface ReadChunkOptions {
  /**
   * The offset in the buffer to start writing at; default is 0
   */
  offset?: number;

  /**
   * Number of bytes to read.
   */
  length?: number;

  /**
   * Position where to begin reading from the file.
   * Default it is `tokenizer.position`.
   * Position may not be less then `tokenizer.position`.
   */
  position?: number;

  /**
   * If set, will not throw an EOF error if not all of the requested data could be read
   */
  mayBeLess?: boolean;
}

/**
 * The tokenizer allows us to read or peek from the tokenizer-stream.
 * The tokenizer-stream is an abstraction of a stream, file or Buffer.
 */
export interface Tokenizer {
  /**
   * Provide access to information of the underlying information stream or file.
   */
  fileInfo: FileInfo;

  /**
   * Offset in bytes (= number of bytes read) since beginning of file or stream
   */
  position: number;

  /**
   * Peek (read ahead) buffer from tokenizer
   * @param buffer - Target buffer to fill with data peek from the tokenizer-stream
   * @param options - Read behaviour options
   * @returns Promise with number of bytes read
   */
  peekBuffer(
    buffer: Uint8Array,
    options?: ReadChunkOptions | undefined
  ): Promise<number>;

  /**
   * Read buffer from tokenizer
   * @param buffer - Target buffer to fill with data peeked from the tokenizer-stream
   * @param options - Additional read options
   * @returns Promise with number of bytes read
   */
  readBuffer(
    buffer: Uint8Array,
    options?: ReadChunkOptions | undefined
  ): Promise<number>;

  /**
   * Peek a token from the tokenizer-stream.
   * @param token - Token to peek from the tokenizer-stream.
   * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
   * @returns Promise with token data
   */
  peekToken<T>(token: GetToken<T>, position?: number): Promise<T>;

  /**
   * Read a token from the tokenizer-stream.
   * @param token - Token to peek from the tokenizer-stream.
   * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
   * @returns Promise with token data
   */
  readToken<T>(token: GetToken<T>, position?: number): Promise<T>;

  /**
   * Peek a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  peekNumber(token: GetToken<number>): Promise<number>;

  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  readNumber(token: GetToken<number>): Promise<number>;

  /**
   * Ignore number of bytes, advances the pointer in under tokenizer-stream.
   * @param length - Number of bytes ignored
   * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
   */
  ignore(length: number): Promise<number>;

  /**
   * Clean up resources.
   * It does not close the stream for StreamReader, but is does close the file-descriptor.
   */
  close(): Promise<void>;
}

/**
 * Read-only token
 * See https://github.com/Borewit/strtok3 for more information
 */
export interface GetToken<T, Array extends Uint8Array = Uint8Array> {
  /**
   * Length of encoded token in bytes
   */
  len: number;

  /**
   * Decode value from buffer at offset
   * @param array - Uint8Array to read the decoded value from
   * @param offset - Decode offset
   * @return decoded value
   */
  get(array: Array, offset: number): T;
}

export interface Token<T, Array extends Uint8Array = Uint8Array>
  extends GetToken<T, Array> {
  /**
   * Encode value to buffer
   * @param array - Uint8Array to write the encoded value to
   * @param offset - Buffer write offset
   * @param value - Value to decode of type T
   * @return offset plus number of bytes written
   */
  put(array: Array, offset: number, value: T): number;
}
