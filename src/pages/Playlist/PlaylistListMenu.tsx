import { Menu, MenuItem, MenuSeparator } from "~/components/PopUpMenu";
import { deletePlaylist, renamePlaylist } from "~/signals/playlists";

interface PlaylistListMenuProps {
  name: string;
  select: (name: string) => void;
  openDialog: (name: string, onClose: (name?: string) => void) => void;
}

export const PlaylistListMenu = (props: PlaylistListMenuProps) => {
  return (
    <Menu>
      <MenuItem
        onClick={() => {
          props.select(props.name);
        }}
      >
        open playlist
      </MenuItem>
      <MenuItem
        onClick={() => {
          const name = props.name;
          props.openDialog(name, (newName) => {
            if (newName) renamePlaylist(name, newName);
          });
        }}
      >
        rename playlist
      </MenuItem>
      <MenuSeparator />
      <MenuItem
        onClick={() => {
          deletePlaylist(props.name);
        }}
      >
        delete playlist
      </MenuItem>
    </Menu>
  );
};
