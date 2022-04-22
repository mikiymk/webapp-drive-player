import React from "react";
import { styleSeekBar } from "./style.css";
import useSeekTime from "./useSeekTime";

type Props = {
  duration: number;
  time: number;
  seek: (time: number) => void;
};

/** 現在位置が左から右にいって時間を表す */
const SeekBar: React.FC<Props> = ({ duration, time, seek }) => {
  const { seekTime, onChange, onClickDown, onClickUp } = useSeekTime(
    time,
    seek
  );

  return (
    <input
      className={styleSeekBar}
      type="range"
      min="0"
      max={duration * 1000}
      value={seekTime}
      onChange={onChange}
      onInput={onChange}
      onMouseDown={onClickDown}
      onMouseUp={onClickUp}
      onTouchStart={onClickDown}
      onTouchEnd={onClickUp}
    />
  );
};

export default SeekBar;
