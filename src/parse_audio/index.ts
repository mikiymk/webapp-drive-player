import { parseFileType } from "./fileType";

export const parseBuffer = (buffer: ArrayBuffer) => {
  const view = new DataView(buffer);
  const fileType = parseFileType(view);
  switch (fileType) {
    case "aiff":
      return new AIFFParser();
    case "adts":
    case "mpeg":
      return new MpegParser();
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
