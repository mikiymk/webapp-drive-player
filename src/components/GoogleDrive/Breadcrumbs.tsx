import React from "react";

import { File } from "file";
import { styleBread, styleBreadcrumbs } from "./style";

type Props = {
  parents: File[];
  move: (index: number) => void;
};

export const Breadcrumbs: React.FC<Props> = ({ parents, move }) => {
  return (
    <ul className={styleBreadcrumbs}>
      {parents
        .map((parent, index) => (
          <li
            key={parent.id}
            className={styleBread}
            onClick={() => move(index)}>
            {parent.name}
          </li>
        ))
        .flatMap((element, index) =>
          index === 0 ? [element] : [" > ", element]
        )}
    </ul>
  );
};
