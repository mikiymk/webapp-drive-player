import { AudioList } from "~/components/AudioList";
import { MenuItem } from "~/components/PopUpMenu";
import { playlists, removeAudio } from "~/hooks/createPlaylists";

import { stylePlaylist } from "./style.css";

export type PlaylistProps = {
  name: string;

  reset: () => void;
  playsList: (list: readonly string[], index: number) => void;
};

/** show on right click */
export const Playlist = (props: PlaylistProps) => {
  return (
    <div class={stylePlaylist}>
      <h3>{props.name}</h3>
      <button onClick={() => props.reset()}>back to list</button>
      <button
        onClick={() => props.playsList(playlists().get(props.name) ?? [], 0)}>
        play this playlist
      </button>
      <AudioList
        audios={playlists().get(props.name) ?? []}
        play={props.playsList}
        extendMenu={innerProps => (
          <MenuItem onClick={() => removeAudio(props.name, innerProps.index)}>
            remove from playlist
          </MenuItem>
        )}
      />
    </div>
  );
};
