import { PlaylistList } from "./PlaylistList";
import { Playlist } from "./Playlist";
import { createSignal, Show } from "solid-js";

export type PlaylistsProps = {
  playsList: (list: string[], index: number) => void;
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
