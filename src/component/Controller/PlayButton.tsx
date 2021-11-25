import React from "react";

import IconButton from "../Common/IconButton";

export const PlayButton: React.FC<{
  isPaused: boolean;
  play: () => void;
  pause: () => void;
}> = ({ isPaused, play, pause }) =>
  isPaused ? (
    <IconButton icon="play_arrow" onClick={play} />
  ) : (
    <IconButton icon="pause" onClick={pause} />
  );
