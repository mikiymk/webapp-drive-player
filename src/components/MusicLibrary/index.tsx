import { Item } from "./Item";

import { styleLibrary } from "./style.css";
import { createMemo, For } from "solid-js";
import { useAudios } from "~/hooks/createFiles";

type Props = {
  play: (idList: string[], index: number) => void;
  playlist: string[];
  addToPlaylist: (playlist: string, audioId: string) => void;
};

/**
 * list of musics
 */
const MusicList = (props: Props) => {
  const files = createMemo(() => {
    const files = useAudios();
    return Object.entries(files.audios);
  });

  return (
    <ul class={styleLibrary}>
      <For each={files()}>
        {([id, file], index) => (
          <Item
            id={id}
            name={file.title}
            play={() =>
              props.play(
                files().map(([k]) => k),
                index()
              )
            }
            playlist={props.playlist}
            addToPlaylist={props.addToPlaylist}
          />
        )}
      </For>
    </ul>
  );
};

export default MusicList;
