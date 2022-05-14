import { createMemo, createSignal, For, mapArray, useContext } from "solid-js";
import { useAudios } from "~/hooks/createFiles";
import { usePlaylists } from "~/hooks/createPlaylists";
import { IconDotInfo } from "../Icon";
import { Context } from "../RightMenu";
import type Item from "../RightMenu/Item";
import { sList, sItem, sHead, sDot, sItemArtist, sBody } from "./style.css";

type Props = {
  audios: string[];
  play: (idList: string[], index: number) => void;
  extendMenu?: (item: string, index: number) => Item[];
};

const AudioList = (props: Props) => {
  const audios = useAudios();
  const playlists = usePlaylists();
  const rightMenu = useContext(Context);
  const [selected, setSelected] = createSignal<number[]>([]);
  const playlistNames = createMemo(() => Object.keys(playlists.playlists));

  const onClick = (item: string, index: number): Item[] => [
    {
      type: "button",
      label: "play",
      onClick: () => props.play(props.audios, index),
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
    ...(props.extendMenu?.(item, index) ?? []),
  ];

  return (
    <table class={sList}>
      <thead class={sHead}>
        <tr>
          <th>title</th>
          <th class={sItemArtist}>artists</th>
          <th></th>
        </tr>
      </thead>
      <tbody class={sBody}>
        <For each={props.audios}>
          {(item, index) => (
            <tr
              classList={{
                [sItem]: true,
                selected: selected().includes(index()),
              }}>
              <td
                onClick={() => setSelected([index()])}
                onDblClick={() => props.play(props.audios, index())}>
                {audios.audios[item]?.title}
              </td>
              <td
                class={sItemArtist}
                onClick={() => setSelected([index()])}
                onDblClick={() => props.play(props.audios, index())}>
                {audios.audios[item]?.artists.join()}
              </td>
              <td class={sDot}>
                <button onClick={[rightMenu, onClick(item, index())]}>
                  <IconDotInfo />
                </button>
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default AudioList;
