import React from "react";

import { Item } from "./Item";

import { File } from "file";
import { Files } from "component/MusicPlayer";

type Props = {
  files: Files;
  play: (idList: string[], index: number) => void;
};

/**
 * list of musics
 */
const MusicList: React.FC<Props> = ({ files, play }) => {
  return (
    <ul>
      {Object.values(files).map(({ id, name }, index) => (
        <Item
          key={id}
          name={name}
          play={() => play(Object.keys(files), index)}
        />
      ))}
    </ul>
  );
};

export default MusicList;
