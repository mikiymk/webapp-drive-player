import React from "react";

import Icon from "component/Common/Icon";

import { File } from "file";

type Props = {
  file: File;
  click: (file: File) => void;
  folder?: boolean;
};

export const Item: React.FC<Props> = ({ file, click, folder }) => {
  return (
    <li className="drive-list-item" onClick={() => click(file)}>
      {folder ? <Icon icon="folder" /> : <Icon icon="audio_file" />}
      <span>{file.name}</span>
    </li>
  );
};
