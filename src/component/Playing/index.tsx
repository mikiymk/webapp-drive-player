import React from "react";
import { formatTime } from "../../format";
import { PlayButton } from "./PlayButton";
import { SeekBar } from "./SeekBar";
import { ToggleLoop } from "./ToggleLoop";

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<{
  title: string;
  artist: string;
  album: string;
  jacket: string;
  duration: number;
  currentTime: number;
  paused: boolean;
  loop: "no" | "one" | "all";
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  setLoop: (loop: "no" | "one" | "all") => void;
}> = ({
  title,
  artist,
  album,
  jacket,
  duration,
  currentTime,
  paused,
  loop,
  seek,
  play,
  pause,
  setLoop,
}) => {
  return (
    <div>
      <p>TITLE: {title}</p>
      <p>ARTIST: {artist}</p>
      <p>ALBUM: {album}</p>
      <img src={jacket} alt="album jacket" />
      <PlayButton isPaused={paused} play={play} pause={pause} />
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      <ToggleLoop loop={loop} setLoop={setLoop} />
      {formatTime(currentTime)}/{formatTime(duration)}
    </div>
  );
};

export default PlayingInfo;
