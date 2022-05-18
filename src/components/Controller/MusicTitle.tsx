import type { AudioInfo } from "~/audio/AudioInfo";
import { Marquee } from "~/components/Marquee";

import { styleArtist, styleTitle, styleTitleView } from "./style.css";

export type MusicTitleProps = {
  info: AudioInfo;
};

/** タイトルとアーティストをマーキーで表示 */
export const MusicTitle = (props: MusicTitleProps) => {
  return (
    <span class={styleTitleView}>
      <Marquee class={styleTitle}>{props.info.title}</Marquee>
      <Marquee class={styleArtist}>{props.info.artists.join()}</Marquee>
    </span>
  );
};
