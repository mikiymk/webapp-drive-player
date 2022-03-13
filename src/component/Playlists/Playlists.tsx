import React, { useState } from "react";
import PlaylistList from "./PlaylistList";
import Playlist from "./Playlist";
import { File } from "file";

type Props = {
  files: Record<string, File>;
  playlist: {
    playlists: Record<string, string[]>;
    makePlaylist: (playlist: string) => void;
    deletePlaylist: (playlist: string) => void;
    addToPlaylist: (playlist: string, audioId: string) => void;
    removeFromPlaylist: (playlist: string, index: number) => void;
  };
};

/** show on right click */
const Playlists: React.FC<Props> = ({
  files,
  playlist: { playlists, makePlaylist, deletePlaylist },
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  return selectedPlaylist === "" ? (
    <PlaylistList
      playlists={playlists}
      makePlaylist={makePlaylist}
      deletePlaylist={deletePlaylist}
      select={setSelectedPlaylist}
    />
  ) : (
    <Playlist
      files={files}
      name={selectedPlaylist}
      audioIDs={playlists[selectedPlaylist]}
      reset={() => setSelectedPlaylist("")}
    />
  );
};

export default Playlists;
