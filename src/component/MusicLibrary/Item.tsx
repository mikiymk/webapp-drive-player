import React from "react";
import { File } from "../../file";

/**
 * item of musics list
 */
export const Item: React.FC<{
  file: File;
  play: (index: number) => void;
  index: number;
}> = ({ file: { name, id }, play, index }) => (
  <li>
    {name}({id})<button onClick={() => play(index)}>play</button>
  </li>
);
