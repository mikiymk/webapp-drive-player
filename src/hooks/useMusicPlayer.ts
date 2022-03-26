import { useState, useEffect, useRef } from "react";

import AudioPlayer from "audio/player";
import Repeat from "audio/repeat";
import { File } from "file";
import AudioInfo from "audio/audioInfo";
import { Files } from "components/MusicPlayer";

const useMusicPlayer = () => {
  const [files, setFiles] = useState<Files>({});

  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeat, setRepeat] = useState(Repeat.DEFAULT);
  const [shuffle, setShuffle] = useState(false);

  const [info, setInfo] = useState(AudioInfo.getEmptyInfo());

  const player = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    player.current = new AudioPlayer();

    player.current.onSetDuration = duration => setDuration(duration);
    player.current.onSetPause = paused => setPaused(paused);
    player.current.onSetCurrentTime = currentTime =>
      setCurrentTime(currentTime);
    player.current.onSetRepeat = repeat => setRepeat(repeat);
    player.current.onSetShuffle = shuffle => setShuffle(shuffle);

    player.current.onLoadInfo = (info: AudioInfo) =>
      setFiles(files => {
        const newfile = { ...files };
        newfile[info.id].info = info;
        return newfile;
      });
  }, []);

  useEffect(() => {
    if (player.current !== null) {
      player.current.onChangeMusic = id =>
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
    player: player.current,
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
