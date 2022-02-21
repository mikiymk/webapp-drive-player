import React, { useEffect, useState, useRef } from "react";

import AudioInfo from "audio/audioInfo";
import { Files } from "component/MusicPlayer";

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
  const [jacketUrl, setJacketUrl] = useState("");
  const defaultBuffer = useRef(new ArrayBuffer(0));
  const picture =
    (additional.picture ? additional.picture[0] : undefined) ??
    defaultBuffer.current;
  useEffect(() => {
    if (jacketUrl !== "") {
      URL.revokeObjectURL(jacketUrl);
    }

    setJacketUrl(URL.createObjectURL(new Blob([picture])));
  }, [picture]);

  return (
    <div>
      <span>{base.album}</span>
      <img src={jacketUrl} alt="album jacket" />
      <ol>
        {Array.from(playingList).map((id, index) => (
          <li key={index}>{files[id].name}</li>
        ))}
      </ol>
    </div>
  );
};

export default PlayingInfo;
