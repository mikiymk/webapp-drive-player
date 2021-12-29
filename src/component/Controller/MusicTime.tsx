import React from "react";

import { formatTime } from "format";

type Props = {
  duration: number;
  currentTime: number;
};

/** 時間をフォーマットして表示 */
const MusicTitle: React.FC<Props> = ({ duration, currentTime }) => {
  return (
    <span className="player-controller-time">
      <span className="player-controller-time-currentTime">
        {formatTime(currentTime)}
      </span>
      /
      <span className="player-controller-time-duration">
        {formatTime(duration)}
      </span>
    </span>
  );
};

export default MusicTitle;
