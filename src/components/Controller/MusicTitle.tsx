import React, { memo } from "react";

import Marquee from "components/Marquee";
import AudioInfo from "audio/audioInfo";
import { styleArtist, styleTitle, styleTitleView } from "./style";

type Props = {
  info: AudioInfo;
};

/** タイトルとアーティストをマーキーで表示 */
const MusicTitle: React.FC<Props> = memo(
  ({
    info: {
      base: { title, artist },
    },
  }) => {
    return (
      <span className={styleTitleView}>
        <Marquee className={styleTitle}>{title}</Marquee>
        <Marquee className={styleArtist}>{artist}</Marquee>
      </span>
    );
  }
);

export default MusicTitle;
