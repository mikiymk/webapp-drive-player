import PlaylistList from "./PlaylistList";
import Playlist from "./Playlist";
import type { File } from "~/file";
import { createSignal, Show } from "solid-js";

type Props = {
  files: Record<string, File>;

  playlists: string[];
  playlist: (name: string) => { id: string; title: string }[];
  makePlaylist: (playlist: string) => void;
  deletePlaylist: (playlist: string) => void;
  addToPlaylist: (playlist: string, audioId: string) => void;
  removeFromPlaylist: (playlist: string, index: number) => void;

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
          playlists={props.playlists}
          makePlaylist={props.makePlaylist}
          deletePlaylist={props.deletePlaylist}
          select={setSelectedPlaylist}
        />
      }>
      {name => (
        <Playlist
          files={props.files}
          name={name}
          audios={props.playlist(name)}
          reset={() => setSelectedPlaylist("")}
          playsList={props.playsList}
          remove={index => props.removeFromPlaylist(name, index)}
        />
      )}
    </Show>
  );
};

export default Playlists;
