import React from "react";
import { File } from "../../file";

export const Item: React.FC<{
  file: File;
  click: (file: File) => void;
  folder?: boolean;
}> = ({ file, click, folder }) => (
  <li>
    <a onClick={() => click(file)}>
      {folder && "Folder:"}
      {file.name}({file.id})
    </a>
  </li>
);
