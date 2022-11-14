import { formatTime } from "~/format";

import { timeBox } from "./style.css";

interface MusicTitleProps {
  duration: number;
  currentTime: number;
}

/** 時間をフォーマットして表示 */
export const MusicTime = (props: MusicTitleProps) => {
  return (
    <span class={timeBox}>
      {formatTime(props.currentTime)}/{formatTime(props.duration)}
    </span>
  );
};
