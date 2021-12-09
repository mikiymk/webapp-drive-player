import React from "react";

import Marquee from "component/Common/Marquee";

type Props = {
  title: string;
  artist: string;
};

const MusicTitle: React.FC<Props> = ({ title, artist }) => {
  return (
    <span className="player-controller-title">
      <span className="player-controller-title-title">{title}</span>
      <span className="player-controller-title-artist">{artist}</span>
    </span>
  );
};

export default MusicTitle;
