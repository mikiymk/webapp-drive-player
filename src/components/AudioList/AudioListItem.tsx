import { createSignal } from "solid-js";

import { IconDotInfo } from "~/components/Icon";

import { usePopMenu } from "~/components/PopUpMenu";

import { itemMore, item, itemArtist } from "./style.css";

import type { AudioInfo } from "~/audio/AudioInfo";

interface AudioListItemProps {
  audio: AudioInfo;
  play: () => void;
}

export const AudioListItem = (props: AudioListItemProps) => {
  const [selected, setSelected] = createSignal(false);
  const popMenu = usePopMenu();

  return (
    <tr
      classList={{
        [item]: true,
        selected: selected(),
      }}
      onClick={() => setSelected(true)}
      // eslint-disable-next-line solid/event-handlers
      onDblClick={() => props.play()}
      onContextMenu={popMenu}
    >
      <td>{props.audio.title}</td>
      <td class={itemArtist}>{props.audio.artists.join()}</td>
      <td class={itemMore}>
        <button onClick={popMenu}>
          <IconDotInfo />
        </button>
      </td>
    </tr>
  );
};
