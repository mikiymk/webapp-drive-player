import React from "react";
import { css } from "@linaria/core";
import { File } from "file";

const style = css``;

type Props = {
  files: Record<string, File>;
  name: string;
  audioIDs: string[];

  reset: () => void;
  playsList: (list: string[], index: number) => void;
};

/** show on right click */
const Playlist: React.FC<Props> = ({
  files,
  name,
  audioIDs,
  reset,
  playsList,
}) => {
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
            <li key={id + index}>{name}</li>
          ))}
      </ul>
    </div>
  );
};

export default Playlist;
