import React from "react";

import IconButton from "../Common/IconButton";

type Props = {
  isPaused: boolean;
  play: () => void;
  pause: () => void;
};

const PlayButton: React.FC<Props> = ({ isPaused, play, pause }) => {
  return isPaused ? (
    <IconButton icon="play_arrow" onClick={play} />
  ) : (
    <IconButton icon="pause" onClick={pause} />
  );
};

export default PlayButton;
