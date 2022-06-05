import { createMemo, createSignal, For, Show } from "solid-js";

import { audios } from "~/hooks/createAudios";

import { AudioList } from "../AudioList";

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
    <div>
      <h2>
        <button onclick={props.reset}>Artists</button>
        {" > "}
        <Show when={selected()} fallback="select Artist">
          {selected => <button onclick={() => select()}>{selected}</button>}
        </Show>
      </h2>

      <Show
        when={artist()}
        fallback={
          <ul>
            <For each={Object.keys(artists())}>
              {artist => (
                <li>
                  <button onclick={() => select(artist)}>{artist}</button>
                </li>
              )}
            </For>
          </ul>
        }>
        {selected => <AudioList audios={selected} play={props.play} />}
      </Show>
    </div>
  );
};
