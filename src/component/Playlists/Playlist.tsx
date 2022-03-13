import React from "react";
import { css } from "@linaria/core";
import { File } from "file";

const style = css``;

type Props = {
  files: Record<string, File>;
  name: string;
  audioIDs: string[];

  reset: () => void;
};

/** show on right click */
const Playlist: React.FC<Props> = ({ files, name, audioIDs, reset }) => {
  return (
    <div className={style}>
      <h3>{name}</h3>
      <button onClick={reset}>back to list</button>
      <ul>
        {audioIDs.map(id => (
          <li key={id}>{files[id].info?.base?.title ?? files[id].name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
