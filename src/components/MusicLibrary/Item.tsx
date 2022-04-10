import React from "react";

import Icon from "components/GoogleIcon";
import useRightMenu from "hooks/useRightMenu";

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
export const Item: React.FC<Props> = ({
  id,
  name,
  play,
  playlist,
  addToPlaylist,
}) => {
  return (
    <li>
      {name} <button onClick={play}>play</button>
      <button
        onClick={useRightMenu()([
          { type: "button", label: "play", onClick: play },
          { type: "hr" },
          {
            type: "list",
            label: "add to playlist",
            list: Object.keys(playlist).map(name => ({
              type: "button",
              label: name,
              onClick: () => addToPlaylist(name, id),
            })),
          },
        ])}>
        <Icon icon="more_horiz" />
      </button>
    </li>
  );
};
