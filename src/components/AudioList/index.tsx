import { For, Show } from "solid-js";

import { MenuProvider } from "~/components/PopUpMenu";

import { getAudio } from "~/signals/audios";

import { AudioListItem } from "./AudioListItem";
import { AudioListMenu } from "./AudioListMenu";
import { body, head, itemArtist, list } from "./style.css";

import type { JSXElement } from "solid-js";

interface AudioListProps {
  audios: readonly string[];
  play: (idList: readonly string[], index: number) => void;
  extendMenu?: (props: { item: string; index: number }) => JSXElement;
}

export const AudioList = (props: AudioListProps) => {
  return (
    <table class={list}>
      <thead class={head}>
        <tr>
          <th>title</th>
          <th class={itemArtist}>artists</th>
          <th />
        </tr>
      </thead>
      <tbody class={body}>
        <For each={props.audios}>
          {(item, index) => (
            <Show when={getAudio(item)} keyed>
              {(audio) => (
                <MenuProvider
                  menu={
                    <AudioListMenu
                      item={item}
                      play={() => props.play(props.audios, index())}
                      extendMenu={
                        <Show when={props.extendMenu} keyed>
                          {(ExtendMenu) => (
                            <ExtendMenu item={item} index={index()} />
                          )}
                        </Show>
                      }
                    />
                  }
                >
                  <AudioListItem
                    audio={audio}
                    play={() => props.play(props.audios, index())}
                  />
                </MenuProvider>
              )}
            </Show>
          )}
        </For>
      </tbody>
    </table>
  );
};
