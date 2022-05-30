import { createStore } from "solid-js/store";

import type { AudioInfo } from "~/audio/AudioInfo";

export type AudioID = string;
export type AudioList = [AudioID, AudioInfo][];
export type AudioIndex = Record<AudioID, number>;

const [audios, setAudios] = createStore<AudioList>([]);
let audioIndex: AudioIndex = {};
export { audios };

const createIndex = () => {
  audioIndex = Object.fromEntries(
    audios.map((value, index) => [value[0], index] as const)
  );
};

export const getAudio = (id: AudioID) => {
  const index = audioIndex[id];
  if (index === undefined) return undefined;
  return audios[index];
};

export const addAudios = (audios: AudioList) => {
  setAudios(state => state.concat(audios));
  createIndex();
};

export const setAudioInfo = (id: AudioID, info: AudioInfo) => {
  const index = audioIndex[id];
  if (index === undefined) return;
  setAudios(index, 1, () => info);
};
