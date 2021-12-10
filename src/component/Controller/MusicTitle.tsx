import React from "react";

import Marquee from "component/Common/Marquee";

type Props = {
  title: string;
  artist: string;
};

const MusicTitle: React.FC<Props> = ({ title, artist }) => {
  return (
    <span className="player-controller-title">
      <Marquee className="player-controller-title-title">{title}</Marquee>
      <Marquee className="player-controller-title-artist">{artist}</Marquee>
    </span>
  );
};

export default MusicTitle;
