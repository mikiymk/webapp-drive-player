import React from "react";

import IconButton from "../Common/IconButton";
import PlayButton from "./PlayButton";
import LoopButton from "./LoopButton";
import SeekBar from "./SeekBar";

import { formatTime } from "../../format";

type Props = {
  duration: number;
  currentTime: number;
  paused: boolean;
  loop: "no" | "one" | "all";
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setLoop: (loop: "no" | "one" | "all") => void;
};

const Controller: React.FC<Props> = ({
  duration,
  currentTime,
  paused,
  loop,
  seek,
  play,
  pause,
  playNext,
  playPrev,
  setLoop,
}) => {
  return (
    <>
      <div className="player-controller">
        <IconButton icon="skip_previous" onClick={playPrev} />
        <PlayButton isPaused={paused} play={play} pause={pause} />
        <IconButton icon="skip_next" onClick={playNext} />
        <LoopButton loop={loop} setLoop={setLoop} />
        {formatTime(currentTime)}/{formatTime(duration)}
      </div>
      <SeekBar duration={duration} time={currentTime} seek={seek} />
    </>
  );
};

export default Controller;
