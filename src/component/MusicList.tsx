import React from "react";
import { File, Play } from "../type";

/**
 * list of musics
 * @param props compontnt props
 * @returns react render
 */
const MusicList: React.FC<{ files: File[] } & Play> = ({ files, play }) => (
  <ul>
    {files.map((file, index) => (
      <MusicItem key={file.id} {...file} play={play} index={index} />
    ))}
  </ul>
);
/**
 * item of musics list
 * @param props compontnt props
 * @returns react render
 */
const MusicItem: React.FC<File & Play & { index: number }> = ({
  play,
  name,
  id,
  index,
}) => {
  return (
    <li>
      {name}({id})<button onClick={() => play(index)}>play</button>
    </li>
  );
};

export default MusicList;
