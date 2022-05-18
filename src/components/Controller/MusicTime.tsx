import { formatTime } from "~/format";

import { styleTime } from "./style.css";

export type MusicTitleProps = {
  duration: number;
  currentTime: number;
};

/** 時間をフォーマットして表示 */
export const MusicTime = (props: MusicTitleProps) => {
  return (
    <span class={styleTime}>
      {formatTime(props.currentTime)}/{formatTime(props.duration)}
    </span>
  );
};
