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

/**
 * react component root.
 */
const MusicPlayer: React.FC = () => {
  const [signIn, setSignIn] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { player, status } = usePlayer();

  const addFile = (newFiles: File) => setFiles(files.concat(newFiles));
  const playWithIndex = (index: number) => {
    player?.playWithIdList(files, index);
  };

  const menuItems = new Map<
    string,
    { name: string; icon: string; element: JSX.Element }
  >()
    .set("playing", {
      name: "Now Playing",
      icon: "play_arrow",
      element: (
        <PlayingInfo
          album={status.info.album}
          jacket={status.info.jacket}
          playingList={player?.musicIds ?? []}
        />
      ),
    })
    .set("library", {
      name: "Library",
      icon: "list",
      element: <MusicList files={files} play={playWithIndex} />,
    })
    .set("drive", {
      name: "Google Drive",
      icon: "cloud",
      element: <DriveFiles signIn={signIn} addFile={addFile} />,
    });

  return (
    <div className="player-container">
      <Controller
        title={status.info.title}
        artist={status.info.artist}
        duration={status.duration}
        currentTime={status.currentTime}
        paused={status.paused}
        repeat={status.repeat}
        shuffle={status.shuffle}
        seek={time => player?.seek(time)}
        play={() => player?.play()}
        pause={() => player?.pause()}
        playNext={() => player?.skipToNext()}
        playPrev={() => player?.playPrev()}
        setRepeat={repeat => player?.setRepeat(repeat)}
        setShuffle={shuffle => player?.setShuffle(shuffle)}
      />
      <Menu items={menuItems} signIn={signIn} setSignIn={setSignIn} />
    </div>
  );
};

const usePlayer = () => {
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeat, setRepeat] = useState(new Repeat());
  const [shuffle, setShuffle] = useState(false);

  const [info, setInfo] = useState(new AudioInfo());

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
