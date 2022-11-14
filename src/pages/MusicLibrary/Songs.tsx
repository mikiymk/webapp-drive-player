import { AudioList } from "~/components/AudioList";
import { audios } from "~/signals/audios";

import { list } from "./style.css";

interface SongsProps {
  play: (idList: readonly string[], index: number) => void;
  reset: () => void;
}

/**
 * list of musics
 */
export const Songs = (props: SongsProps) => {
  return (
    <>
      <h2>
        <button onClick={() => props.reset()}>Songs</button>
      </h2>
      <div class={list}>
        <AudioList audios={Array.from(audios().keys())} play={props.play} />
      </div>
    </>
  );
};
