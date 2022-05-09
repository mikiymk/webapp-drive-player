import PlaylistList from "./PlaylistList";
import Playlist from "./Playlist";
import { createSignal, Show } from "solid-js";

type Props = {
  playsList: (list: string[], index: number) => void;
};

/** show on right click */
const Playlists = (props: Props) => {
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

export default Playlists;
