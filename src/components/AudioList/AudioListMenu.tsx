import { For } from "solid-js";

import { Menu, MenuItem, MenuSeparator, SubMenu } from "~/components/PopUpMenu";
import { addAudio, playlists } from "~/signals/playlists";

import type { JSXElement } from "solid-js";
import type { AudioID } from "~/signals/audios";

export type AudioListMenuProps = {
  item: AudioID;
  play: () => void;
  extendMenu: JSXElement;
};

export const AudioListMenu = (props: AudioListMenuProps) => {
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
