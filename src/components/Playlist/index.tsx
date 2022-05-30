import { createSignal, Show } from "solid-js";

import { PlaylistList } from "./PlaylistList";
import { Playlist } from "./Playlist";

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
