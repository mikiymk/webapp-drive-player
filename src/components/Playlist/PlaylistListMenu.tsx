import { Menu, MenuItem } from "~/components/PopUpMenu";
import { deletePlaylist } from "~/hooks/createPlaylists";

export type PlaylistListMenuProps = {
  name: string;
  select: (name: string) => void;
};

export const PlaylistListMenu = (props: PlaylistListMenuProps) => {
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
