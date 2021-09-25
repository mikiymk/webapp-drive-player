import React from "react";
import { File } from "type";

export const NowPlayingList: React.FC<{
  list: File[];
  playingIndex: number;
  deletePlaying: (index: number) => void;
}> = ({ list, playingIndex, deletePlaying }) => {
  const listItem = list.map((item, index) => (
    <NowPlayingItem
      key={index}
      {...item}
      isPlayingNow={playingIndex === index}
      deletePlaying={() => deletePlaying(index)}
    />
  ));
  return (
    <div>
      Now Playing:
      <ul>{listItem}</ul>
    </div>
  );
};

const NowPlayingItem: React.FC<
  File & { isPlayingNow: boolean; deletePlaying: () => void }
> = ({ isPlayingNow, name, deletePlaying }) => {
  return (
    <li>
      {isPlayingNow ? "playing" : ""}:{name}
      <button onClick={deletePlaying}>delete</button>
    </li>
  );
};
