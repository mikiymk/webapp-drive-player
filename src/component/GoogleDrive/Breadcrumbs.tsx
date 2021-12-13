import React from "react";

import { File } from "file";

type Props = {
  parents: File[];
  move: (index: number) => void;
};

export const Breadcrumbs: React.FC<Props> = ({ parents, move }) => {
  return (
    <ul className="drive-bread">
      {parents.map((parent, index) => (
        <li key={parent.id} onClick={() => move(index)}>
          {parent.name}
        </li>
      ))}
    </ul>
  );
};
