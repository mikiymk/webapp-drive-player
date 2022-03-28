import React from "react";

import Icon from "components/GoogleIcon";

import { File } from "file";
import { styleItem, styleItemIcon } from "./style";

type Props = {
  file: File;
  click: (file: File) => void;
  folder?: boolean;
};

export const Item: React.FC<Props> = ({ file, click, folder }) => {
  return (
    <li className={styleItem} onClick={() => click(file)}>
      {folder ? (
        <Icon icon="folder" className={styleItemIcon} />
      ) : (
        <Icon icon="audio_file" className={styleItemIcon} />
      )}
      <span>{file.name}</span>
    </li>
  );
};
