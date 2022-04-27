import Marquee from "~/components/Marquee";
import AudioInfo from "~/audio/AudioInfo";
import { styleArtist, styleTitle, styleTitleView } from "./style.css";

type Props = AudioInfo;

/** タイトルとアーティストをマーキーで表示 */
const MusicTitle = (props: Props) => {
  return (
    <span class={styleTitleView}>
      <Marquee class={styleTitle}>{props.title}</Marquee>
      <Marquee class={styleArtist}>{props.artist}</Marquee>
    </span>
  );
};

export default MusicTitle;
