import React from "react";

import { File } from "file";

type Props = {
  jacket: string;
  playingList: Iterable<File>;
};

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<Props> = ({ jacket, playingList }) => {
  return (
    <div>
      <img src={jacket} alt="album jacket" />
      <ol>
        {Array.from(playingList).map(({ name, id }, index) => (
          <li key={index}>
            {name}({id})
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PlayingInfo;
