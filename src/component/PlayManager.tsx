import { formatTime } from "../format";
import React, { useState } from "react";

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<{
  name: string;
  duration: number;
  currentTime: number;
  paused: boolean;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
}> = ({ name, duration, currentTime, paused, seek, play, pause }) => {
  duration ||= 0;
  currentTime ||= 0;

  const durationText = formatTime(duration);
  const currentTimeText = formatTime(currentTime);

  return (
    <div>
      {name}
      <PlayPauseButton isPaused={paused} play={play} pause={pause} />
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      <ToggleLoop />
      {currentTimeText}/{durationText}
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
}> = ({ duration, time, seek }) => (
  <input
    type="range"
    min="0"
    max={duration * 1000}
    value={time * 1000}
    onChange={event => seek(parseInt(event.target.value, 10) / 1000)}
  />
);

const useToggle = <T,>(changes: T[]): [T, () => void] => {
  const [index, setIndex] = useState(0);

  const toggleSelected = () => setIndex((index + 1) % changes.length);

  return [changes[index], toggleSelected];
};

const ToggleLoop: React.FC = () => {
  const loopType = ["no", "one", "all"];

  const [selected, toggle] = useToggle(loopType);

  return (
    <div>
      Loop:
      {loopType.map(loop => (
        <ToggleLoopItem
          key={loop}
          name={loop}
          set={toggle}
          checked={loop === selected}
        />
      ))}
      <ToggleLoopButton name={selected} toggle={toggle} />
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
