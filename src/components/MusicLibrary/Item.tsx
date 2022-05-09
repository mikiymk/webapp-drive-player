import { mapArray, useContext } from "solid-js";
import { usePlaylists } from "~/hooks/createPlaylists";
import { IconDotInfo } from "../Icon";
import { Context } from "../RightMenu";

type Props = {
  id: string;
  name: string;
  play: () => void;
};

/**
 * item of musics list
 */
export const Item = (props: Props) => {
  const playlists = usePlaylists();
  const onClick = () => [
    { type: "button", label: "play", onClick: () => props.play() },
    { type: "hr" },
    {
      type: "list",
      label: "add to playlist",
      list: mapArray(
        () => Object.keys(playlists.playlists),
        name => ({
          type: "button" as const,
          label: name,
          onClick: () => playlists.addAudioToPlaylist(name, props.id),
        })
      )(),
    },
  ];

  return (
    <li>
      {props.name} <button onClick={() => props.play()}>play</button>
      <button onClick={[useContext(Context), onClick()]}>
        <IconDotInfo />
      </button>
    </li>
  );
};
