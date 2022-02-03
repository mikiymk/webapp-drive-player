import React from "react";

import Icon from "component/Common/Icon";
import useRightMenu from "component/RightMenu/useRightMenu";

type Props = {
  name: string;
  play: () => void;
};

/**
 * item of musics list
 */
export const Item: React.FC<Props> = ({ name, play }) => {
  let a: React.MouseEventHandler<HTMLButtonElement>;
  return (
    <li>
      {name} <button onClick={play}>play</button>
      <button
        onClick={useRightMenu([
          { type: "button", label: "play", onClick: play },
          { type: "hr" },
        ])}>
        <Icon icon="more_horiz" />
      </button>
    </li>
  );
};
