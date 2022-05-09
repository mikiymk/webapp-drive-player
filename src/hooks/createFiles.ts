import create from "solid-zustand";
import type AudioInfo from "~/audio/AudioInfo";

export type FileID = string;
export type File = { name: string } | AudioInfo;

export type Files = {
  files: Record<FileID, File>;
  addFiles: (files: [FileID, File][]) => void;
  setInfo: (id: FileID, info: AudioInfo) => void;
};

export const useFiles = create<Files>(set => ({
  files: {},
  addFiles: files =>
    set(state => ({ files: { ...state.files, ...Object.fromEntries(files) } })),
  setInfo: (id, info) =>
    set(state => ({ files: { ...state.files, [id]: info } })),
}));
