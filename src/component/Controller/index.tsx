import React from "react";

import { PlayButton } from "./PlayButton";
import { SeekBar } from "./SeekBar";
import { ToggleLoop } from "./ToggleLoop";

import { formatTime } from "../../format";

const Controller: React.FC<{
  duration: number;
  currentTime: number;
  paused: boolean;
  loop: "no" | "one" | "all";
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  setLoop: (loop: "no" | "one" | "all") => void;
}> = ({ duration, currentTime, paused, loop, seek, play, pause, setLoop }) => {
  return (
    <div className="player-controller">
      <PlayButton isPaused={paused} play={play} pause={pause} />
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      <ToggleLoop loop={loop} setLoop={setLoop} />
      {formatTime(currentTime)}/{formatTime(duration)}
    </div>
  );
};

export default Controller;
