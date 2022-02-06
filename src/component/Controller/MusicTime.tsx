import React from "react";
import { css } from "@linaria/core";

import { formatTime } from "format";

const style = css`
  margin: 0.9rem 0;
  width: 18ch;
  font-size: 1rem;
  text-align: center;
`;

type Props = {
  duration: number;
  currentTime: number;
};

/** 時間をフォーマットして表示 */
const MusicTitle: React.FC<Props> = ({ duration, currentTime }) => {
  return (
    <span className={style}>
      {formatTime(currentTime)}/{formatTime(duration)}
    </span>
  );
};

export default MusicTitle;
