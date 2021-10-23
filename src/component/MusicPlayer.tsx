import React from "react";
import player from "../audio/player";
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

  React.useEffect(() => {
    player.onSetDuration = duration => setDuration(duration);
    player.onSetPause = paused => setPaused(paused);
    player.onSetCurrentTime = currentTime => setCurrentTime(currentTime);
  }, []);

  const addFile = (newFiles: File) => setFiles(files.concat(newFiles));

  const playWithIndex = (index: number) => {
    const item = files[index];
    if (!item) {
      console.log("no item");
      return;
    }
    player.playWithUrl(item.id);
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
            seek={time => player.seek(time)}
            play={() => player.play()}
            pause={() => player.pause()}
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
