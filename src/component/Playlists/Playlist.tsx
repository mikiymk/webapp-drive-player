import React from "react";
import { css } from "@linaria/core";
import { File } from "file";
import Icon from "component/Common/Icon";
import useRightMenu from "component/RightMenu/useRightMenu";

const style = css``;

type Props = {
  files: Record<string, File>;
  name: string;
  audioIDs: string[];

  reset: () => void;
  playsList: (list: string[], index: number) => void;
  remove: (index: number) => void;
};

/** show on right click */
const Playlist: React.FC<Props> = ({
  files,
  name,
  audioIDs,
  reset,
  playsList,
  remove,
}) => {
  const rightMenu = useRightMenu();
  return (
    <div className={style}>
      <h3>{name}</h3>
      <button onClick={reset}>back to list</button>
      <button onClick={() => playsList(audioIDs, 0)}>play this playlist</button>
      <ul>
        {audioIDs
          .map(id => ({
            id,
            name: files[id].info?.base?.title ?? files[id].name,
          }))
          .map(({ id, name }, index) => (
            <li key={id + index}>
              {name}
              <button
                onClick={rightMenu([
                  {
                    type: "button",
                    label: "play",
                    onClick: () => playsList(audioIDs, index),
                  },

                  {
                    type: "button",
                    label: "remove from playlist",
                    onClick: () => remove(index),
                  },
                ])}>
                <Icon icon="more_horiz" />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Playlist;
