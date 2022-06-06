import { StringType, UINT32_LE, UINT16_LE, Uint8ArrayType } from "token-types";

import type { IGetToken } from "strtok3/lib/core";

export interface IBroadcastAudioExtensionChunk {
  description: string;
  originator: string;
  originatorReference: string;
  originationDate: string;
  originationTime: string;
  timeReferenceLow: number;
  timeReferenceHigh: number;
  version: number;
  umid: Uint8Array;
}

/**
 * Broadcast Audio Extension Chunk
 * Ref: https://tech.ebu.ch/docs/tech/tech3285.pdf
 */
export const BroadcastAudioExtensionChunk: IGetToken<IBroadcastAudioExtensionChunk> =
  {
    len: 420,

    get: (uint8array, off) => {
      return {
        description: new StringType(256, "ascii")
          .get(uint8array, off)
          .trim(),
        originator: new StringType(32, "ascii")
          .get(uint8array, off + 256)
          .trim(),
        originatorReference: new StringType(32, "ascii")
          .get(uint8array, off + 288)
          .trim(),
        originationDate: new StringType(10, "ascii")
          .get(uint8array, off + 320)
          .trim(),
        originationTime: new StringType(8, "ascii")
          .get(uint8array, off + 330)
          .trim(),
        timeReferenceLow: UINT32_LE.get(uint8array, off + 338),
        timeReferenceHigh: UINT32_LE.get(uint8array, off + 342),
        version: UINT16_LE.get(uint8array, off + 346),
        umid: new Uint8ArrayType(64).get(uint8array, off + 348),
        loudnessValue: UINT16_LE.get(uint8array, off + 412),
        maxTruePeakLevel: UINT16_LE.get(uint8array, off + 414),
        maxMomentaryLoudness: UINT16_LE.get(uint8array, off + 416),
        maxShortTermLoudness: UINT16_LE.get(uint8array, off + 418),
      };
    },
  };
