import { For } from "solid-js";

import { MenuProvider } from "~/components/PopUpMenu";
import { playlists, makePlaylist } from "~/hooks/createPlaylists";

import { MakePlaylistButton } from "./MakePlaylistButton";
import { PlaylistListItem } from "./PlaylistListItem";
import { PlaylistListMenu } from "./PlaylistListMenu";
import { stylePlaylists } from "./style.css";

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
