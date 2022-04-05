import React, { useCallback } from "react";

import MusicTitle from "./MusicTitle";
import MusicTime from "./MusicTime";
import SeekBar from "./SeekBar";

import Repeat from "audio/repeat";
import AudioInfo from "audio/audioInfo";
import { style } from "./style";
import PrevButton from "./PrevButton";
import NextButton from "./NextButton";
import PlayButton from "./PlayButton";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";

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
  const toggleRepeat = useCallback(
    () => setRepeat(repeat.toggle()),
    [repeat, setRepeat]
  );
  const toggleShuffle = useCallback(
    () => setShuffle(!shuffle),
    [shuffle, setShuffle]
  );

  return (
    <>
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      <div className={style}>
        <PrevButton prev={playPrev} />
        <PlayButton isPlaying={!paused} play={play} pause={pause} />
        <NextButton next={playNext} />
        <MusicTitle info={info} />
        <RepeatButton repeat={repeat} toggleRepeat={toggleRepeat} />
        <ShuffleButton isShuffled={shuffle} toggleShuffle={toggleShuffle} />
        <MusicTime duration={duration} currentTime={currentTime} />
      </div>
    </>
  );
};

export default Controller;
