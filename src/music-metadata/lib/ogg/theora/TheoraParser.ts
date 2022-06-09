import initDebug from "debug";


import { IdentificationHeader } from "./Theora";

import type { INativeMetadataCollector } from "../../common/MetadataCollector";
import type { IOptions } from "../../type";

import type * as Ogg from "../Ogg";
import type { ITokenizer } from "strtok3/lib/core";


const debug = initDebug("music-metadata:parser:ogg:theora");

/**
 * Ref:
 * - https://theora.org/doc/Theora.pdf
 */
export class TheoraParser implements Ogg.IPageConsumer {
  constructor(
    private metadata: INativeMetadataCollector,
    options: IOptions,
    private tokenizer: ITokenizer
  ) {}

  /**
   * Vorbis 1 parser
   * @param header Ogg Page Header
   * @param pageData Page data
   */
  public parsePage(header: Ogg.IPageHeader, pageData: Buffer) {
    if (header.headerType.firstPage) {
      this.parseFirstPage(header, pageData);
    }
  }

  public flush() {
    debug("flush");
  }

  public calculateDuration(header: Ogg.IPageHeader) {
    debug("duration calculation not implemented");
  }

  /**
   * Parse first Theora Ogg page. the initial identification header packet
   * @param {IPageHeader} header
   * @param {Buffer} pageData
   */
  protected parseFirstPage(header: Ogg.IPageHeader, pageData: Buffer) {
    debug("First Ogg/Theora page");
    this.metadata.setFormat("codec", "Theora");
    const idHeader = IdentificationHeader.get(pageData, 0);
    this.metadata.setFormat("bitrate", idHeader.nombr);
  }
}