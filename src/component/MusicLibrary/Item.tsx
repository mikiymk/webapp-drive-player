import React from "react";

import { File } from "file";

type Props = {
  name: string;
  play: () => void;
};

/**
 * item of musics list
 */
export const Item: React.FC<Props> = ({ name, play }) => {
  return (
    <li>
      {name} <button onClick={play}>play</button>{" "}
    </li>
  );
};
