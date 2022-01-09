import React from "react";

import { Item } from "./Item";

import { File } from "file";

type Props = {
  files: File[];
  play: (index: number) => void;
};

/**
 * list of musics
 */
const MusicList: React.FC<Props> = ({ files, play }) => {
  return (
    <ul>
      {files.map((file, index) => (
        <Item key={file.id} file={file} play={play} index={index} />
      ))}
    </ul>
  );
};

export default MusicList;
