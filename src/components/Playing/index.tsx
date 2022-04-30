import { For } from "solid-js";

import type AudioInfo from "~/audio/AudioInfo";
import type { Files } from "~/components/MusicPlayer";
import useJacket from "~/hooks/useJacket";
import { stylePlaying } from "./style.css";

type Props = {
  info: AudioInfo;
  files: Files;
  playingList: Iterable<string>;
};

/**
 * now playing audio info view
 */
const PlayingInfo = (props: Props) => {
  const jacket = useJacket(() => props.info.picture);

  return (
    <div class={stylePlaying}>
      <span>{props.info.album}</span>
      <img src={jacket()} alt="album jacket" />
      <ol>
        <For each={Array.from(props.playingList)}>
          {id => <li>{props.files[id]?.name ?? ""}</li>}
        </For>
      </ol>
    </div>
  );
};

export default PlayingInfo;
