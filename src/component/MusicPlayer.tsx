import React, { useState, useEffect, useRef } from "react";

import PlayingInfo from "./Playing/index";
import MusicList from "./MusicLibrary/index";
import DriveFiles from "./GoogleDrive/index";
import Menu from "./Menu/index";
import Controller from "./Controller/index";

import AudioPlayer from "audio/player";
import Repeat from "audio/repeat";
import { File } from "file";
import AudioInfo from "audio/audioInfo";

export type Files = {
  [name: string]: File & Partial<AudioInfo>;
};

/**
 * react component root.
 */
const MusicPlayer: React.FC = () => {
  const [signIn, setSignIn] = useState(false);
  const [files, setFiles] = useState<Files>({});
  const { player, status } = usePlayer();

  const addFile = (newFiles: File) =>
    setFiles(files => ({ ...files, [newFiles.id]: newFiles }));

  const playWithIdList = (idList: string[], index: number) => {
    player?.playWithIdList(idList, index);
  };

  const menuItems: {
    [name: string]: { name: string; icon: string; element: JSX.Element };
  } = {
    playing: {
      name: "Now Playing",
      icon: "play_arrow",
      element: (
        <PlayingInfo
          info={status.info}
          files={files}
          playingList={player?.musicIds ?? []}
        />
      ),
    },
    library: {
      name: "Library",
      icon: "list",
      element: <MusicList files={files} play={playWithIdList} />,
    },
    drive: {
      name: "Google Drive",
      icon: "cloud",
      element: <DriveFiles signIn={signIn} addFile={addFile} />,
    },
  };

  return (
    <div className="player-container">
      <Menu items={menuItems} signIn={signIn} setSignIn={setSignIn} />
      <Controller
        info={status.info}
        duration={status.duration}
        currentTime={status.currentTime}
        paused={status.paused}
        repeat={status.repeat}
        shuffle={status.shuffle}
        seek={time => player?.seek(time)}
        play={() => player?.play()}
        pause={() => player?.pause()}
        playNext={() => player?.playToNext()}
        playPrev={() => player?.playToPrev()}
        setRepeat={repeat => player?.setRepeat(repeat)}
        setShuffle={shuffle => player?.setShuffle(shuffle)}
      />
    </div>
  );
};

const usePlayer = () => {
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeat, setRepeat] = useState(Repeat.DEFAULT);
  const [shuffle, setShuffle] = useState(false);

  const [info, setInfo] = useState(() => AudioInfo.getEmptyInfo());

  const player = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    player.current = new AudioPlayer();

    player.current.onSetDuration = duration => setDuration(duration);
    player.current.onSetPause = paused => setPaused(paused);
    player.current.onSetCurrentTime = currentTime =>
      setCurrentTime(currentTime);
    player.current.onSetRepeat = repeat => setRepeat(repeat);
    player.current.onSetShuffle = shuffle => setShuffle(shuffle);
    player.current.onSetInfo = info => setInfo(info);
  }, []);

  return {
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

export default MusicPlayer;
