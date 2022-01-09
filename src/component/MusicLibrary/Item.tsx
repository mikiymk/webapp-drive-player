import React from "react";

import { File } from "file";

type Props = {
  file: File;
  play: (index: number) => void;
  index: number;
};

/**
 * item of musics list
 */
export const Item: React.FC<Props> = ({ file: { name, id }, play, index }) => {
  return (
    <li>
      {name}({id})<button onClick={() => play(index)}>play</button>
    </li>
  );
};
