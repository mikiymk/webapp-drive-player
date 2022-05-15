import { createMemo } from "solid-js";
import { useAudios } from "~/hooks/createFiles";
import { AudioList } from "../AudioList";

type Props = {
  play: (idList: string[], index: number) => void;
};

/**
 * list of musics
 */
const MusicList = (props: Props) => {
  const audios = useAudios();
  const AudioIDs = createMemo(() => Object.keys(audios.audios));

  return <AudioList audios={AudioIDs()} play={props.play} />;
};

export default MusicList;
