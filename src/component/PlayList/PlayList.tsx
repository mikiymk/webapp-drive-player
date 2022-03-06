import React from "react";
import { css } from "@linaria/core";
import usePlaylist from "hooks/usePlaylist";
import MakePlaylistButton from "./MakePlaylistButton";

const style = css``;

type Props = {};

/** show on right click */
const Playlist: React.FC<Props> = ({}) => {
  const { playlists, makePlaylist } = usePlaylist();

  return (
    <div className={style}>
      <ul>
        {Object.entries(playlists).map(([name]) => (
          <li key={name}>{name}</li>
        ))}
        <li>
          <MakePlaylistButton makePlaylist={makePlaylist} />
        </li>
      </ul>
    </div>
  );
};

export default Playlist;
