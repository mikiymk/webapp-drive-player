import React from "react";
import { getFiles } from "../api";
import { File } from "../type";
import PlayingInfo from "./PlayManager";
import MusicList from "./MusicList";
import PlayingList from "./PlayingList";
import Authorize from "./Authorize";
import AudioPlayer from "../audio/player";
import Menu from "./Menu";

const player = new AudioPlayer();

/**
 * react component root.
 */
const MusicPlayer: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [paused, setPaused] = React.useState(true);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    player.onSetDuration = duration => setDuration(duration);
    player.onSetPause = paused => setPaused(paused);
    player.onSetCurrentTime = currentTime => setCurrentTime(currentTime);
  }, []);

  const onSignIn = () => {
    getFiles(newFiles => setFiles(files.concat(newFiles)));
  };

  const playWithIndex = (index: number) => {
    const item = files[index];
    if (!item) {
      console.log("no item");
      return;
    }
    player.playWithUrl(item.id);
  };

  return (
    <div>
      <Menu />
      <PlayingInfo
        name={""}
        duration={duration}
        currentTime={currentTime}
        paused={paused}
        seek={time => player.seek(time)}
        play={() => player.play()}
        pause={() => player.pause()}
      />
      <Authorize onSignIn={onSignIn} />
      <MusicList files={files} play={playWithIndex} />
      <PlayingList list={[]} playingIndex={0} />
    </div>
  );
};

export default MusicPlayer;
