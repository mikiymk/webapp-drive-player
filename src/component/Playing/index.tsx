import React from "react";

import { File } from "file";

type Props = {
  album: string;
  jacket: string;
  playingList: Iterable<File>;
};

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<Props> = ({ album, jacket, playingList }) => {
  return (
    <div>
      <span>{album}</span>
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
