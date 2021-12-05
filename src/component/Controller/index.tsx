import React, { useState } from "react";

import IconButton from "component/Common/IconButton";

import PlayButton from "./PlayButton";
import RepeatButton from "./RepeatButton";
import SeekBar from "./SeekBar";

import { formatTime } from "format";
import Repeat from "audio/repeat";
import ShuffleButton from "./ShuffleButton";

type Props = {
  duration: number;
  currentTime: number;
  paused: boolean;
  repeat: Repeat;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setRepeat: (repeat: Repeat) => void;
};

const Controller: React.FC<Props> = ({
  duration,
  currentTime,
  paused,
  repeat,
  seek,
  play,
  pause,
  playNext,
  playPrev,
  setRepeat,
}) => {
  const [shuffle, setShuffle] = useState(false);
  return (
    <>
      <div className="player-controller">
        <IconButton icon="skip_previous" onClick={playPrev} />
        <PlayButton isPaused={paused} play={play} pause={pause} />
        <IconButton icon="skip_next" onClick={playNext} />
        <RepeatButton repeat={repeat} setRepeat={setRepeat} />
        <ShuffleButton shuffle={shuffle} setShuffle={setShuffle} />
        {formatTime(currentTime)}/{formatTime(duration)}
      </div>
      <SeekBar duration={duration} time={currentTime} seek={seek} />
    </>
  );
};

export default Controller;
