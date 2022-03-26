import React from "react";

import AudioInfo from "audio/audioInfo";
import { Files } from "components/MusicPlayer";
import useJacket from "hooks/useJacket";
import { style } from "./style";

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
    <div className={style}>
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
