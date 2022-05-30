import { Accessor, createEffect, createSignal, onMount } from "solid-js";

import { AudioManager } from "~/audio/AudioManager";
import { Repeat } from "~/audio/Repeat";
import { AudioInfo } from "~/audio/AudioInfo";
import { AudioElementPlayer } from "~/audio/AudioElementPlayer";

import { getAudio, setAudioInfo } from "./createAudios";

const useMusicPlayer = (accessToken: Accessor<string | undefined>) => {
  const [paused, setPaused] = createSignal(true);
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [repeat, setRepeat] = createSignal(Repeat.DEFAULT);
  const [shuffle, setShuffle] = createSignal(false);

  const [info, setInfo] = createSignal(AudioInfo.getEmptyInfo());

  const player = new AudioElementPlayer();
  const manager = new AudioManager(player);

  onMount(() => {
    manager.onSetDuration = duration => setDuration(duration);
    manager.onSetPause = paused => setPaused(paused);
    manager.onSetCurrentTime = currentTime => setCurrentTime(currentTime);
    manager.onSetRepeat = repeat => setRepeat(repeat);
    manager.onSetShuffle = shuffle => setShuffle(shuffle);

    manager.onLoadInfo = setAudioInfo;
  });

  createEffect(() => {
    manager.onChangeMusic = id => {
      const info = getAudio(id);
      if (info === undefined) {
        setInfo(AudioInfo.getEmptyInfo());
      } else {
        setInfo(AudioInfo.copyInfo(info[1] as AudioInfo));
      }
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
