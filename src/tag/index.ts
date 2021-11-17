import { readTagFromData as readID3 } from "./id3/index";

export const readTagFromData = (data: ArrayBuffer): TagInfo => {
  return readID3(data);
};
