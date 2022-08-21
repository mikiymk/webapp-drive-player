import { createSignal } from "solid-js";

import type { AudioInfo } from "~/audio/AudioInfo";

export type AudioID = string;
export type AudioMap = Map<AudioID, AudioInfo>;
export type AudioEntry = [AudioID, AudioInfo];
export type AudioEntries = AudioEntry[];

const [audios, setAudios] = createSignal<AudioMap>(new Map());
export { audios };

export const getAudio = (id: AudioID) => {
  return audios().get(id);
};

export const addAudios = (audios: AudioEntries) => {
  setAudios(value => new Map([...value, ...audios]));
};

export const setAudioInfo = (id: AudioID, info: AudioInfo) => {
  setAudios(value => {
    const map = new Map(value);
    map.set(id, info);
    return map;
  });
};

export const clearAudios = () => {
  setAudios(new Map());
};
