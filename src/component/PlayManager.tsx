import { formatTime } from "../format";
import React from "react";

/**
 * now playing audio info view
 * @param props compontnt props
 * @param props.name play song name
 * @param props.audio play song audio element
 * @returns react render
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
  const durationText = formatTime(duration || 0);
  const currentTimeText = formatTime(currentTime || 0);

  return (
    <div>
      {name}
      <PlayPauseButton isPaused={paused} play={play} pause={pause} />
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      {currentTimeText}/{durationText}
    </div>
  );
};

const PlayPauseButton: React.FC<{
  isPaused: boolean;
  play: () => void;
  pause: () => void;
}> = ({ isPaused, play, pause }) => {
  if (isPaused) {
    return <button onClick={play}>play</button>;
  } else {
    return <button onClick={pause}>pause</button>;
  }
};

const SeekBar: React.FC<{
  duration: number;
  time: number;
  seek: (time: number) => void;
}> = ({ duration, time, seek }) => {
  duration ||= 0;
  time ||= 0;

  return (
    <input
      type="range"
      min="0"
      max={duration * 1000}
      value={time * 1000}
      onChange={event => seek(parseInt(event.target.value, 10) / 1000)}></input>
  );
};

export default PlayingInfo;
