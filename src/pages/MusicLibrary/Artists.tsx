import { For, Show, createMemo, createSignal } from "solid-js";

import { AudioList } from "~/components/AudioList";
import { audios } from "~/signals/audios";

import { list } from "./style.css";

interface ArtistsProps {
  play: (idList: readonly string[], index: number) => void;
  reset: () => void;
}

/**
 * list of musics
 */
export const Artists = (props: ArtistsProps) => {
  const [selected, select] = createSignal<string>();
  const artists = createMemo(() => {
    const list: Record<string, string[]> = {};

    for (const [id, info] of audios()) {
      for (const artist of info.artists) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
        <button
          type="button"
          onClick={() => {
            props.reset();
          }}
        >
          Artists
        </button>
        {" > "}
        <Show when={selected()} fallback="select Artist" keyed>
          {(selected) => (
            <button
              type="button"
              onClick={() => {
                select();
              }}
            >
              {selected}
            </button>
          )}
        </Show>
      </h2>

      <div class={list}>
        <Show
          when={artist()}
          fallback={
            <ul>
              <For each={Object.keys(artists())}>
                {(artist) => (
                  <li>
                    <button type="button" onClick={() => select(artist)}>
                      {artist}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          }
          keyed
        >
          {(selected) => <AudioList audios={selected} play={props.play} />}
        </Show>
      </div>
    </>
  );
};
