import { seekBar } from "./style.css";
import { useSeekTime } from "./useSeekTime";

interface SeekBarProps {
  duration: number;
  time: number;
  seek: (time: number) => void;
}

/** 現在位置が左から右にいって時間を表す */
export const SeekBar = (props: SeekBarProps) => {
  const { seekTime, onChange, onClickDown, onClickUp } = useSeekTime(
    () => props.time,
    (time) => props.seek(time),
  );

  return (
    <input
      class={seekBar}
      type="range"
      min="0"
      max={props.duration * 1000}
      value={seekTime()}
      onInput={onChange}
      onMouseDown={onClickDown}
      onMouseUp={onClickUp}
      onTouchStart={onClickDown}
      onTouchEnd={onClickUp}
    />
  );
};
