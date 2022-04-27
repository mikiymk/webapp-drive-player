import MusicTitle from "./MusicTitle";
import MusicTime from "./MusicTime";
import SeekBar from "./SeekBar";

import { styleController } from "./style.css";
import PrevButton from "./PrevButton";
import NextButton from "./NextButton";
import PlayButton from "./PlayButton";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import Repeat from "~/audio/Repeat";
import AudioInfo from "~/audio/AudioInfo";

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
const Controller = (props: Props) => {
  const toggleRepeat = () => props.setRepeat(props.repeat.toggle());
  const toggleShuffle = () => props.setShuffle(!props.shuffle);

  return (
    <>
      <SeekBar
        duration={props.duration}
        time={props.currentTime}
        seek={props.seek}
      />
      <div class={styleController}>
        <PrevButton prev={props.playPrev} />
        <PlayButton
          isPlaying={!props.paused}
          play={props.play}
          pause={props.pause}
        />
        <NextButton next={props.playNext} />
        <MusicTitle {...props.info} />
        <RepeatButton repeat={props.repeat} toggleRepeat={toggleRepeat} />
        <ShuffleButton
          isShuffled={props.shuffle}
          toggleShuffle={toggleShuffle}
        />
        <MusicTime duration={props.duration} currentTime={props.currentTime} />
      </div>
    </>
  );
};

export default Controller;
