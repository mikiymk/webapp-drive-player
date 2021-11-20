import React from "react";
import { File } from "../../file";
import { Item } from "./Item";

/**
 * list of musics
 */
const MusicList: React.FC<{
  files: File[];
  play: (index: number) => void;
}> = ({ files, play }) => (
  <ul>
    {files.map((file, index) => (
      <Item key={file.id} file={file} play={play} index={index} />
    ))}
  </ul>
);

export default MusicList;
