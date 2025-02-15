import { AudioList } from "~/components/AudioList";
import { MenuItem } from "~/components/PopUpMenu";
import { getPlaylist, removeAudio } from "~/signals/playlists";

import { plOne } from "./style.css";

interface PlaylistProps {
  name: string;

  reset: () => void;
  playsList: (list: readonly string[], index: number) => void;
}

/** show on right click */
export const Playlist = (props: PlaylistProps) => {
  return (
    <div class={plOne}>
      <h3>{props.name}</h3>
      <button
        type="button"
        onClick={() => {
          props.reset();
        }}
      >
        back to list
      </button>
      <button
        type="button"
        onClick={() => {
          props.playsList(getPlaylist(props.name) ?? [], 0);
        }}
      >
        play this playlist
      </button>
      <AudioList
        audios={getPlaylist(props.name) ?? []}
        play={props.playsList}
        extendMenu={(innerProps) => (
          <MenuItem
            onClick={() => {
              removeAudio(props.name, innerProps.index);
            }}
          >
            remove from playlist
          </MenuItem>
        )}
      />
    </div>
  );
};
