import React from "react";
import { File } from "../../file";

export const Breadcrumbs: React.FC<{
  parents: File[];
  setParents: (parents: File[]) => void;
}> = ({ parents, setParents }) => (
  <div>
    {parents
      .map((parent, index) => (
        <a
          key={parent.id}
          onClick={() => setParents(parents.slice(0, index + 1))}>
          {parent.name}
        </a>
      ))
      .flatMap((value, index) => [index !== 0 && " > ", value])}
  </div>
);
