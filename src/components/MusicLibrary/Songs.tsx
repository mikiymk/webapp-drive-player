import { audios } from "~/signals/audios";

import { AudioList } from "../AudioList";

import { styleList } from "./style.css";

export type SongsProps = {
  play: (idList: readonly string[], index: number) => void;
  reset: () => void;
};

/**
 * list of musics
 */
export const Songs = (props: SongsProps) => {
  return (
    <>
      <h2>
        <button onClick={props.reset}>Songs</button>
      </h2>
      <div class={styleList}>
        <AudioList audios={Array.from(audios().keys())} play={props.play} />
      </div>
    </>
  );
};
