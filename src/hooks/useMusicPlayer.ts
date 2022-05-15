import { AudioManager } from "~/audio/AudioManager";
import { Repeat } from "~/audio/Repeat";
import { AudioInfo } from "~/audio/AudioInfo";
import { AudioElementPlayer } from "~/audio/AudioElementPlayer";
import { Accessor, createEffect, createSignal, onMount } from "solid-js";
import { useAudios } from "./createFiles";

const useMusicPlayer = (accessToken: Accessor<string>) => {
  const [paused, setPaused] = createSignal(true);
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [repeat, setRepeat] = createSignal(Repeat.DEFAULT);
  const [shuffle, setShuffle] = createSignal(false);

  const [info, setInfo] = createSignal(AudioInfo.getEmptyInfo());

  const player = new AudioElementPlayer();
  const manager = new AudioManager(player);

  onMount(() => {
    const audios = useAudios();

    manager.onSetDuration = duration => setDuration(duration);
    manager.onSetPause = paused => setPaused(paused);
    manager.onSetCurrentTime = currentTime => setCurrentTime(currentTime);
    manager.onSetRepeat = repeat => setRepeat(repeat);
    manager.onSetShuffle = shuffle => setShuffle(shuffle);

    manager.onLoadInfo = audios.setInfo;
  });

  createEffect(() => {
    const audios = useAudios();
    manager.onChangeMusic = id => {
      const info = audios.audios[id];
      if (info instanceof AudioInfo) {
        setInfo(info);
      } else if (info !== undefined) {
        setInfo(AudioInfo.getEmptyInfo());
      } else {
        setInfo(AudioInfo.getEmptyInfo());
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
