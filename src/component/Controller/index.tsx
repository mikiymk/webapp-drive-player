import React, { useState } from "react";

import IconButton from "component/Common/IconButton";

import PlayButton from "./PlayButton";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import MusicTitle from "./MusicTitle";
import SeekBar from "./SeekBar";

import { formatTime } from "format";
import Repeat from "audio/repeat";
import MusicTime from "./MusicTime";

type Props = {
  title: string;
  artist: string;
  duration: number;
  currentTime: number;
  paused: boolean;
  repeat: Repeat;
  shuffle: boolean;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setRepeat: (repeat: Repeat) => void;
  setShuffle: (shuffle: boolean) => void;
};

const Controller: React.FC<Props> = ({
  title,
  artist,
  duration,
  currentTime,
  paused,
  repeat,
  shuffle,
  seek,
  play,
  pause,
  playNext,
  playPrev,
  setRepeat,
  setShuffle,
}) => {
  return (
    <>
      <div className="player-controller">
        <IconButton icon="skip_previous" onClick={playPrev} />
        <PlayButton isPaused={paused} play={play} pause={pause} />
        <IconButton icon="skip_next" onClick={playNext} />
        <MusicTitle title={title} artist={artist} />
        <RepeatButton repeat={repeat} setRepeat={setRepeat} />
        <ShuffleButton shuffle={shuffle} setShuffle={setShuffle} />
        <MusicTime duration={duration} currentTime={currentTime} />
      </div>
      <SeekBar duration={duration} time={currentTime} seek={seek} />
    </>
  );
};

export default Controller;
