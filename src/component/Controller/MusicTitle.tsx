import React from "react";

type Props = {
  title: string;
  artist: string;
  album: string;
};

const MusicTitle: React.FC<Props> = ({ title, artist, album }) => {
  return (
    <span className="player-controller-title">
      <span className="player-controller-title-title">{title}</span>
      <span className="player-controller-title-artist">{artist}</span>
      <span className="player-controller-title-album">{album}</span>
    </span>
  );
};

export default MusicTitle;
