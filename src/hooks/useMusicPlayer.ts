import { useState, useEffect, useRef } from "react";

import AudioPlayer from "audio/player";
import Repeat from "audio/repeat";
import { File } from "file";
import AudioInfo from "audio/audioInfo";
import { Files } from "components/MusicPlayer";
import AudioElementPlayer from "audio/ElementPlayer";

const useMusicPlayer = () => {
  const [files, setFiles] = useState<Files>({});

  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeat, setRepeat] = useState(Repeat.DEFAULT);
  const [shuffle, setShuffle] = useState(false);

  const [info, setInfo] = useState(AudioInfo.getEmptyInfo());

  const manager = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    const player = new AudioElementPlayer();
    manager.current = new AudioPlayer(player);

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
