import React from "react";

import IconButton from "components/IconButton";

import MusicTitle from "./MusicTitle";
import MusicTime from "./MusicTime";
import SeekBar from "./SeekBar";

import Repeat from "audio/repeat";
import AudioInfo from "audio/audioInfo";
import { style, styleIcon } from "./style";

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
  const onClickPlayPause = paused ? play : pause;
  const onClickRepeat = () => setRepeat(repeat.toggle());
  const onClickShuffle = () => setShuffle(!shuffle);
  const playIconName = paused ? "play_arrow" : "pause";
  const repeatIconName = {
    "repeat off": "repeat",
    "repeat one": "repeat_one_on",
    "repeat on": "repeat_on",
  }[repeat.value];
  const shuffleIconName = shuffle ? "shuffle_on" : "shuffle";

  return (
    <>
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      <div className={style}>
        <IconButton
          icon="skip_previous"
          onClick={playPrev}
          className={styleIcon}
        />
        <IconButton
          icon={playIconName}
          onClick={onClickPlayPause}
          className={styleIcon}
        />
        <IconButton icon="skip_next" onClick={playNext} className={styleIcon} />
        <MusicTitle info={info} />
        <IconButton
          icon={repeatIconName}
          onClick={onClickRepeat}
          className={styleIcon}
        />
        <IconButton
          icon={shuffleIconName}
          onClick={onClickShuffle}
          className={styleIcon}
        />
        <MusicTime duration={duration} currentTime={currentTime} />
      </div>
    </>
  );
};

export default Controller;
