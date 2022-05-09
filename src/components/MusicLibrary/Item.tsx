import { createMemo, mapArray, useContext } from "solid-js";
import { usePlaylists } from "~/hooks/createPlaylists";
import { IconDotInfo } from "../Icon";
import { Context } from "../RightMenu";
import type RightMenuItem from "../RightMenu/Item";

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
  const playlistNames = createMemo(() => Object.keys(playlists.playlists));

  const onClick = (): RightMenuItem[] => [
    { type: "button", label: "play", onClick: () => props.play() },
    { type: "hr" },
    {
      type: "list",
      label: "add to playlist",
      list: mapArray(playlistNames, name => ({
        type: "button" as const,
        label: name,
        onClick: () => playlists.addAudioToPlaylist(name, props.id),
      }))(),
    },
  ];

  return (
    <li>
      {props.name} <button onClick={() => props.play()}>play</button>
      <button onClick={event => useContext(Context)(onClick(), event)}>
        <IconDotInfo />
      </button>
    </li>
  );
};
