import { Marquee } from "~/components/Marquee";

import { artist, title, titleBox } from "./style.css";

import type { AudioInfo } from "~/audio/AudioInfo";

interface MusicTitleProps {
  info: AudioInfo;
}

/** タイトルとアーティストをマーキーで表示 */
export const MusicTitle = (props: MusicTitleProps) => {
  return (
    <span class={titleBox}>
      <Marquee class={title}>{props.info.title}</Marquee>
      <Marquee class={artist}>{props.info.artists.join()}</Marquee>
    </span>
  );
};
