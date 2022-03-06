import { useState } from "react";

type Playlists = { [name: string]: string[] };

const usePlaylist = () => {
  const [playlists, setPlaylists] = useState<Playlists>({});

  const makePlaylist = (playlist: string) => {
    if (playlist in playlists) {
      throw new Error("duplicate playlist");
    }

    setPlaylists(playlists =>
      Object.fromEntries(Object.entries(playlists).concat([[playlist, []]]))
    );
  };

  const deletePlaylist = (playlist: string) => {
    setPlaylists(playlists =>
      Object.fromEntries(
        Object.entries(playlists).filter(([name]) => name === playlist)
      )
    );
  };

  const addToPlaylist = (playlist: string, audioId: string) => {
    if (!(playlist in playlists)) {
      makePlaylist(playlist);
    }

    setPlaylists(playlists => ({
      ...playlists,
      [playlist]: [...playlists[playlist], audioId],
    }));
  };

  const removeFromPlaylist = (playlist: string, index: number) => {
    if (!(playlist in playlists)) {
      return;
    }

    setPlaylists(playlists => ({
      ...playlists,
      [playlist]: [
        ...playlists[playlist].slice(0, index),
        ...playlists[playlist].slice(index + 1),
      ],
    }));
  };

  return {
    playlists,

    makePlaylist,
    deletePlaylist,

    addToPlaylist,
    removeFromPlaylist,
  };
};

export default usePlaylist;
