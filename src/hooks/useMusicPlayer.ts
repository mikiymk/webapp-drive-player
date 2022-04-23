import { useState, useEffect, useRef } from "react";

import AudioManager from "~/audio/AudioManager";
import Repeat from "~/audio/Repeat";
import { File } from "~/file";
import AudioInfo from "~/audio/AudioInfo";
import { Files } from "~/components/MusicPlayer";
import AudioElementPlayer from "~/audio/AudioElementPlayer";

const useMusicPlayer = () => {
  const [files, setFiles] = useState<Files>({});

  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeat, setRepeat] = useState(Repeat.DEFAULT);
  const [shuffle, setShuffle] = useState(false);

  const [info, setInfo] = useState(AudioInfo.getEmptyInfo());

  const manager = useRef<AudioManager | null>(null);

  useEffect(() => {
    const player = new AudioElementPlayer();
    manager.current = new AudioManager(player);

    manager.current.onSetDuration = duration => setDuration(duration);
    manager.current.onSetPause = paused => setPaused(paused);
    manager.current.onSetCurrentTime = currentTime =>
      setCurrentTime(currentTime);
    manager.current.onSetRepeat = repeat => setRepeat(repeat);
    manager.current.onSetShuffle = shuffle => setShuffle(shuffle);

    manager.current.onLoadInfo = (id: string, info: AudioInfo) =>
      setFiles(files => {
        const newfile = { ...files };
        newfile[id].info = info;
        return newfile;
      });
  }, []);

  useEffect(() => {
    if (manager.current !== null) {
      manager.current.onChangeMusic = id =>
        setInfo(files[id].info ?? AudioInfo.getEmptyInfo());
    }
  }, [files]);

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
    player: manager.current,
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
