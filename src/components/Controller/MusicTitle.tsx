import Marquee from "~/components/Marquee";
import type AudioInfo from "~/audio/AudioInfo";
import { styleArtist, styleTitle, styleTitleView } from "./style.css";

type Props = {
  info: AudioInfo;
};

/** タイトルとアーティストをマーキーで表示 */
const MusicTitle = (props: Props) => {
  return (
    <span class={styleTitleView}>
      <Marquee class={styleTitle}>{props.info.title}</Marquee>
      <Marquee class={styleArtist}>{props.info.artist}</Marquee>
    </span>
  );
};

export default MusicTitle;
