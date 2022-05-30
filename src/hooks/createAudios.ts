import { createSignal } from "solid-js";

import type { AudioInfo } from "~/audio/AudioInfo";

export type AudioID = string;
export type AudioRecord = Record<AudioID, AudioInfo>;

const [audios, setAudios] = createSignal<AudioRecord>({});

export const addAudios = (audios: AudioRecord) => {
  setAudios(state => ({ ...audios, ...state }));
};

export const setAudioInfo = (id: AudioID, info: AudioInfo) => {
  setAudios(state => ({ ...state, [id]: info }));
};

export { audios };
