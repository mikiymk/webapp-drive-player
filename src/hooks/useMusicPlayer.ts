import { createEffect, createSignal, onMount } from "solid-js";

import { AudioBufferSourcePlayer } from "~/audio/AudioBufferSourcePlayer";
import { AudioInfo } from "~/audio/AudioInfo";
import { AudioManager } from "~/audio/AudioManager";
import { Repeat } from "~/audio/Repeat";

import { getAudio, setAudioInfo } from "./createAudios";
import { accessToken } from "./useSignIn";

const useMusicPlayer = () => {
  const [paused, setPaused] = createSignal(true);
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [repeat, setRepeat] = createSignal(Repeat.DEFAULT);
  const [shuffle, setShuffle] = createSignal(false);

  const [info, setInfo] = createSignal(AudioInfo.getEmptyInfo());

  const [player, setPlayer] = createSignal<"bufsrc" | "elemsrc" | "elem">(
    "elemsrc"
  );
  const bufferSourcePlayer = new AudioBufferSourcePlayer();
  const elementSourcePlayer = new AudioBufferSourcePlayer();
  const elementPlayer = new AudioBufferSourcePlayer();
  const manager = new AudioManager(bufferSourcePlayer);
  createEffect(() => {
    const selectedPlayer = player();
    if (selectedPlayer === "bufsrc") {
      manager.player = bufferSourcePlayer;
      console.log("change to bufferSourcePlayer");
    } else if (selectedPlayer === "elemsrc") {
      manager.player = elementSourcePlayer;
      console.log("change to elementSourcePlayer");
    } else if (selectedPlayer === "elem") {
      manager.player = elementPlayer;
      console.log("change to elementPlayer");
    }
  });

  onMount(() => {
    manager.onSetDuration = duration => setDuration(duration);
    manager.onSetPause = paused => setPaused(paused);
    manager.onSetCurrentTime = currentTime => setCurrentTime(currentTime);
    manager.onSetRepeat = repeat => setRepeat(repeat);
    manager.onSetShuffle = shuffle => setShuffle(shuffle);

    let currentID: string | undefined;
    manager.onLoadInfo = (id, info) => {
      setAudioInfo(id, info);
      if (id === currentID) {
        setInfo(AudioInfo.copyInfo(info));
      }
    };

    manager.onChangeMusic = id => {
      let info;
      currentID = id;
      if (id !== undefined && (info = getAudio(id)) !== undefined) {
        setInfo(AudioInfo.copyInfo(info));
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
    setPlayer,
  };
};

export default useMusicPlayer;
