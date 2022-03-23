import React from "react";
import { css } from "@linaria/core";
import MakePlaylistButton from "./MakePlaylistButton";
import useRightMenu from "component/RightMenu/useRightMenu";
import IconButton from "component/Common/IconButton";

const style = css``;

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
    <ul className={style}>
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
