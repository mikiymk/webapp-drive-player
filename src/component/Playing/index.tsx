import React, { useEffect, useState, useRef } from "react";

import AudioInfo from "audio/audioInfo";
import { Files } from "component/MusicPlayer";
import useJacket from "./useJacket";

type Props = {
  info: AudioInfo;
  files: Files;
  playingList: Iterable<string>;
};

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<Props> = ({
  files,
  info: { base, additional },
  playingList,
}) => {
  const jacket = useJacket(
    additional.picture ? additional.picture[0] : undefined
  );

  return (
    <div>
      <span>{base.album}</span>
      <img src={jacket} alt="album jacket" />
      <ol>
        {Array.from(playingList).map((id, index) => (
          <li key={index}>{files[id].name}</li>
        ))}
      </ol>
    </div>
  );
};

export default PlayingInfo;
