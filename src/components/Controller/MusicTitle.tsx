import React from "react";
import { css } from "@linaria/core";

import Marquee from "components/Marquee";
import AudioInfo from "audio/audioInfo";

const style = css`
  flex: 1 0 calc(100vw - 30rem);

  display: flex;
  flex-direction: column;

  &-title {
    flex: 3 1 1rem;
    font-size: 1.5rem;
  }

  &-artist {
    flex: 2 1 1rem;
    font-size: 0.8rem;
  }
`;

type Props = {
  info: AudioInfo;
};

/** タイトルとアーティストをマーキーで表示 */
const MusicTitle: React.FC<Props> = ({
  info: {
    base: { title, artist },
  },
}) => {
  return (
    <span className={style}>
      <Marquee className={`${style}-title`}>{title}</Marquee>
      <Marquee className={`${style}-artist`}>{artist}</Marquee>
    </span>
  );
};

export default MusicTitle;
