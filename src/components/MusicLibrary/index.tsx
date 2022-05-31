import { audios } from "~/hooks/createAudios";

import { AudioList } from "../AudioList";

export type LibraryProps = {
  play: (idList: readonly string[], index: number) => void;
};

/**
 * list of musics
 */
export const Library = (props: LibraryProps) => {
  return <AudioList audios={Array.from(audios().keys())} play={props.play} />;
};
