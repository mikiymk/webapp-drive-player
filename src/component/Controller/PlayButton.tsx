import React from "react";

import IconButton from "component/Common/IconButton";

type Props = {
  isPaused: boolean;
  play: () => void;
  pause: () => void;
};

/** 停止中は再生ボタン、再生中は一時停止ボタン */
const PlayButton: React.FC<Props> = ({ isPaused, play, pause }) => {
  return isPaused ? (
    <IconButton icon="play_arrow" onClick={play} />
  ) : (
    <IconButton icon="pause" onClick={pause} />
  );
};

export default PlayButton;
