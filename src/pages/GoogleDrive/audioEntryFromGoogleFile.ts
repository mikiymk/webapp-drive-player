import { AudioInfo } from "~/audio/AudioInfo";

import type { GoogleFile } from "~/api/google/type";
import type { AudioEntry } from "~/signals/audios";

export const audioEntryFromFile = ({ id, name }: GoogleFile): AudioEntry => [
  id,
  AudioInfo.getNamedInfo(name),
];
