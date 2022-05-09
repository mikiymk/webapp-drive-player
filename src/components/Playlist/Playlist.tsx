import { stylePlaylist } from "./style.css";
import { For, useContext } from "solid-js";
import { Context } from "../RightMenu";
import type Item from "../RightMenu/Item";
import { IconDotInfo } from "../Icon";
import { usePlaylists } from "~/hooks/createPlaylists";
import { useAudios } from "~/hooks/createFiles";

type Props = {
  name: string;

  reset: () => void;
  playsList: (list: string[], index: number) => void;
};

/** show on right click */
const Playlist = (props: Props) => {
  const audios = useAudios();
  const playlists = usePlaylists();
  const onClickIcon = (index: number): Item[] => [
    {
      type: "button",
      label: "play",
      onClick: () =>
        props.playsList(playlists.playlists[props.name]?.audios ?? [], index),
    },
    {
      type: "button",
      label: "remove from playlist",
      onClick: () => playlists.removeAudioFromPlaylist(props.name, index),
    },
  ];

  return (
    <div class={stylePlaylist}>
      <h3>{props.name}</h3>
      <button onClick={() => props.reset()}>back to list</button>
      <button
        onClick={() =>
          props.playsList(playlists.playlists[props.name]?.audios ?? [], 0)
        }>
        play this playlist
      </button>
      <ul>
        <For each={playlists.playlists[props.name]?.audios ?? []}>
          {(audio, index) => (
            <li>
              {audios.audios[audio]?.title ?? ""}
              <button
                onClick={event =>
                  useContext(Context)(onClickIcon(index()), event)
                }>
                <IconDotInfo />
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default Playlist;
