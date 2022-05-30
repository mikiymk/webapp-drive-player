import { createStore } from "solid-js/store";

import type { AudioID } from "./createAudios";

export type PlaylistName = string;
export type Playlist = [PlaylistName, AudioID[]];
export type PlaylistList = ([PlaylistName, AudioID[]] | null)[];
export type PlaylistIndex = Record<PlaylistName, number | null>;

const [playlists, setPlaylists] = createStore<PlaylistList>([]);
const playlistIndex: PlaylistIndex = {};
export { playlists };

export const getPlaylist = (name: PlaylistName) => {
  const index = playlistIndex[name];
  if (index === undefined || index === null) return undefined;

  const playlist = playlists[index];
  if (playlist === undefined || playlist === null) return undefined;

  return playlist[1];
};

export const makePlaylist = (name: PlaylistName) => {
  if (typeof playlistIndex[name] === "number") return;

  setPlaylists(value => {
    playlistIndex[name] = value.length;
    return [...value, [name, []]];
  });
};

export const deletePlaylist = (name: PlaylistName) => {
  const index = playlistIndex[name];
  if (typeof index !== "number") return;

  setPlaylists(value => {
    const playlists = [...value];
    playlists[index] = null;
    playlistIndex[name] = null;

    return playlists;
  });
};

export const addAudio = (name: PlaylistName, id: AudioID) => {
  const index = playlistIndex[name];
  if (typeof index !== "number") return;

  setPlaylists(index, 1, value => [...value, id]);
};

export const removeAudio = (name: PlaylistName, index: number) => {
  const pindex = playlistIndex[name];
  if (typeof pindex !== "number") return;

  setPlaylists(pindex, 1, value =>
    value.slice(0, index).concat(value.slice(index + 1))
  );
};
