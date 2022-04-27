import { File } from "~/file";
import Icon from "~/components/GoogleIcon";
import useRightMenu from "~/hooks/useRightMenu";
import { stylePlaylist } from "./style.css";
import { For } from "solid-js";

type Props = {
  files: Record<string, File>;
  name: string;
  audioIDs: string[];

  reset: () => void;
  playsList: (list: string[], index: number) => void;
  remove: (index: number) => void;
};

/** show on right click */
const Playlist = (props: Props) => {
  const onClickIcon = (index: number) =>
    useRightMenu()([
      {
        type: "button",
        label: "play",
        onClick: () => props.playsList(props.audioIDs, index),
      },
      {
        type: "button",
        label: "remove from playlist",
        onClick: () => props.remove(index),
      },
    ]);

  return (
    <div class={stylePlaylist}>
      <h3>{props.name}</h3>
      <button onClick={() => props.reset()}>back to list</button>
      <button onClick={() => props.playsList(props.audioIDs, 0)}>
        play this playlist
      </button>
      <ul>
        <For each={props.audioIDs}>
          {(id, index) => (
            <li>
              {props.files[id].info?.title ?? props.files[id].name}
              <button onClick={event => onClickIcon(index())(event)}>
                <Icon icon="more_horiz" />
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default Playlist;
