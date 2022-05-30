import { createSignal } from "solid-js";

import type { AudioID } from "./createAudios";

export type PlaylistName = string;
export type Playlist = { name: PlaylistName; audios: AudioID[] };
export type PlaylistRecord = Record<PlaylistName, Playlist>;

const [playlists, setPlaylists] = createSignal<PlaylistRecord>({});
export { playlists };

export const makePlaylist = (name: PlaylistName) => {
  return setPlaylists(state => {
    const playlists = { ...state };
    playlists[name] = { name, audios: [] };
    return playlists;
  });
};

export const deletePlaylist = (name: PlaylistName) => {
  return setPlaylists(state => {
    const playlists = Object.entries(state);

    const index = playlists.findIndex(([n]) => n === name);
    if (index === -1) return state;

    const deletedPlaylists = playlists
      .slice(0, index)
      .concat(playlists.slice(index + 1));
    return Object.fromEntries(deletedPlaylists);
  });
};

export const addAudio = (name: PlaylistName, id: AudioID) => {
  return setPlaylists(state => {
    const playlists = { ...state };
    const audios = playlists[name]?.audios ?? [];
    audios.push(id);
    playlists[name] = { name, audios: audios };
    return playlists;
  });
};

export const removeAudio = (name: PlaylistName, index: number) => {
  return setPlaylists(state => {
    const playlists = { ...state };
    const audios = playlists[name]?.audios ?? [];
    const deleted = audios.slice(0, index).concat(audios.slice(index + 1));
    playlists[name] = { name, audios: deleted };
    return playlists;
  });
};
