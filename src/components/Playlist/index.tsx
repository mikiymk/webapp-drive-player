import PlaylistList from "./PlaylistList";
import Playlist from "./Playlist";
import type { File } from "~/file";
import { createSignal, Show } from "solid-js";

type Props = {
  files: Record<string, File>;
  playlist: {
    playlists: Record<string, string[]>;
    makePlaylist: (playlist: string) => void;
    deletePlaylist: (playlist: string) => void;
    addToPlaylist: (playlist: string, audioId: string) => void;
    removeFromPlaylist: (playlist: string, index: number) => void;
  };

  playsList: (list: string[], index: number) => void;
};

/** show on right click */
const Playlists = (props: Props) => {
  const [selectedPlaylist, setSelectedPlaylist] = createSignal("");

  return (
    <Show
      when={selectedPlaylist()}
      fallback={
        <PlaylistList
          playlists={props.playlist.playlists}
          makePlaylist={props.playlist.makePlaylist}
          deletePlaylist={props.playlist.deletePlaylist}
          select={setSelectedPlaylist}
        />
      }>
      {name => (
        <Playlist
          files={props.files}
          name={name}
          audioIDs={props.playlist.playlists[name] ?? []}
          reset={() => setSelectedPlaylist("")}
          playsList={props.playsList}
          remove={index => props.playlist.removeFromPlaylist(name, index)}
        />
      )}
    </Show>
  );
};

export default Playlists;
