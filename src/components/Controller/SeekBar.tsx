import React, { useState, useEffect } from "react";
import { css } from "@linaria/core";

const style = css`
  flex: 0 0 0.5rem;

  background-color: rgb(79, 81, 99);

  &:focus,
  &:active {
    outline: none;
  }
`;

type Props = {
  duration: number;
  time: number;
  seek: (time: number) => void;
};

/** 現在位置が左から右にいって時間を表す */
const SeekBar: React.FC<Props> = ({ duration, time, seek }) => {
  const [seekTime, setSeekTime] = useState(0);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (!click) {
      setSeekTime(Math.round(time * 1000));
    }
  }, [time]);

  const onClickDown = () => {
    setClick(true);
  };

  const onClickUp = () => {
    setClick(false);
    seek(seekTime / 1000);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setSeekTime(parseInt(event.target.value, 10));
  };

  return (
    <input
      className={style}
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
