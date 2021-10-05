import React from "react";
import { File } from "../type";

const PlayingList: React.FC<{
  list: File[];
  playingIndex: number;
}> = ({ list, playingIndex }) => {
  const listItem = list.map((item, index) => (
    <PlayingItem key={index} {...item} isPlayingNow={playingIndex === index} />
  ));
  return (
    <div>
      Now Playing:
      <ul>{listItem}</ul>
    </div>
  );
};

const PlayingItem: React.FC<File & { isPlayingNow: boolean }> = ({
  isPlayingNow,
  name,
}) => {
  return (
    <li>
      {isPlayingNow ? "playing" : ""}:{name}
    </li>
  );
};

export default PlayingList;
