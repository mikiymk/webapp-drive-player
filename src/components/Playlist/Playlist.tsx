import type { File } from "~/file";
import Icon from "~/components/GoogleIcon";
import { stylePlaylist } from "./style.css";
import { For, useContext } from "solid-js";
import { Context } from "../RightMenu";
import type Item from "../RightMenu/Item";

type Props = {
  files: Record<string, File>;
  name: string;
  audios: { id: string; title: string }[];

  reset: () => void;
  playsList: (list: string[], index: number) => void;
  remove: (index: number) => void;
};

/** show on right click */
const Playlist = (props: Props) => {
  const onClickIcon = (index: number): Item[] => [
    {
      type: "button",
      label: "play",
      onClick: () =>
        props.playsList(
          props.audios.map(({ id }) => id),
          index
        ),
    },
    {
      type: "button",
      label: "remove from playlist",
      onClick: () => props.remove(index),
    },
  ];

  return (
    <div class={stylePlaylist}>
      <h3>{props.name}</h3>
      <button onClick={() => props.reset()}>back to list</button>
      <button
        onClick={() =>
          props.playsList(
            props.audios.map(({ id }) => id),
            0
          )
        }>
        play this playlist
      </button>
      <ul>
        <For each={props.audios}>
          {(audio, index) => (
            <li>
              {audio.title}
              <button
                onClick={event =>
                  useContext(Context)(onClickIcon(index()), event)
                }>
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
