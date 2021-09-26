import React from "react";
import { File } from "type";

export const NowPlayingList: React.FC<{
  list: File[];
  playingIndex: number;
}> = ({ list, playingIndex }) => {
  const listItem = list.map((item, index) => (
    <NowPlayingItem
      key={index}
      {...item}
      isPlayingNow={playingIndex === index}
    />
  ));
  return (
    <div>
      Now Playing:
      <ul>{listItem}</ul>
    </div>
  );
};

const NowPlayingItem: React.FC<File & { isPlayingNow: boolean }> = ({
  isPlayingNow,
  name,
}) => {
  return (
    <li>
      {isPlayingNow ? "playing" : ""}:{name}
    </li>
  );
};
