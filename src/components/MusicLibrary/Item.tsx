import { mapArray } from "solid-js";
import Icon from "~/components/GoogleIcon";
import useRightMenu from "~/hooks/useRightMenu";

type Props = {
  id: string;
  name: string;
  play: () => void;

  playlist: Record<string, string[]>;
  addToPlaylist: (playlist: string, audioId: string) => void;
};

/**
 * item of musics list
 */
export const Item = (props: Props) => {
  const onClick = useRightMenu()([
    { type: "button", label: "play", onClick: () => props.play() },
    { type: "hr" },
    {
      type: "list",
      label: "add to playlist",
      list: mapArray(
        () => Object.keys(props.playlist),
        name => ({
          type: "button" as const,
          label: name,
          onClick: () => props.addToPlaylist(name, props.id),
        })
      )(),
    },
  ]);

  return (
    <li>
      {props.name} <button onClick={() => props.play()}>play</button>
      <button onClick={onClick}>
        <Icon icon="more_horiz" />
      </button>
    </li>
  );
};
