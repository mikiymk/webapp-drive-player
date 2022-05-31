import { For } from "solid-js";

import { IconDotInfo } from "~/components/Icon";
import {
  playlists,
  makePlaylist,
  deletePlaylist,
} from "~/hooks/createPlaylists";

import { MakePlaylistButton } from "./MakePlaylistButton";
import { stylePlaylists } from "./style.css";
import { Menu, MenuItem, MenuProvider, usePopMenu } from "../PopUpMenu";

export type PlaylistListProps = {
  select: (playlist: string) => void;
};

/** show on right click */
export const PlaylistList = (props: PlaylistListProps) => {
  return (
    <ul class={stylePlaylists}>
      <For each={Array.from(playlists())}>
        {playlist => (
          <MenuProvider
            menu={
              <PlaylistListMenu
                name={playlist[0]}
                select={name => props.select(name)}
              />
            }>
            <PlaylistListItem name={playlist[0]} />
          </MenuProvider>
        )}
      </For>

      <li>
        <MakePlaylistButton makePlaylist={makePlaylist} />
      </li>
    </ul>
  );
};

type PlaylistListItemProps = {
  name: string;
};

const PlaylistListItem = (props: PlaylistListItemProps) => {
  const popMenu = usePopMenu();
  return (
    <li>
      {props.name}
      <button onClick={event => popMenu(event)}>
        <IconDotInfo />
      </button>
    </li>
  );
};

type PlaylistListMenuProps = {
  name: string;
  select: (name: string) => void;
};

const PlaylistListMenu = (props: PlaylistListMenuProps) => {
  return (
    <Menu>
      <MenuItem onClick={() => props.select(props.name)}>
        open playlist
      </MenuItem>
      <MenuItem onClick={() => deletePlaylist(props.name)}>
        delete playlist
      </MenuItem>
    </Menu>
  );
};
