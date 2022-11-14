import { Match, Show, Switch } from "solid-js";

import { RepeatOn, RepeatOne, toggleRepeat as toggle } from "~/audio/Repeat";
import {
  IconPause,
  IconPlay,
  IconRepeatOff,
  IconRepeatOn,
  IconRepeatOnce,
  IconShuffleOff,
  IconShuffleOn,
  IconSkipNext,
  IconSkipPrev,
} from "~/components/Icon";

import { MusicTime } from "./MusicTime";
import { MusicTitle } from "./MusicTitle";
import { SeekBar } from "./SeekBar";
import { iconButton, controller } from "./style.css";

import type { AudioInfo } from "~/audio/AudioInfo";
import type { RepeatType } from "~/audio/Repeat";

interface ControllerProps {
  info: AudioInfo;
  duration: number;
  currentTime: number;
  paused: boolean;
  repeat: RepeatType;
  shuffle: boolean;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setRepeat: (repeat: RepeatType) => void;
  setShuffle: (shuffle: boolean) => void;
}

/**
 * 曲の再生・停止などのコントロールする
 */
export const Controller = (props: ControllerProps) => {
  const toggleRepeat = () => props.setRepeat(toggle(props.repeat));
  const toggleShuffle = () => props.setShuffle(!props.shuffle);

  return (
    <>
      <SeekBar
        duration={props.duration}
        time={props.currentTime}
        seek={props.seek}
      />
      <div class={controller}>
        <button class={iconButton} onClick={() => props.playPrev()}>
          <IconSkipPrev />
        </button>
        <Show
          when={props.paused}
          fallback={
            <button class={iconButton} onClick={() => props.pause()}>
              <IconPause />
            </button>
          }
        >
          <button class={iconButton} onClick={() => props.play()}>
            <IconPlay />
          </button>
        </Show>
        <button class={iconButton} onClick={() => props.playNext()}>
          <IconSkipNext />
        </button>
        <MusicTitle info={props.info} />
        <button class={iconButton} onClick={() => toggleRepeat()}>
          <Switch fallback={<IconRepeatOff />}>
            <Match when={props.repeat === RepeatOn}>
              <IconRepeatOn />
            </Match>
            <Match when={props.repeat === RepeatOne}>
              <IconRepeatOnce />
            </Match>
          </Switch>
        </button>
        <button class={iconButton} onClick={() => toggleShuffle()}>
          <Show when={props.shuffle} fallback={<IconShuffleOff />}>
            <IconShuffleOn />
          </Show>
        </button>

        <MusicTime duration={props.duration} currentTime={props.currentTime} />
      </div>
    </>
  );
};
