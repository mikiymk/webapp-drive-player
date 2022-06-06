import { randomRead } from "../common/RandomUint8ArrayReader";
import { decoder, ENCODING_ASCII, uint8array } from "../common/Util";

export const endTag2 = "LYRICS200";

export const getLyricsHeaderLength = (reader: Uint8Array): number => {
  if (reader.byteLength >= 143) {
    const buf = uint8array(15);
    randomRead(reader, buf, 0, buf.length, reader.byteLength - 143);
    const txt = decoder(ENCODING_ASCII).decode(buf);
    const tag = txt.substring(6);
    if (tag === endTag2) {
      return parseInt(txt.substring(0, 6), 10) + 15;
    }
  }
  return 0;
};
