import React from "react";

import { formatTime } from "~/format";
import { styleTime } from "./style.css";

type Props = {
  duration: number;
  currentTime: number;
};

/** 時間をフォーマットして表示 */
const MusicTitle: React.FC<Props> = ({ duration, currentTime }) => {
  return (
    <span className={styleTime}>
      {formatTime(currentTime)}/{formatTime(duration)}
    </span>
  );
};

export default MusicTitle;
