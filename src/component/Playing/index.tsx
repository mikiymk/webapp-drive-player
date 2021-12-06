import React from "react";

import { File } from "file";

type Props = {
  title: string;
  artist: string;
  album: string;
  jacket: string;
  playingList: Iterable<File>;
};

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<Props> = ({
  title,
  artist,
  album,
  jacket,
  playingList,
}) => {
  return (
    <div>
      <p>TITLE: {title}</p>
      <p>ARTIST: {artist}</p>
      <p>ALBUM: {album}</p>
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
