import { audios } from "~/hooks/createAudios";

import { AudioList } from "../AudioList";

export type SongsProps = {
  play: (idList: readonly string[], index: number) => void;
  reset: () => void;
};

/**
 * list of musics
 */
export const Songs = (props: SongsProps) => {
  return (
    <div>
      <h2>
        <button onclick={props.reset}>Songs</button>
      </h2>
      <AudioList audios={Array.from(audios().keys())} play={props.play} />
    </div>
  );
};
