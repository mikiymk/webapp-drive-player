import React from "react";

import IconButton from "component/Common/IconButton";

import PlayButton from "./PlayButton";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import MusicTitle from "./MusicTitle";
import SeekBar from "./SeekBar";

import Repeat from "audio/repeat";
import MusicTime from "./MusicTime";
import AudioInfo from "audio/audioInfo";

type Props = {
  info: AudioInfo;
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

/**
 * 曲の再生・停止などのコントロールする
 */
const Controller: React.FC<Props> = ({
  info,
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
        <MusicTitle info={info} />
        <RepeatButton repeat={repeat} setRepeat={setRepeat} />
        <ShuffleButton shuffle={shuffle} setShuffle={setShuffle} />
        <MusicTime duration={duration} currentTime={currentTime} />
      </div>
      <SeekBar duration={duration} time={currentTime} seek={seek} />
    </>
  );
};

export default Controller;
