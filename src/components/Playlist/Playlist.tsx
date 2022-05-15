import { stylePlaylist } from "./style.css";
import { usePlaylists } from "~/hooks/createPlaylists";
import { AudioList } from "../AudioList";

type Props = {
  name: string;

  reset: () => void;
  playsList: (list: string[], index: number) => void;
};

/** show on right click */
const Playlist = (props: Props) => {
  const playlists = usePlaylists();

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
      <AudioList
        audios={playlists.playlists[props.name]?.audios ?? []}
        play={props.playsList}
        extendMenu={(_, index) => [
          {
            type: "button",
            label: "remove from playlist",
            onClick: () => playlists.removeAudioFromPlaylist(props.name, index),
          },
        ]}
      />
    </div>
  );
};

export default Playlist;
