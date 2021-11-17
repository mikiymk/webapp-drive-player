import React, { useState, useEffect, useRef } from "react";
import AudioPlayer from "../audio/player";
import PlayingInfo from "./PlayManager";
import MusicList from "./MusicList";
import Menu from "./Menu";
import Authorize from "./Authorize";
import DriveFiles from "./DriveFiles";
import { File } from "../file";

/**
 * react component root.
 */
const MusicPlayer: React.FC = () => {
  const [signIn, setSignIn] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { player, status } = usePlayer();

  const addFile = (newFiles: File) => setFiles(files.concat(newFiles));
  const playWithIndex = (index: number) => {
    player?.playWithIdList(
      files.map(file => file.id),
      index
    );
  };

  const authorize = <Authorize signIn={signIn} setSignIn={setSignIn} />;
  const menuItems = new Map<string, { name: string; element: JSX.Element }>()
    .set("playing", {
      name: "Now Playing",
      element: (
        <PlayingInfo
          title={status.title}
          artist={status.artist}
          album={status.album}
          jacket={status.jacket}
          duration={status.duration}
          currentTime={status.currentTime}
          paused={status.paused}
          loop={status.loop}
          seek={time => player?.seek(time)}
          play={() => player?.play()}
          pause={() => player?.pause()}
          setLoop={loop => player?.setLoop(loop)}
        />
      ),
    })
    .set("library", {
      name: "Library",
      element: <MusicList files={files} play={playWithIndex} />,
    })
    .set("drive", {
      name: "Google Drive",
      element: <DriveFiles signIn={signIn} addFile={addFile} />,
    });

  return <Menu authorize={authorize} items={menuItems} />;
};

const usePlayer = () => {
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loop, setLoop] = useState<"no" | "one" | "all">("no");

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [jacket, setJacket] = useState("");

  const player = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    player.current = new AudioPlayer();

    player.current.onSetDuration = duration => setDuration(duration);
    player.current.onSetPause = paused => setPaused(paused);
    player.current.onSetCurrentTime = currentTime =>
      setCurrentTime(currentTime);
    player.current.onSetLoop = loop => setLoop(loop);

    player.current.onSetTitle = title => setTitle(title);
    player.current.onSetArtist = artist => setArtist(artist);
    player.current.onSetAlbum = album => setAlbum(album);
    player.current.onSetJacket = jacket => setJacket(jacket);
  }, []);

  return {
    player: player.current,
    status: {
      paused,
      duration,
      currentTime,
      loop,
      title,
      artist,
      album,
      jacket,
    },
  };
};

export default MusicPlayer;
