import React from "react";
import MakePlaylistButton from "./MakePlaylistButton";
import useRightMenu from "hooks/useRightMenu";
import IconButton from "components/IconButton";
import { stylePlaylists } from "./style.css";

type Props = {
  playlists: Record<string, string[]>;
  makePlaylist: (playlist: string) => void;
  deletePlaylist: (playlist: string) => void;

  select: (playlist: string) => void;
};

/** show on right click */
const PlaylistList: React.FC<Props> = ({
  playlists,
  makePlaylist,
  deletePlaylist,

  select,
}) => {
  const rightMenu = useRightMenu();

  return (
    <ul className={stylePlaylists}>
      {Object.entries(playlists).map(([name]) => (
        <li key={name}>
          {name}
          <IconButton
            icon="more_horiz"
            onClick={rightMenu([
              {
                type: "button",
                label: "open playlist",
                onClick: event => {
                  select(name);
                  rightMenu([])(event);
                },
              },
              {
                type: "button",
                label: "delete playlist",
                onClick: event => {
                  deletePlaylist(name);
                  rightMenu([])(event);
                },
              },
            ])}
          />
        </li>
      ))}
      <li>
        <MakePlaylistButton makePlaylist={makePlaylist} />
      </li>
    </ul>
  );
};

export default PlaylistList;
