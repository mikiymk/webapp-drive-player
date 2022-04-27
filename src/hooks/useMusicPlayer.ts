import AudioManager from "~/audio/AudioManager";
import Repeat from "~/audio/Repeat";
import { File } from "~/file";
import AudioInfo from "~/audio/AudioInfo";
import { Files } from "~/components/MusicPlayer";
import AudioElementPlayer from "~/audio/AudioElementPlayer";
import { Accessor, createEffect, createSignal, onMount } from "solid-js";

const useMusicPlayer = (accessToken: Accessor<string>) => {
  const [files, setFiles] = createSignal<Files>({});

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

    manager.onLoadInfo = (id: string, info: AudioInfo) =>
      setFiles(files => {
        const newfile = { ...files };
        newfile[id].info = info;
        return newfile;
      });
  });

  createEffect(() => {
    const filesValue = files();
    manager.onChangeMusic = id =>
      setInfo(filesValue[id].info ?? AudioInfo.getEmptyInfo());
  });

  createEffect(() => {
    manager.setAccessToken(accessToken());
  });

  const addFiles = (newFiles: File[]) =>
    setFiles(files => ({
      ...files,
      ...Object.fromEntries(newFiles.map(newFile => [newFile.id, newFile])),
    }));

  const addFile = (newFiles: File) =>
    setFiles(files => ({ ...files, [newFiles.id]: newFiles }));

  return {
    files,
    addFile,
    addFiles,
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
