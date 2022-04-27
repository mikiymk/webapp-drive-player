import { formatTime } from "~/format";
import { styleTime } from "./style.css";

type Props = {
  duration: number;
  currentTime: number;
};

/** 時間をフォーマットして表示 */
const MusicTitle = (props: Props) => {
  return (
    <span class={styleTime}>
      {formatTime(props.currentTime)}/{formatTime(props.duration)}
    </span>
  );
};

export default MusicTitle;
