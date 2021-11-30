import React from "react";

import { File } from "file";

type Props = {
  file: File;
  click: (file: File) => void;
  folder?: boolean;
};

export const Item: React.FC<Props> = ({ file, click, folder }) => {
  return (
    <li>
      <a onClick={() => click(file)}>
        {folder && "Folder:"}
        {file.name}({file.id})
      </a>
    </li>
  );
};
