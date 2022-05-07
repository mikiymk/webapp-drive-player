import MakePlaylistButton from "./MakePlaylistButton";
import { stylePlaylists } from "./style.css";
import { For, useContext } from "solid-js";
import { ButtonClickEvent, Context } from "../RightMenu";
import { IconDotInfo } from "../Icon";

type Props = {
  playlists: string[];
  makePlaylist: (playlist: string) => void;
  deletePlaylist: (playlist: string) => void;

  select: (playlist: string) => void;
};

/** show on right click */
const PlaylistList = (props: Props) => {
  const onClickIcon = (name: string, event: ButtonClickEvent) => {
    console.log("onClickIcon");
    const callRightMenu = useContext(Context);
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
            props.deletePlaylist(name);
            useContext(Context)([], event);
          },
        },
      ],
      event
    );
  };

  return (
    <ul class={stylePlaylists}>
      <For each={props.playlists}>
        {name => (
          <li>
            {name}
            <button onClick={[onClickIcon, name]}>
              <IconDotInfo />
            </button>
          </li>
        )}
      </For>

      <li>
        <MakePlaylistButton makePlaylist={props.makePlaylist} />
      </li>
    </ul>
  );
};

export default PlaylistList;
