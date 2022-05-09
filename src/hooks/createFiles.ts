import create from "solid-zustand";

import type AudioInfo from "~/audio/AudioInfo";

export type AudioID = string;
export type Audio = AudioInfo;

export type AudioStore = {
  audios: Record<AudioID, Audio>;
  addAudios: (audios: Record<AudioID, Audio>) => void;
  setInfo: (id: AudioID, info: AudioInfo) => void;
};

export const useAudios = create<AudioStore>(set => ({
  audios: {},
  addAudios: audios =>
    set(state => ({
      audios: { ...audios, ...state.audios },
    })),
  setInfo: (id, info) =>
    set(state => ({ audios: { ...state.audios, [id]: info } })),
}));
