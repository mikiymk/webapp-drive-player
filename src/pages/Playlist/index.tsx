import { Show, createSignal } from "solid-js";

import { Playlist } from "./Playlist";
import { PlaylistList } from "./PlaylistList";

export type PlaylistsProps = {
  playsList: (list: readonly string[], index: number) => void;
};

/** show on right click */
export const Playlists = (props: PlaylistsProps) => {
  const [selectedPlaylist, setSelectedPlaylist] = createSignal("");

  return (
    <Show
      when={selectedPlaylist()}
      fallback={<PlaylistList select={setSelectedPlaylist} />}>
      {name => (
        <Playlist
          name={name}
          reset={() => setSelectedPlaylist("")}
          playsList={props.playsList}
        />
      )}
    </Show>
  );
};
