import { For } from "solid-js";

import { Menu, MenuItem, MenuSeparator, SubMenu } from "~/components/PopUpMenu";
import { addAudio, getPlaylistEntries } from "~/signals/playlists";

import type { JSXElement } from "solid-js";
import type { AudioID } from "~/signals/audios";

interface AudioListMenuProps {
  item: AudioID;
  play: () => void;
  extendMenu: JSXElement;
}

export const AudioListMenu = (props: AudioListMenuProps) => {
  return (
    <Menu>
      <MenuItem
        onClick={() => {
          props.play();
        }}
      >
        play
      </MenuItem>
      <MenuSeparator />
      <SubMenu label="add to playlist">
        <For each={getPlaylistEntries()}>
          {(playlist) => (
            <MenuItem
              onClick={() => {
                addAudio(playlist[0], props.item);
              }}
            >
              {playlist[0]}
            </MenuItem>
          )}
        </For>
      </SubMenu>
      {props.extendMenu}
    </Menu>
  );
};
