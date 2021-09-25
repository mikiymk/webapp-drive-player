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
  const listitems = files.map(file => (
    <MusicListItem key={file.id} {...file} play={play} />
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
const MusicListItem: React.FC<File & PropPlay> = ({ play, name, id, link }) => {
  const playing = () => {
    play({ name, id, link });
  };
  return (
    <li>
      {name}({id})<button onClick={playing}>play</button>
    </li>
  );
};
