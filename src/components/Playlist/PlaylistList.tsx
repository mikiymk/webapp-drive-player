import MakePlaylistButton from "./MakePlaylistButton";
import useRightMenu from "~/hooks/useRightMenu";
import IconButton from "~/components/IconButton";
import { stylePlaylists } from "./style.css";
import { For } from "solid-js";

type Props = {
  playlists: string[];
  makePlaylist: (playlist: string) => void;
  deletePlaylist: (playlist: string) => void;

  select: (playlist: string) => void;
};

/** show on right click */
const PlaylistList = (props: Props) => {
  const rightMenu = useRightMenu();
  const onClickIcon = (name: string) =>
    rightMenu([
      {
        type: "button",
        label: "open playlist",
        onClick: event => {
          props.select(name);
          rightMenu([])(event);
        },
      },
      {
        type: "button",
        label: "delete playlist",
        onClick: event => {
          props.deletePlaylist(name);
          rightMenu([])(event);
        },
      },
    ]);

  return (
    <ul class={stylePlaylists}>
      <For each={props.playlists}>
        {name => (
          <li>
            {name}
            <IconButton icon="more_horiz" onClick={onClickIcon(name)} />
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
