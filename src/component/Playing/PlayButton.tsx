import React from "react";

export const PlayButton: React.FC<{
  isPaused: boolean;
  play: () => void;
  pause: () => void;
}> = ({ isPaused, play, pause }) =>
  isPaused ? (
    <button onClick={play}>play</button>
  ) : (
    <button onClick={pause}>pause</button>
  );
