import React from "react";
import { css } from "@linaria/core";

import { Item } from "./Item";

import { Files } from "component/MusicPlayer";

const style = css``;

type Props = {
  files: Files;
  play: (idList: string[], index: number) => void;
  playlist: Record<string, string[]>;
  addToPlaylist: (playlist: string, audioId: string) => void;
};

/**
 * list of musics
 */
const MusicList: React.FC<Props> = ({
  files,
  play,
  playlist,
  addToPlaylist,
}) => {
  return (
    <ul>
      {Object.values(files).map(({ id, name }, index) => (
        <Item
          key={id}
          id={id}
          name={name}
          play={() => play(Object.keys(files), index)}
          playlist={playlist}
          addToPlaylist={addToPlaylist}
        />
      ))}
    </ul>
  );
};

export default MusicList;
