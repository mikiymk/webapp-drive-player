import create from "solid-zustand";
import type { FileID } from "./createFiles";

export type PlaylistName = string;
export type Playlist = { name: PlaylistName; audios: FileID[] };

export type Playlists = {
  playlists: Record<PlaylistName, Playlist>;
  makePlaylist: (name: PlaylistName) => void;
  deletePlaylist: (name: PlaylistName) => void;

  addAudioToPlaylist: (name: PlaylistName, id: FileID) => void;
  removeAudioFromPlaylist: (name: PlaylistName, index: number) => void;
};

export const useFiles = create<Playlists>(set => ({
  playlists: {},
  makePlaylist: name =>
    set(state => {
      const playlists = { ...state.playlists };
      playlists[name] = { name, audios: [] };
      return { playlists };
    }),
  deletePlaylist: name =>
    set(state => {
      const playlists = Object.entries(state.playlists);
      const index = playlists.findIndex(([n]) => n === name);
      if (index === -1) return { playlists: state.playlists };
      const deletedPlaylists = playlists
        .slice(0, index)
        .concat(playlists.slice(index + 1));
      return { playlists: Object.fromEntries(deletedPlaylists) };
    }),

  addAudioToPlaylist: (name, id) =>
    set(state => {
      const playlists = { ...state.playlists };
      const audios = playlists[name]?.audios ?? [];
      audios.push(id);
      playlists[name] = { name, audios: audios };
      return { playlists };
    }),
  removeAudioFromPlaylist: (name, index) =>
    set(state => {
      const playlists = { ...state.playlists };
      const audios = playlists[name]?.audios ?? [];
      const deleted = audios.slice(0, index).concat(audios.slice(index + 1));
      playlists[name] = { name, audios: deleted };
      return { playlists };
    }),
}));
