import { UINT64_LE } from "token-types";

import { stripNulls, decodeString } from "../common/Util";

import type { DataType } from "./AsfObject";

export type AttributeParser = (
  buf: Buffer
) => boolean | string | number | bigint | Buffer;

export class AsfUtil {
  public static getParserForAttr(i: DataType): AttributeParser {
    return AsfUtil.attributeParsers[i];
  }

  public static parseUnicodeAttr(uint8Array: Uint8Array): string {
    return stripNulls(decodeString(uint8Array, "utf16le"));
  }

  private static attributeParsers: AttributeParser[] = [
    AsfUtil.parseUnicodeAttr,
    AsfUtil.parseByteArrayAttr,
    AsfUtil.parseBoolAttr,
    AsfUtil.parseDWordAttr,
    AsfUtil.parseQWordAttr,
    AsfUtil.parseWordAttr,
    AsfUtil.parseByteArrayAttr,
  ];

  private static parseByteArrayAttr(buf: Uint8Array): Buffer {
    return Buffer.from(buf);
  }

  private static parseBoolAttr(buf: Buffer, offset = 0): boolean {
    return AsfUtil.parseWordAttr(buf, offset) === 1;
  }

  private static parseDWordAttr(buf: Buffer, offset = 0): number {
    return buf.readUInt32LE(offset);
  }

  private static parseQWordAttr(buf: Buffer, offset = 0): bigint {
    return UINT64_LE.get(buf, offset);
  }

  private static parseWordAttr(buf: Buffer, offset = 0): number {
    return buf.readUInt16LE(offset);
  }
}
