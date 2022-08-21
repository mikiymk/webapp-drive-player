import { createSignal } from "solid-js";

import type { AudioID } from "./audios";

export type PlaylistName = string;
export type PlaylistMap = Map<PlaylistName, readonly AudioID[]>;
export type PlaylistEntries = readonly [PlaylistName, readonly AudioID[]][];

const [playlists, setPlaylists] = createSignal<PlaylistMap>(new Map());
export { playlists };

export const addPlaylists = (playlists: PlaylistEntries) => {
  setPlaylists(value => new Map([...value, ...playlists]));
};

export const makePlaylist = (name: PlaylistName) => {
  setPlaylists(value => {
    if (value.has(name)) return value;

    const map = new Map(value);
    map.set(name, []);

    return map;
  });
};

export const deletePlaylist = (name: PlaylistName) => {
  setPlaylists(value => {
    if (!value.has(name)) return value;

    const map = new Map(value);
    map.delete(name);

    return map;
  });
};

export const renamePlaylist = (name: PlaylistName, newName: PlaylistName) => {
  setPlaylists(value => {
    const audios = value.get(name);
    if (audios === undefined) return value;

    const map = new Map(value);
    map.delete(name);
    map.set(newName, audios);

    return map;
  });
};

export const addAudio = (name: PlaylistName, id: AudioID) => {
  setPlaylists(value => {
    const map = new Map(value);

    const audios = map.get(name);
    if (audios !== undefined) {
      map.set(name, [...audios, id]);
    } else {
      map.set(name, [id]);
    }

    return map;
  });
};

export const removeAudio = (name: PlaylistName, index: number) => {
  setPlaylists(value => {
    const map = new Map(value);

    const audios = map.get(name);
    if (audios === undefined) {
      return value;
    }

    map.set(name, audios.slice(0, index).concat(audios.slice(index + 1)));

    return map;
  });
};

export const clearPlaylists = () => {
  setPlaylists(new Map());
};
