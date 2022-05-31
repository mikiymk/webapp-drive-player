import { createSignal, For, mapArray, useContext } from "solid-js";

import { IconDotInfo } from "~/components/Icon";
import { Context } from "~/components/RightMenu";
import type Item from "~/components/RightMenu/Item";
import { getAudio } from "~/hooks/createAudios";
import { playlists, addAudio } from "~/hooks/createPlaylists";

import { sList, sItem, sHead, sDot, sItemArtist, sBody } from "./style.css";

export type AudioListProps = {
  audios: readonly string[];
  play: (idList: readonly string[], index: number) => void;
  extendMenu?: (item: string, index: number) => Item[];
};

export const AudioList = (props: AudioListProps) => {
  const rightMenu = useContext(Context);
  const [selected, setSelected] = createSignal<number[]>([]);

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
      list: mapArray(
        () => playlists,
        playlist =>
          playlist !== null && {
            type: "button" as const,
            label: playlist[0],
            onClick: () => addAudio(playlist[0], item),
          }
      )().filter(
        (v): v is { type: "button"; label: string; onClick: () => void } =>
          v !== false
      ),
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
                {getAudio(item)?.title}
              </td>
              <td
                class={sItemArtist}
                onClick={() => setSelected([index()])}
                onDblClick={() => props.play(props.audios, index())}>
                {getAudio(item)?.artists.join()}
              </td>
              <td class={sDot}>
                <button
                  onClick={event => rightMenu(onClick(item, index()), event)}>
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
