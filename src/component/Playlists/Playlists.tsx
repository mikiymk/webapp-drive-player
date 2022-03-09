import React from "react";
import { css } from "@linaria/core";
import usePlaylist from "hooks/usePlaylist";
import MakePlaylistButton from "./MakePlaylistButton";
import useRightMenu from "component/RightMenu/useRightMenu";
import IconButton from "component/Common/IconButton";

const style = css``;

type Props = {};

/** show on right click */
const Playlists: React.FC<Props> = () => {
  const { playlists, makePlaylist, deletePlaylist } = usePlaylist();
  const rightMenu = useRightMenu();

  return (
    <div className={style}>
      <ul>
        {Object.entries(playlists).map(([name]) => (
          <li key={name}>
            {name}
            <IconButton
              icon="more_horiz"
              onClick={rightMenu([
                { type: "button", label: "open playlist", onClick: () => {} },
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
    </div>
  );
};

export default Playlists;
