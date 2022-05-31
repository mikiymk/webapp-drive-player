import { For, useContext } from "solid-js";

import { ButtonClickEvent, Context } from "~/components/RightMenu";
import { IconDotInfo } from "~/components/Icon";
import {
  playlists,
  makePlaylist,
  deletePlaylist,
} from "~/hooks/createPlaylists";

import { MakePlaylistButton } from "./MakePlaylistButton";
import { stylePlaylists } from "./style.css";

export type PlaylistListProps = {
  select: (playlist: string) => void;
};

/** show on right click */
export const PlaylistList = (props: PlaylistListProps) => {
  const callRightMenu = useContext(Context);
  const onClickIcon = (name: string, event: ButtonClickEvent) => {
    console.log("onClickIcon");
    console.log(callRightMenu);
    return callRightMenu(
      [
        {
          type: "button",
          label: "open playlist",
          onClick: event => {
            props.select(name);
            useContext(Context)([], event);
          },
        },
        {
          type: "button",
          label: "delete playlist",
          onClick: event => {
            deletePlaylist(name);
            useContext(Context)([], event);
          },
        },
      ],
      event
    );
  };

  return (
    <ul class={stylePlaylists}>
      <For each={Array.from(playlists())}>
        {playlist => (
          <li>
            {playlist[0]}
            <button onClick={[onClickIcon, playlist[0]]}>
              <IconDotInfo />
            </button>
          </li>
        )}
      </For>

      <li>
        <MakePlaylistButton makePlaylist={makePlaylist} />
      </li>
    </ul>
  );
};
