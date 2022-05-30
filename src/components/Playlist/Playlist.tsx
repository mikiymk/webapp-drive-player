import { playlists, removeAudio } from "~/hooks/createPlaylists";
import { AudioList } from "~/components/AudioList";

import { stylePlaylist } from "./style.css";

export type PlaylistProps = {
  name: string;

  reset: () => void;
  playsList: (list: string[], index: number) => void;
};

/** show on right click */
export const Playlist = (props: PlaylistProps) => {
  return (
    <div class={stylePlaylist}>
      <h3>{props.name}</h3>
      <button onClick={() => props.reset()}>back to list</button>
      <button
        onClick={() =>
          props.playsList(playlists()[props.name]?.audios ?? [], 0)
        }>
        play this playlist
      </button>
      <AudioList
        audios={playlists()[props.name]?.audios ?? []}
        play={props.playsList}
        extendMenu={(_, index) => [
          {
            type: "button",
            label: "remove from playlist",
            onClick: () => removeAudio(props.name, index),
          },
        ]}
      />
    </div>
  );
};
