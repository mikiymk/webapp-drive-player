import { mapArray, useContext } from "solid-js";
import Icon from "~/components/GoogleIcon";
import { Context } from "../RightMenu";

type Props = {
  id: string;
  name: string;
  play: () => void;

  playlist: string[];
  addToPlaylist: (playlist: string, audioId: string) => void;
};

/**
 * item of musics list
 */
export const Item = (props: Props) => {
  const onClick = () => [
    { type: "button", label: "play", onClick: () => props.play() },
    { type: "hr" },
    {
      type: "list",
      label: "add to playlist",
      list: mapArray(
        () => props.playlist,
        name => ({
          type: "button" as const,
          label: name,
          onClick: () => props.addToPlaylist(name, props.id),
        })
      )(),
    },
  ];

  return (
    <li>
      {props.name} <button onClick={() => props.play()}>play</button>
      <button onClick={[useContext(Context), onClick()]}>
        <Icon icon="more_horiz" />
      </button>
    </li>
  );
};
