import MakePlaylistButton from "./MakePlaylistButton";
import { stylePlaylists } from "./style.css";
import { For, useContext } from "solid-js";
import { ButtonClickEvent, Context } from "../RightMenu";
import { IconDotInfo } from "../Icon";
import { usePlaylists } from "~/hooks/createPlaylists";

type Props = {
  select: (playlist: string) => void;
};

/** show on right click */
const PlaylistList = (props: Props) => {
  const playlists = usePlaylists();
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
            playlists.deletePlaylist(name);
            useContext(Context)([], event);
          },
        },
      ],
      event
    );
  };

  return (
    <ul class={stylePlaylists}>
      <For each={Object.keys(playlists.playlists)}>
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
        <MakePlaylistButton makePlaylist={playlists.makePlaylist} />
      </li>
    </ul>
  );
};

export default PlaylistList;
