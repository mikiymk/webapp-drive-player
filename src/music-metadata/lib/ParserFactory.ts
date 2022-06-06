import { parse as ContentTypeParse } from "content-type";
import { fileTypeFromBuffer } from "file-type";
import { parse as MimeTypeParse } from "media-typer";

import { AIFFParser } from "./aiff/AiffParser";
import { APEv2Parser } from "./apev2/APEv2Parser";
import { AsfParser } from "./asf/AsfParser";
import { MetadataCollector } from "./common/MetadataCollector";
import { uint8array } from "./common/Util";
import { DsdiffParser } from "./dsdiff/DsdiffParser";
import { DsfParser } from "./dsf/DsfParser";
import { FlacParser } from "./flac/FlacParser";
import { MatroskaParser } from "./matroska/MatroskaParser";
import { MP4Parser } from "./mp4/MP4Parser";
import { MpegParser } from "./mpeg/MpegParser";
import MusepackParser from "./musepack";
import { OggParser } from "./ogg/OggParser";
import { WaveParser } from "./wav/WaveParser";
import { WavPackParser } from "./wavpack/WavPackParser";

import type { INativeMetadataCollector } from "./common/MetadataCollector";

import type { ITokenizer } from "./strtok3";
import type { IOptions, IAudioMetadata, ParserType } from "./type";

export interface ITokenParser {
  /**
   * Initialize parser with output (metadata), input (tokenizer) & parsing options (options).
   * @param metadata - Output
   * @param tokenizer - Input
   * @param options - Parsing options
   */
  init(
    metadata: INativeMetadataCollector,
    tokenizer: ITokenizer,
    options: IOptions
  ): ITokenParser;

  /**
   * Parse audio track.
   * Called after init(...).
   * @returns Promise
   */
  parse(): Promise<void>;
}

/**
 * Parse metadata from tokenizer
 * @param tokenizer - Tokenizer
 * @param opts - Options
 * @returns Native metadata
 */
export const parseOnContentType = async (
  tokenizer: ITokenizer,
  opts: IOptions | undefined
): Promise<IAudioMetadata> => {
  // Resolve parser based on MIME-type or file extension

  // Parser could not be determined on MIME-type or extension
  const buf = uint8array(4100);
  await tokenizer.peekBuffer(buf, { mayBeLess: true });

  const guessedType = await fileTypeFromBuffer(buf);
  if (!guessedType) {
    throw new Error("Failed to determine audio format");
  }

  const parserId = getParserIdForMimeType(guessedType.mime);
  if (!parserId) {
    throw new Error("Guessed MIME-type not supported: " + guessedType.mime);
  }

  return parse(tokenizer, parserId, opts);
};

export function parseHttpContentType(contentType: string | undefined): {
  type: string;
  subtype: string;
  suffix: string | undefined;
  parameters: { [id: string]: string };
} {
  if (!contentType) throw new Error("content type required");
  const type = ContentTypeParse(contentType);
  const mime = MimeTypeParse(type.type);
  return {
    type: mime.type,
    subtype: mime.subtype,
    suffix: mime.suffix,
    parameters: type.parameters,
  };
}

async function parse(
  tokenizer: ITokenizer,
  parserId: ParserType,
  opts: IOptions = {}
): Promise<IAudioMetadata> {
  // Parser found, execute parser
  const parser = await loadParser(parserId);
  const metadata = new MetadataCollector(opts);
  await parser.init(metadata, tokenizer, opts).parse();
  return metadata.toCommonMetadata();
}

const loadParser = async (moduleName: ParserType): Promise<ITokenParser> => {
  switch (moduleName) {
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
    case "dsdiff":
      return new DsdiffParser();
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
      throw new Error(`Unknown parser type: ${moduleName}`);
  }
};

/**
 * @param httpContentType - HTTP Content-Type, extension, path or filename
 * @returns Parser sub-module name
 */
const getParserIdForMimeType = (
  httpContentType: string
): ParserType | undefined => {
  let mime;
  try {
    mime = parseHttpContentType(httpContentType);
  } catch (err) {
    console.debug(`Invalid HTTP Content-Type header value: ${httpContentType}`);
    return;
  }

  const subType =
    mime.subtype.indexOf("x-") === 0 ? mime.subtype.substring(2) : mime.subtype;

  switch (mime.type) {
    case "audio":
      switch (subType) {
        case "mp3": // Incorrect MIME-type, Chrome, in Web API File object
        case "mpeg":
          return "mpeg";

        case "aac":
        case "aacp":
          return "adts";

        case "flac":
          return "flac";

        case "ape":
        case "monkeys-audio":
          return "apev2";

        case "mp4":
        case "m4a":
          return "mp4";

        case "ogg": // RFC 7845
        case "opus": // RFC 6716
        case "speex": // RFC 5574
          return "ogg";

        case "ms-wma":
        case "ms-wmv":
        case "ms-asf":
          return "asf";

        case "aiff":
        case "aif":
        case "aifc":
          return "aiff";

        case "vnd.wave":
        case "wav":
        case "wave":
          return "riff";

        case "wavpack":
          return "wavpack";

        case "musepack":
          return "musepack";

        case "matroska":
        case "webm":
          return "matroska";

        case "dsf":
          return "dsf";
      }
      break;

    case "video":
      switch (subType) {
        case "ms-asf":
        case "ms-wmv":
          return "asf";

        case "m4v":
        case "mp4":
          return "mp4";

        case "ogg":
          return "ogg";

        case "matroska":
        case "webm":
          return "matroska";
      }
      break;

    case "application":
      switch (subType) {
        case "vnd.ms-asf":
          return "asf";

        case "ogg":
          return "ogg";
      }
      break;
  }
  return;
};
