import { createMemo, createSignal, Show, For } from "solid-js";

import { AudioList } from "~/components/AudioList";
import { audios } from "~/signals/audios";

import { styleList } from "./style.css";

export type AlbumsProps = {
  play: (idList: readonly string[], index: number) => void;
  reset: () => void;
};

/**
 * list of musics
 */
export const Albums = (props: AlbumsProps) => {
  const [selected, select] = createSignal<string>();
  const albums = createMemo(() => {
    const list: Record<string, Record<number, Record<number, string[]>>> = {};

    for (const [id, info] of audios()) {
      const album = list[info.album] ?? {};
      const disk = album[info.disk.no ?? -1] ?? {};
      const track = disk[info.track.no ?? -1] ?? [];

      track.push(id);

      disk[info.track.no ?? -1] = track;
      album[info.disk.no ?? -1] = disk;
      list[info.album] = album;
    }

    return list;
  });

  const album = createMemo(() => {
    const selectedAlbum = selected();
    if (!selectedAlbum) return;
    const album = albums()[selectedAlbum];
    if (!album) return;
    return Object.entries(album)
      .map(([k, v]) => [parseInt(k), v] as const)
      .sort((a, b) => a[0] - b[0])
      .flatMap(v => Object.entries(v[1]))
      .map(([k, v]) => [parseInt(k), v] as const)
      .sort((a, b) => a[0] - b[0])
      .flatMap(v => v[1]);
  });

  return (
    <>
      <h2>
        <button onClick={props.reset}>Albums</button>
        {" > "}
        <Show when={selected()} fallback="select Album" keyed>
          {selected => <button onClick={() => select()}>{selected}</button>}
        </Show>
      </h2>

      <div class={styleList}>
        <Show
          when={album()}
          fallback={
            <ul>
              <For each={Object.keys(albums())}>
                {artist => (
                  <li>
                    <button onClick={() => select(artist)}>{artist}</button>
                  </li>
                )}
              </For>
            </ul>
          }
          keyed>
          {selected => <AudioList audios={selected} play={props.play} />}
        </Show>
      </div>
    </>
  );
};
