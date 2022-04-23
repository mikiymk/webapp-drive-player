import React from "react";

import { File } from "~/file";
import { styleBread, styleBreadcrumbs } from "./style.css";

type Props = {
  parents: File[];
  move: (index: number) => void;
};

export const Breadcrumbs: React.FC<Props> = ({ parents, move }) => {
  return (
    <ul className={styleBreadcrumbs}>
      {parents
        .map((parent, index) => (
          <Bread key={parent.id} parent={parent} move={() => move(index)} />
        ))
        .flatMap((element, index) =>
          index === 0 ? [element] : [" > ", element]
        )}
    </ul>
  );
};

type PropsBread = {
  parent: File;
  move: () => void;
};

const Bread: React.FC<PropsBread> = ({ parent, move }) => {
  return (
    <li className={styleBread} onClick={move}>
      {parent.name}
    </li>
  );
};
