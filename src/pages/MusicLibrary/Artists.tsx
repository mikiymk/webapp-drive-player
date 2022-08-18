import { createMemo, createSignal, For, Show } from "solid-js";

import { AudioList } from "~/components/AudioList";
import { audios } from "~/signals/audios";

import { styleList } from "./style.css";

export type ArtistsProps = {
  play: (idList: readonly string[], index: number) => void;
  reset: () => void;
};

/**
 * list of musics
 */
export const Artists = (props: ArtistsProps) => {
  const [selected, select] = createSignal<string>();
  const artists = createMemo(() => {
    const list: Record<string, string[]> = {};

    for (const [id, info] of audios()) {
      for (const artist of info.artists) {
        list[artist] ??= [];
        list[artist]?.push(id);
      }
    }

    return list;
  });

  const artist = () => {
    const selectedArtist = selected();
    if (!selectedArtist) return;
    return artists()[selectedArtist];
  };

  return (
    <>
      <h2>
        <button onClick={props.reset}>Artists</button>
        {" > "}
        <Show when={selected()} fallback="select Artist">
          {selected => <button onClick={() => select()}>{selected}</button>}
        </Show>
      </h2>

      <div class={styleList}>
        <Show
          when={artist()}
          fallback={
            <ul>
              <For each={Object.keys(artists())}>
                {artist => (
                  <li>
                    <button onClick={() => select(artist)}>{artist}</button>
                  </li>
                )}
              </For>
            </ul>
          }>
          {selected => <AudioList audios={selected} play={props.play} />}
        </Show>
      </div>
    </>
  );
};
