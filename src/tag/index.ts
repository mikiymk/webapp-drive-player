import { readTagFromData as readID3 } from "./id3/index";
import { TagInfo } from "./id3/type";

export const readTagFromData = (data: ArrayBuffer): TagInfo => {
  return readID3(data);
};
