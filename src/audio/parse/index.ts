import { parseFileType } from "./fileType";
import { parseAiff } from "./parse/parseAiff";
import { parseMpeg } from "./parse/parseMpeg";

import type { Tags } from "./type";

export const parseBuffer = (buffer: ArrayBuffer): Tags => {
  const view = new DataView(buffer);
  const fileType = parseFileType(view);

  switch (fileType) {
    case "aiff":
      return parseAiff(buffer);
    case "adts":
    case "mpeg":
      return parseMpeg(buffer);
    case "apev2":
      return new APEv2Parser();
    case "asf":
      return new AsfParser();
    case "dsf":
      return new DsfParser();
    case "flac":
      return new FlacParser();
    case "mp4":
      return new MP4Parser();
    case "musepack":
      return new MusepackParser();
    case "ogg":
      return new OggParser();
    case "riff":
      return new WaveParser();
    case "wavpack":
      return new WavPackParser();
    case "matroska":
      return new MatroskaParser();
    default:
      throw new Error("Unknown parser type: " + fileType);
  }
};
