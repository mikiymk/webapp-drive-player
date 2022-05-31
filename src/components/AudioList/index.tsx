import { createSignal, For, JSXElement, Show } from "solid-js";
import type { AudioInfo } from "~/audio/AudioInfo";

import { IconDotInfo } from "~/components/Icon";
import { AudioID, getAudio } from "~/hooks/createAudios";
import { playlists, addAudio } from "~/hooks/createPlaylists";
import {
  Menu,
  MenuItem,
  MenuProvider,
  MenuSeparator,
  usePopMenu,
  SubMenu,
} from "../PopUpMenu";

import { sList, sItem, sHead, sDot, sItemArtist, sBody } from "./style.css";

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

type AudioListItemProps = {
  audio: AudioInfo | undefined;
  play: () => void;
};

const AudioListItem = (props: AudioListItemProps) => {
  const [selected, setSelected] = createSignal(false);
  const popMenu = usePopMenu();

  return (
    <tr
      classList={{
        [sItem]: true,
        selected: selected(),
      }}>
      <td onClick={() => setSelected(true)} onDblClick={() => props.play()}>
        {props.audio?.title}
      </td>
      <td
        class={sItemArtist}
        onClick={() => setSelected(true)}
        onDblClick={() => props.play()}>
        {props.audio?.artists.join()}
      </td>
      <td class={sDot}>
        <button onClick={popMenu}>
          <IconDotInfo />
        </button>
      </td>
    </tr>
  );
};

type AudioListMenuProps = {
  item: AudioID;
  play: () => void;
  extendMenu: JSXElement;
};

const AudioListMenu = (props: AudioListMenuProps) => {
  return (
    <Menu>
      <MenuItem onClick={() => props.play()}>play</MenuItem>
      <MenuSeparator />
      <SubMenu label="add to playlist">
        <For each={Array.from(playlists())}>
          {playlist => (
            <MenuItem onClick={() => addAudio(playlist[0], props.item)}>
              {playlist[0]}
            </MenuItem>
          )}
        </For>
      </SubMenu>
      {props.extendMenu}
    </Menu>
  );
};
