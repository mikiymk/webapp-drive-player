import React from "react";
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
  const [signIn, setSignIn] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const [paused, setPaused] = React.useState(true);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [loop, setLoop] = React.useState<"no" | "one" | "all">("no");

  const player = React.useRef<AudioPlayer | null>(null);

  React.useEffect(() => {
    player.current = new AudioPlayer();
    player.current.onSetDuration = duration => setDuration(duration);
    player.current.onSetPause = paused => setPaused(paused);
    player.current.onSetCurrentTime = currentTime =>
      setCurrentTime(currentTime);
    player.current.onSetLoop = loop => setLoop(loop);
  }, []);

  const addFile = (newFiles: File) => setFiles(files.concat(newFiles));

  const playWithIndex = (index: number) => {
    player.current?.playWithIdList(
      files.map(file => file.id),
      index
    );
  };

  const authorize = <Authorize signIn={signIn} setSignIn={setSignIn} />;

  const menuItems = new Map([
    [
      "playing",
      {
        name: "Now Playing",
        element: (
          <PlayingInfo
            name={""}
            duration={duration}
            currentTime={currentTime}
            paused={paused}
            loop={loop}
            seek={time => player.current?.seek(time)}
            play={() => player.current?.play()}
            pause={() => player.current?.pause()}
            setLoop={loop => player.current?.setLoop(loop)}
          />
        ),
      },
    ],
    [
      "library",
      {
        name: "Library",
        element: <MusicList files={files} play={playWithIndex} />,
      },
    ],
    [
      "drive",
      {
        name: "Google Drive",
        element: <DriveFiles signIn={signIn} addFile={addFile} />,
      },
    ],
  ]);

  return <Menu authorize={authorize} items={menuItems} />;
};

export default MusicPlayer;
