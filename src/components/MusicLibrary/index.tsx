import { Item } from "./Item";

import { styleLibrary } from "./style.css";
import { createMemo, For } from "solid-js";
import { useAudios } from "~/hooks/createFiles";

type Props = {
  play: (idList: string[], index: number) => void;
};

/**
 * list of musics
 */
const MusicList = (props: Props) => {
  const audios = useAudios();
  const AudioIDs = createMemo(() => Object.keys(audios.audios));

  return (
    <ul class={styleLibrary}>
      <For each={Object.entries(audios.audios)}>
        {([id, file], index) => (
          <Item
            id={id}
            name={file.title}
            play={() => props.play(AudioIDs(), index())}
          />
        )}
      </For>
    </ul>
  );
};

export default MusicList;
