import { For, JSXElement, Show } from "solid-js";

import { getAudio } from "~/hooks/createAudios";
import { MenuProvider } from "~/components/PopUpMenu";

import { AudioListItem } from "./AudioListItem";
import { AudioListMenu } from "./AudioListMenu";
import { sList, sHead, sItemArtist, sBody } from "./style.css";

export type AudioListProps = {
  audios: readonly string[];
  play: (idList: readonly string[], index: number) => void;
  extendMenu?: (props: { item: string; index: number }) => JSXElement;
};

export const AudioList = (props: AudioListProps) => {
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
            <MenuProvider
              menu={
                <AudioListMenu
                  item={item}
                  play={() => props.play(props.audios, index())}
                  extendMenu={
                    <Show when={props.extendMenu}>
                      {ExtendMenu => <ExtendMenu item={item} index={index()} />}
                    </Show>
                  }
                />
              }>
              <AudioListItem
                audio={getAudio(item)}
                play={() => props.play(props.audios, index())}
              />
            </MenuProvider>
          )}
        </For>
      </tbody>
    </table>
  );
};
