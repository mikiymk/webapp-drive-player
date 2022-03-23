import React from "react";
import { css } from "@linaria/core";

import { File } from "file";

const style = css`
  background-color: gray;

  &-item {
    display: inline;

    &:hover {
      cursor: pointer;
    }
  }
`;

type Props = {
  parents: File[];
  move: (index: number) => void;
};

export const Breadcrumbs: React.FC<Props> = ({ parents, move }) => {
  return (
    <ul className={style}>
      {parents
        .map((parent, index) => (
          <li
            key={parent.id}
            className={`${style}-item`}
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
