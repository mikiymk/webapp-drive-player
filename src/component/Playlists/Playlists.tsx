import React, { useState } from "react";
import usePlaylist from "hooks/usePlaylist";
import PlaylistList from "./PlaylistList";
import Playlist from "./Playlist";
import { File } from "file";

type Props = {
  files: Record<string, File>;
};

/** show on right click */
const Playlists: React.FC<Props> = ({ files }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const { playlists, makePlaylist, deletePlaylist } = usePlaylist();

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
