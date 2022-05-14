import { Accessor, createMemo, createSignal, For, mapArray } from "solid-js";
import { useAudios } from "~/hooks/createFiles";
import { usePlaylists } from "~/hooks/createPlaylists";
import { IconDotInfo } from "../Icon";
import type Item from "../RightMenu/Item";
import { styleList, styleListItem } from "./style.css";

type Props = {
  audios: string[];
  play: (idList: string[], index: number) => void;
};

const AudioList = (props: Props) => {
  const audios = useAudios();
  const [selected, setSelected] = createSignal<number[]>([]);
  const playlists = usePlaylists();
  const playlistNames = createMemo(() => Object.keys(playlists.playlists));

  const onClick = (item: string, index: Accessor<number>): Item[] => [
    {
      type: "button",
      label: "play",
      onClick: () => props.play(props.audios, index()),
    },
    { type: "hr" },
    {
      type: "list",
      label: "add to playlist",
      list: mapArray(playlistNames, name => ({
        type: "button" as const,
        label: name,
        onClick: () => playlists.addAudioToPlaylist(name, item),
      }))(),
    },
  ];

  return (
    <ul class={styleList}>
      <For each={props.audios}>
        {(item, index) => (
          <li
            classList={{
              [styleListItem]: true,
              selected: selected().includes(index()),
            }}
            onClick={() => setSelected([index()])}
            onDblClick={() => props.play(props.audios, index())}>
            <span>{audios.audios[item]?.title}</span>
            <span>{audios.audios[item]?.artists.join()}</span>
            <button onClick={() => onClick(item, index)}>
              <IconDotInfo />
            </button>
          </li>
        )}
      </For>
    </ul>
  );
};

export default AudioList;
