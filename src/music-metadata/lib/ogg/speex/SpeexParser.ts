import initDebug from "debug";


import { VorbisParser } from "../vorbis/VorbisParser";

import { Header } from "./Speex";

import type { INativeMetadataCollector } from "../../common/MetadataCollector";
import type { IOptions } from "../../type";
import type { IPageHeader } from "../Ogg";
import type { ITokenizer } from "strtok3/lib/core";


const debug = initDebug("music-metadata:parser:ogg:speex");

/**
 * Speex, RFC 5574
 * Ref:
 * - https://www.speex.org/docs/manual/speex-manual/
 * - https://tools.ietf.org/html/rfc5574
 */
export class SpeexParser extends VorbisParser {
  constructor(
    metadata: INativeMetadataCollector,
    options: IOptions,
    private tokenizer: ITokenizer
  ) {
    super(metadata, options);
  }

  /**
   * Parse first Speex Ogg page
   * @param {IPageHeader} header
   * @param {Buffer} pageData
   */
  protected parseFirstPage(header: IPageHeader, pageData: Buffer) {
    debug("First Ogg/Speex page");
    const speexHeader = Header.get(pageData, 0);
    this.metadata.setFormat("codec", `Speex ${speexHeader.version}`);
    this.metadata.setFormat("numberOfChannels", speexHeader.nb_channels);
    this.metadata.setFormat("sampleRate", speexHeader.rate);
    if (speexHeader.bitrate !== -1) {
      this.metadata.setFormat("bitrate", speexHeader.bitrate);
    }
  }
}
