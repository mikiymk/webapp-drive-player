import { createRoot } from "solid-js";
import create from "solid-zustand";

import type { AudioInfo } from "~/audio/AudioInfo";

export type AudioID = string;
export type AudioRecord = Record<AudioID, AudioInfo>;

type AudioStore = {
  audios: AudioRecord;
  addAudios: (audios: AudioRecord) => void;
  setInfo: (id: AudioID, info: AudioInfo) => void;
};

export const useAudios = createRoot(() => {
  return create<AudioStore>(set => ({
    audios: {},
    addAudios: audios =>
      set(state => ({
        audios: { ...audios, ...state.audios },
      })),
    setInfo: (id, info) =>
      set(state => ({ audios: { ...state.audios, [id]: info } })),
  }));
});
