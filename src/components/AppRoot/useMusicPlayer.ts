import { createEffect, createSignal, onMount } from "solid-js";

import { AudioBufferSourcePlayer } from "~/audio/AudioBufferSourcePlayer";
import { AudioInfo } from "~/audio/AudioInfo";
import { AudioManager } from "~/audio/AudioManager";

import { RepeatDefault } from "~/audio/Repeat";

import { accessToken } from "~/signals/access-token";
import { getAudio, setAudioInfo } from "~/signals/audios";

import type { RepeatType } from "~/audio/Repeat";

const useMusicPlayer = () => {
  const [paused, setPaused] = createSignal(true);
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [repeat, setRepeat] = createSignal<RepeatType>(RepeatDefault);
  const [shuffle, setShuffle] = createSignal(false);

  const [info, setInfo] = createSignal(AudioInfo.getEmptyInfo());

  const player = new AudioBufferSourcePlayer();
  const manager = new AudioManager(player);

  onMount(() => {
    manager.onSetDuration = (duration) => setDuration(duration);
    manager.onSetPause = (paused) => setPaused(paused);
    manager.onSetCurrentTime = (currentTime) => setCurrentTime(currentTime);
    manager.onSetRepeat = (repeat) => setRepeat(repeat);
    manager.onSetShuffle = (shuffle) => setShuffle(shuffle);

    let currentID: string | undefined;
    manager.onLoadInfo = (id, info) => {
      setAudioInfo(id, info);
      if (id === currentID) {
        setInfo(AudioInfo.copyInfo(info));
      }
    };

    manager.onChangeMusic = (id) => {
      currentID = id;
      if (id !== undefined) {
        const info = getAudio(id);
        if (info !== undefined) {
          setInfo(AudioInfo.copyInfo(info));
          return;
        }
      }
      setInfo(AudioInfo.getEmptyInfo());
    };
  });

  createEffect(() => {
    manager.setAccessToken(accessToken());
  });

  return {
    player: manager,
    status: {
      paused,
      duration,
      currentTime,
      repeat,
      shuffle,
      info,
    },
  };
};

export default useMusicPlayer;
