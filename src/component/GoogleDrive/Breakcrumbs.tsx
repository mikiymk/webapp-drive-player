import React from "react";

import { File } from "file";

type Props = {
  parents: File[];
  move: (index: number) => void;
};

export const Breadcrumbs: React.FC<Props> = ({ parents, move }) => {
  return (
    <div>
      {parents
        .map((parent, index) => (
          <a key={parent.id} onClick={() => move(index)}>
            {parent.name}
          </a>
        ))
        .flatMap((value, index) => [index !== 0 && <span>&gt;</span>, value])}
    </div>
  );
};
