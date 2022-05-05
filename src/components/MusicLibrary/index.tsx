import { Item } from "./Item";

import type { Files } from "~/components/MusicPlayer";

import { styleLibrary } from "./style.css";
import { For } from "solid-js";

type Props = {
  files: Files;
  play: (idList: string[], index: number) => void;
  playlist: string[];
  addToPlaylist: (playlist: string, audioId: string) => void;
};

/**
 * list of musics
 */
const MusicList = (props: Props) => {
  return (
    <ul class={styleLibrary}>
      <For each={Object.values(props.files)}>
        {(file, index) => (
          <Item
            id={file.id}
            name={file.name}
            play={() => props.play(Object.keys(props.files), index())}
            playlist={props.playlist}
            addToPlaylist={props.addToPlaylist}
          />
        )}
      </For>
    </ul>
  );
};

export default MusicList;
