import { formatTime } from "../format";
import React, { useEffect, useState } from "react";

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
      <PlayPauseButton isPaused={paused} play={play} pause={pause} />
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      <ToggleLoop loop={loop} setLoop={setLoop} />
      {formatTime(currentTime)}/{formatTime(duration)}
    </div>
  );
};

const PlayPauseButton: React.FC<{
  isPaused: boolean;
  play: () => void;
  pause: () => void;
}> = ({ isPaused, play, pause }) =>
  isPaused ? (
    <button onClick={play}>play</button>
  ) : (
    <button onClick={pause}>pause</button>
  );

const SeekBar: React.FC<{
  duration: number;
  time: number;
  seek: (time: number) => void;
}> = ({ duration, time, seek }) => {
  const [seekTime, setSeekTime] = useState(0);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (!click) {
      setSeekTime(Math.round(time * 1000));
    }
  }, [time]);

  const onClickDown = () => {
    setClick(true);
  };

  const onClickUp = () => {
    setClick(false);
    seek(seekTime / 1000);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setSeekTime(parseInt(event.target.value, 10));
  };

  return (
    <input
      type="range"
      min="0"
      max={duration * 1000}
      value={seekTime}
      onChange={onChange}
      onInput={onChange}
      onMouseDown={onClickDown}
      onMouseUp={onClickUp}
      onTouchStart={onClickDown}
      onTouchEnd={onClickUp}
    />
  );
};

const useToggle = <T,>(changes: T[]): [T, () => void] => {
  const [index, setIndex] = useState(0);

  const toggleSelected = () => setIndex((index + 1) % changes.length);

  return [changes[index], toggleSelected];
};

const toggleLoop = (loop: "no" | "one" | "all") => {
  if (loop === "no") {
    return "one";
  } else if (loop === "one") {
    return "all";
  } else if (loop === "all") {
    return "no";
  }
  return "one";
};

const ToggleLoop: React.FC<{
  loop: "no" | "one" | "all";
  setLoop: (loop: "no" | "one" | "all") => void;
}> = ({ loop, setLoop }) => {
  const onClick = () => setLoop(toggleLoop(loop));

  return (
    <div>
      Loop:
      <button onClick={onClick}>{loop}</button>
    </div>
  );
};

const ToggleLoopItem: React.FC<{
  name: string;
  set: (name: string) => void;
  checked: boolean;
}> = ({ name, set, checked }) => (
  <>
    <input
      type="radio"
      name="loop"
      id={"loop_" + name}
      value={name}
      onChange={() => set(name)}
      checked={checked}
      disabled
    />
    <label htmlFor={"loop_" + name}>{name}</label>
  </>
);

const ToggleLoopButton: React.FC<{
  name: string;
  toggle: () => void;
}> = ({ name, toggle }) => <button onClick={toggle}>{name}</button>;

export default PlayingInfo;
