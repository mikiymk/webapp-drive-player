import { For } from "solid-js";

import type AudioInfo from "~/audio/AudioInfo";
import { useAudios } from "~/hooks/createFiles";
import useJacket from "~/hooks/useJacket";
import { stylePlaying } from "./style.css";

type Props = {
  info: AudioInfo;
  playingList: Iterable<string>;
};

/**
 * now playing audio info view
 */
const PlayingInfo = (props: Props) => {
  const jacket = useJacket(() => props.info.picture);
  const fileName = (id: string) => {
    const files = useAudios();
    const file = files.audios[id];
    return file?.title ?? "";
  };

  return (
    <div class={stylePlaying}>
      <span>{props.info.album}</span>
      <img src={jacket()} alt="album jacket" />
      <ol>
        <For each={Array.from(props.playingList)}>
          {id => <li>{fileName(id)}</li>}
        </For>
      </ol>
    </div>
  );
};

export default PlayingInfo;
