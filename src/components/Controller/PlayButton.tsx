import React from "react";

import IconButton from "components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
};

const PlayButton: React.FC<Props> = ({ isPlaying, play, pause }) => {
  return isPlaying ? (
    <IconButton icon={"pause"} onClick={pause} className={styleIcon} />
  ) : (
    <IconButton icon={"play_arrow"} onClick={play} className={styleIcon} />
  );
};

export default PlayButton;
