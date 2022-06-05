import { createSignal } from "solid-js";

import { IconDotInfo } from "~/components/Icon";

import { usePopMenu } from "~/components/PopUpMenu";

import { sDot, sItem, sItemArtist } from "./style.css";

import type { AudioInfo } from "~/audio/AudioInfo";

export type AudioListItemProps = {
  audio: AudioInfo;
  play: () => void;
};

export const AudioListItem = (props: AudioListItemProps) => {
  const [selected, setSelected] = createSignal(false);
  const popMenu = usePopMenu();

  return (
    <tr
      classList={{
        [sItem]: true,
        selected: selected(),
      }}
      onClick={() => setSelected(true)}
      onDblClick={() => props.play()}
      oncontextmenu={popMenu}>
      <td>{props.audio?.title}</td>
      <td class={sItemArtist}>{props.audio?.artists.join()}</td>
      <td class={sDot}>
        <button onClick={popMenu}>
          <IconDotInfo />
        </button>
      </td>
    </tr>
  );
};
