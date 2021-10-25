import React from "react";
import { File } from "../file";

/**
 * list of musics
 */
const MusicList: React.FC<{
  files: File[];
  play: (index: number) => void;
}> = ({ files, play }) => (
  <ul>
    {files.map((file, index) => (
      <MusicItem key={file.id} file={file} play={play} index={index} />
    ))}
  </ul>
);

/**
 * item of musics list
 */
const MusicItem: React.FC<{
  file: File;
  play: (index: number) => void;
  index: number;
}> = ({ file: { name, id }, play, index }) => (
  <li>
    {name}({id})<button onClick={() => play(index)}>play</button>
  </li>
);

export default MusicList;
