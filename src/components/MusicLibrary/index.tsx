import { createMemo } from "solid-js";

import { useAudios } from "~/hooks/createFiles";

import { AudioList } from "../AudioList";

export type LibraryProps = {
  play: (idList: string[], index: number) => void;
};

/**
 * list of musics
 */
export const Library = (props: LibraryProps) => {
  const audios = useAudios();
  const AudioIDs = createMemo(() => Object.keys(audios.audios));

  return <AudioList audios={AudioIDs()} play={props.play} />;
};
