import React from "react";
import { File, PropPlay } from "type";

/**
 * list of musics
 * @param props compontnt props
 * @returns react render
 */
export const MusicList: React.FC<{ files: File[] } & PropPlay> = ({
  files,
  play,
}) => {
  const listitems = files.map((file, index) => (
    <MusicListItem key={file.id} {...file} play={play} index={index} />
  ));
  return (
    <div>
      Files:
      <ul>{listitems}</ul>
    </div>
  );
};

/**
 * item of musics list
 * @param props compontnt props
 * @returns react render
 */
const MusicListItem: React.FC<File & PropPlay & { index: number }> = ({
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
