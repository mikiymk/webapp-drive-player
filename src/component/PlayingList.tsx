import React from "react";
import { File } from "../file";

/**
 * list of playing
 */
const PlayingList: React.FC<{
  playings: File[];
  playingIndex: number;
}> = ({ playings, playingIndex }) => (
  <div>
    Now Playing:
    <ul>
      {playings.map((playing, index) => (
        <PlayingItem
          key={index}
          playing={playing}
          isPlayingNow={playingIndex === index}
        />
      ))}
    </ul>
  </div>
);

const PlayingItem: React.FC<{
  playing: File;
  isPlayingNow: boolean;
}> = ({ isPlayingNow, playing: { name } }) => (
  <li>
    {isPlayingNow ? "playing" : ""}:{name}
  </li>
);

export default PlayingList;
