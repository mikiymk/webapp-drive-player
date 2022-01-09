import React from "react";

import Marquee from "component/Common/Marquee";
import AudioInfo from "audio/audioInfo";

type Props = {
  info: AudioInfo;
};

/** タイトルとアーティストをマーキーで表示 */
const MusicTitle: React.FC<Props> = ({ info: { title, artist } }) => {
  return (
    <span className="player-controller-title">
      <Marquee className="player-controller-title-title">{title}</Marquee>
      <Marquee className="player-controller-title-artist">{artist}</Marquee>
    </span>
  );
};

export default MusicTitle;
