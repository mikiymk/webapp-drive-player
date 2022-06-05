import { audios } from "~/hooks/createAudios";

import { AudioList } from "../AudioList";

export type AlbumsProps = {
  play: (idList: readonly string[], index: number) => void;
  reset: () => void;
};

/**
 * list of musics
 */
export const Albums = (props: AlbumsProps) => {
  return (
    <div>
      <h2>
        <button onclick={props.reset}>Albums</button>
      </h2>
      <AudioList audios={Array.from(audios().keys())} play={props.play} />
    </div>
  );
};
