import React from "react";
import { css } from "@linaria/core";

const style = css``;

type Props = {
  playlists: { name: string; ids: string[] }[];
};

/** show on right click */
const Playlist: React.FC<Props> = ({ playlists }) => {
  return <div className={style}>{playlists.map(({ name }) => name)}</div>;
};

export default Playlist;
