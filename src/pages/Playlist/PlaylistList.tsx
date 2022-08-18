import { batch, createSignal, For, Show } from "solid-js";

import { MenuProvider } from "~/components/PopUpMenu";
import { makePlaylist, playlists } from "~/signals/playlists";

import { MakePlaylistButton } from "./MakePlaylistButton";
import { PlaylistListItem } from "./PlaylistListItem";
import { PlaylistListMenu } from "./PlaylistListMenu";
import { RenameDialog } from "./RenameDialog";
import { stylePlaylists } from "./style.css";

export type PlaylistListProps = {
  select: (playlist: string) => void;
};

/** show on right click */
export const PlaylistList = (props: PlaylistListProps) => {
  const [open, setOpen] = createSignal(false);
  const [name, setName] = createSignal<string>();
  const [onClose, setOnClose] = createSignal<(name?: string) => void>(() => 0);
  const openDialog = (name: string, onClose: (name?: string) => void) => {
    batch(() => {
      setName(name);
      setOpen(true);
      setOnClose(() => onClose);
    });
  };
  const closeDialog = (name?: string) => {
    setOpen(false);
    onClose()(name);
  };

  return (
    <>
      <ul class={stylePlaylists}>
        <For each={Array.from(playlists())}>
          {playlist => (
            <MenuProvider
              menu={
                <PlaylistListMenu
                  name={playlist[0]}
                  select={name => props.select(name)}
                  openDialog={openDialog}
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
      <Show when={open()}>
        <RenameDialog name={name()} close={closeDialog} />
      </Show>
    </>
  );
};
