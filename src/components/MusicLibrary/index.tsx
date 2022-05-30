import { createMemo } from "solid-js";

import { audios } from "~/hooks/createAudios";

import { AudioList } from "../AudioList";

export type LibraryProps = {
  play: (idList: string[], index: number) => void;
};

/**
 * list of musics
 */
export const Library = (props: LibraryProps) => {
  const AudioIDs = createMemo(() => Object.keys(audios()));

  return <AudioList audios={AudioIDs()} play={props.play} />;
};
